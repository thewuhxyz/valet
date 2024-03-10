import { Commitment, SendOptions } from "@solana/web3.js";
import { Backend, SUCCESS_RESPONSE } from "../backend/core";
import {
	BACKEND_EVENT,
	CHANNEL_POPUP_RESPONSE,
	CHANNEL_SOLANA_NOTIFICATION,
	CHANNEL_SOLANA_RPC_REQUEST,
	NOTIFICATION_CONNECTION_URL_UPDATED,
	NOTIFICATION_SOLANA_CONNECTED,
	NOTIFICATION_SOLANA_DISCONNECTED,
	SOLANA_RPC_METHOD_CONNECT,
	SOLANA_RPC_METHOD_DISCONNECT,
	SOLANA_RPC_METHOD_SIGN_ALL_TXS,
	SOLANA_RPC_METHOD_SIGN_AND_SEND_TX,
	SOLANA_RPC_METHOD_SIGN_MESSAGE,
	SOLANA_RPC_METHOD_SIGN_TX,
	SOLANA_RPC_METHOD_SIMULATE,
} from "../constants";
import { getLogger } from "../logging";
import { Context, RpcRequest, RpcResponse } from "../types";
import {
	BrowserRuntimeExtension,
	UiActionRequestManager,
	openApprovalPopupWindow,
	openApproveMessagePopupWindow,
	openApproveTransactionPopupWindow,
} from "../browser";
import { ChannelAppUi, ChannelContentScript } from "../channel";
import { withContext, withContextPort } from ".";
import { Handle } from "../types";
import EventEmitter from "eventemitter3";

const logger = getLogger("server-injected");

export function start(events: EventEmitter, b: Backend): Handle {
	const solanaRpcServerInjected = ChannelContentScript.server(
		CHANNEL_SOLANA_RPC_REQUEST
	);
	const solanaNotificationsInjected = ChannelContentScript.client(
		CHANNEL_SOLANA_NOTIFICATION
	);
	const popupUiResponse = ChannelAppUi.server(CHANNEL_POPUP_RESPONSE);

	//
	// Dispatch notifications to injected web apps.
	//
	events.on(BACKEND_EVENT, (notification) => {
		switch (notification.name) {
			case NOTIFICATION_SOLANA_CONNECTED:
				solanaNotificationsInjected.sendMessageActiveTab(notification);
				break;
			case NOTIFICATION_SOLANA_DISCONNECTED:
				solanaNotificationsInjected.sendMessageActiveTab(notification);
				break;
			case NOTIFICATION_CONNECTION_URL_UPDATED:
				// TODO: generalize this some more.
				solanaNotificationsInjected.sendMessageActiveTab(notification);
				break;
			default:
				break;
		}
	});

	solanaRpcServerInjected.handler(withContext(b, events, handle));
	popupUiResponse.handler(withContextPort(b, events, handlePopupUiResponse));

	return {
		popupUiResponse,
		solanaRpcServerInjected,
		solanaNotificationsInjected,
	};
}

async function handle<T = any>(
	ctx: Context<Backend>,
	req: RpcRequest
): Promise<RpcResponse<T>> {
	logger.debug(`handle rpc ${req.method}`, req);

	const { method, params } = req;
	switch (method) {
		case SOLANA_RPC_METHOD_CONNECT:
			return await handleConnect(ctx, params[0]);
		case SOLANA_RPC_METHOD_DISCONNECT:
			return handleDisconnect(ctx);
		case SOLANA_RPC_METHOD_SIGN_AND_SEND_TX:
			return await handleSignAndSendTx(ctx, params[0], params[1], params[2]);
		case SOLANA_RPC_METHOD_SIGN_TX:
			return await handleSignTx(ctx, params[0], params[1]);
		case SOLANA_RPC_METHOD_SIGN_ALL_TXS:
			return await handleSignAllTxs(ctx, params[0], params[1]);
		case SOLANA_RPC_METHOD_SIGN_MESSAGE:
			return await handleSignMessage(ctx, params[0], params[1]);
		case SOLANA_RPC_METHOD_SIMULATE:
			return await handleSimulate(ctx, params[0], params[1], params[2]);
		default:
			throw new Error(`unexpected rpc method: ${method}`);
	}
}

// Automatically connect in the event we're unlocked and the origin
// has been previously approved. Otherwise, open a new window to prompt
// the user to unlock and approve.
//
// Note that "connected" simply means that the wallet can be used to issue
// requests because it's both approved and unlocked. There is currently no
// extra session state or connections that are maintained.
async function handleConnect(
	ctx: Context<Backend>,
	onlyIfTrustedMaybe: boolean
): Promise<RpcResponse<string>> {
	const origin = ctx.sender.origin;

	if (!origin) {
		throw new Error("origin is undefined");
	}

	const keyringStoreState = await ctx.backend.keyringStoreState();
	// const activeTab = await BrowserRuntimeExtension.activeTab();
	let didApprove = false;

	// Use the UI to ask the user if it should connect.
	if (keyringStoreState == "needs-onboarding")
		throw new Error("invariant violation keyring not created");

	if (await ctx.backend.isApprovedOrigin(origin)) {
		logger.debug("already approved so automatically connecting");
		didApprove = true;
	} else {
		const resp = await UiActionRequestManager.requestUiAction(
			(requestId: string) => {
				return openApprovalPopupWindow(origin, requestId);
			}
		);
		didApprove = !resp.windowClosed && resp.result;
		if (resp && !resp.windowClosed) {
			BrowserRuntimeExtension.closeWindow(resp.window.id);
		}
	}

	// If the user approved and unlocked, then we're connected.
	if (didApprove) {
		const publicKey = await ctx.backend.activeWallet();
		const connectionUrl = await ctx.backend.solanaConnectionUrl();
		const data = { publicKey, connectionUrl };
		ctx.events.emit(BACKEND_EVENT, {
			name: NOTIFICATION_SOLANA_CONNECTED,
			data,
		});
		return [data];
	}

	throw new Error("user did not approve");
}

function handleDisconnect(ctx: Context<Backend>): RpcResponse<string> {
	const resp = ctx.backend.disconnect();
	ctx.events.emit(BACKEND_EVENT, {
		name: NOTIFICATION_SOLANA_DISCONNECTED,
	});
	return [resp];
}

async function handleSignAndSendTx(
	ctx: Context<Backend>,
	tx: string,
	walletAddress: string,
	options?: SendOptions
): Promise<RpcResponse<string>> {
	const origin = ctx.sender.origin;

	if (!origin) {
		throw new Error("origin is undefined");
	}

	const uiResp = await UiActionRequestManager.requestUiAction(
		(requestId: string) => {
			return openApproveTransactionPopupWindow(
				ctx.sender.origin!,
				requestId,
				tx
			);
		}
	);

	if (uiResp.error) {
		logger.debug("require ui action error", uiResp);
		BrowserRuntimeExtension.closeWindow(uiResp.window.id);
		return;
	}

	let resp: RpcResponse<string>;
	const { didApprove, transaction } = uiResp.result
		? uiResp.result
		: {
				didApprove: false,
				transaction: undefined,
			};

	try {
		// Only sign if the user clicked approve.
		if (didApprove) {
			const sig = await ctx.backend.signAndSendTx(
				transaction,
				walletAddress,
				options
			);
			resp = [sig];
		}
	} catch (err) {
		logger.debug("error sign and sending transaction", err.toString());
	}

	if (!uiResp.windowClosed) {
		BrowserRuntimeExtension.closeWindow(uiResp.window.id);
	}

	if (resp) {
		return resp;
	}

	throw new Error("user denied transaction signature");
}

async function handleSignTx(
	ctx: Context<Backend>,
	txMsg: string,
	walletAddress: string
): Promise<RpcResponse<string>> {
	const origin = ctx.sender.origin;

	if (!origin) throw new Error("origin is undefined");

	const uiResp = await UiActionRequestManager.requestUiAction(
		(requestId: string) => {
			return openApproveTransactionPopupWindow(
				ctx.sender.origin!,
				requestId,
				txMsg
			);
		}
	);

	if (uiResp.error) {
		logger.debug("require ui action error", uiResp);
		BrowserRuntimeExtension.closeWindow(uiResp.window.id);
		return;
	}

	let resp: RpcResponse<string>;
	const { didApprove, transaction } = uiResp.result;

	try {
		// Only sign if the user clicked approve.
		if (didApprove) {
			const sig = await ctx.backend.signTransaction(transaction, walletAddress);
			resp = [sig];
		}
	} catch (err) {
		logger.debug("error signing transaction", err.toString());
	}

	if (!uiResp.windowClosed) {
		BrowserRuntimeExtension.closeWindow(uiResp.window.id);
	}
	if (resp) {
		return resp;
	}

	throw new Error("user denied transaction signature");
}

async function handleSignAllTxs(
	ctx: Context<Backend>,
	txs: Array<string>,
	walletAddress: string
): Promise<RpcResponse<Array<string>>> {
	const origin = ctx.sender.origin;

	if (!origin) {
		throw new Error("origin is undefined");
	}
	const resp = await ctx.backend.signAllTransactions(txs, walletAddress);
	return [resp];
} // todo: implement later

async function handleSignMessage(
	ctx: Context<Backend>,
	msg: string,
	walletAddress: string
): Promise<RpcResponse<string>> {
	const origin = ctx.sender.origin;

	if (!origin) {
		throw new Error("origin is undefined");
	}

	const uiResp = await UiActionRequestManager.requestUiAction(
		(requestId: string) => {
			return openApproveMessagePopupWindow(origin, requestId, msg);
		}
	);

	if (uiResp.error) {
		logger.debug("require ui action error", uiResp);
		BrowserRuntimeExtension.closeWindow(uiResp.window.id);
		return;
	}

	let resp: RpcResponse<string>;
	const didApprove = uiResp.result;

	try {
		if (didApprove) {
			const sig = await ctx.backend.signMessage(msg, walletAddress);
			resp = [sig];
		}
	} catch (err) {
		logger.debug("error sign message", err.toString());
	}

	if (!uiResp.windowClosed) {
		BrowserRuntimeExtension.closeWindow(uiResp.window.id);
	}
	if (resp) {
		return resp;
	}

	throw new Error("user denied message signature");

	return [null];
}

async function handleSimulate(
	ctx: Context<Backend>,
	txStr: string,
	walletAddress: string,
	commitment: Commitment
): Promise<RpcResponse<string>> {
	const resp = await ctx.backend.simulate(txStr, walletAddress, commitment);
	return [resp];
}

async function handlePopupUiResponse(
	ctx: Context<Backend>,
	msg: RpcResponse
): Promise<string> {
	const { id, result, error } = msg;
	UiActionRequestManager.resolveResponse(id, result, error);
	return SUCCESS_RESPONSE;
}
