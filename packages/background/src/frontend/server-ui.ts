import EventEmitter from "eventemitter3";
import { withContextPort } from ".";
import { Handle } from "../types";
import { Backend } from "../backend/core";
import {
	BACKEND_EVENT,
	CHANNEL_POPUP_NOTIFICATIONS,
	CHANNEL_POPUP_RPC,
	UI_RPC_METHOD_GET_USER_DATA,
	UI_RPC_METHOD_KEYRING_STORE_CREATE,
	UI_RPC_METHOD_KEYRING_STORE_UNLOCK,
	UI_RPC_METHOD_SOLANA_SIGN_ALL_TRANSACTIONS,
	UI_RPC_METHOD_SOLANA_SIGN_AND_SEND_TRANSACTION,
	UI_RPC_METHOD_SOLANA_SIGN_TRANSACTION,
	UI_RPC_METHOD_KEYRING_STORE_LOCK,
	UI_RPC_METHOD_KEYRING_DERIVE_WALLET,
	UI_RPC_METHOD_KEYRING_KEY_DELETE,
	UI_RPC_METHOD_KEYRING_IMPORT_SECRET_KEY,
	UI_RPC_METHOD_KEYRING_EXPORT_SECRET_KEY,
	UI_RPC_METHOD_KEYRING_EXPORT_MNEMONIC,
	UI_RPC_METHOD_KEYRING_STORE_READ_ALL_PUBKEYS,
	UI_RPC_METHOD_KEYRING_STORE_STATE,
	UI_RPC_METHOD_KEYRING_STORE_MNEMONIC_CREATE,
	UI_RPC_METHOD_CONNECTION_URL_READ,
	UI_RPC_METHOD_CONNECTION_URL_UPDATE,
	UI_RPC_METHOD_KEYNAME_UPDATE,
	UI_RPC_METHOD_PASSWORD_UPDATE,
	UI_RPC_METHOD_SETTINGS_DARK_MODE_READ,
	UI_RPC_METHOD_SETTINGS_DARK_MODE_UPDATE,
	UI_RPC_METHOD_SOLANA_COMMITMENT_READ,
	UI_RPC_METHOD_SOLANA_COMMITMENT_UPDATE,
	UI_RPC_METHOD_APPROVED_ORIGINS_READ,
	UI_RPC_METHOD_APPROVED_ORIGINS_UPDATE,
	UI_RPC_METHOD_HD_KEYRING_CREATE,
	UI_RPC_METHOD_KEYRING_CREATE,
	UI_RPC_METHOD_KEYRING_STORE_KEEP_ALIVE,
	UI_RPC_METHOD_KEYRING_RESET_MNEMONIC,
	UI_RPC_METHOD_KEYRING_AUTOLOCK_UPDATE,
	UI_RPC_METHOD_SIGN_IN,
	UI_RPC_METHOD_SIGN_OUT,
	UI_RPC_METHOD_OTA_READ_PUBKEY,
	UI_RPC_METHOD_KEYRING_STORE_CREATE_NEW,
	UI_RPC_METHOD_KEYRING_STORE_CREATE_EXISTING,
	UI_RPC_METHOD_WALLET_DATA_ACTIVE_WALLET,
	UI_RPC_METHOD_WALLET_DATA_ACTIVE_WALLET_UPDATE,
	UI_RPC_METHOD_IS_MNEMONIC_IN_DB,
	UI_RPC_METHOD_SOLANA_PREPARE_OTA_TRANSACTION,
	ChannelAppUi,
	getLogger,
	UI_RPC_METHOD_WALLET_DATA_DELEGATE_WALLET,
	UI_RPC_METHOD_WALLET_DATA_DELEGATE_WALLET_UPDATE,
	UI_RPC_METHOD_OTA_IS_ID_TOKEN_VALID,
	UI_RPC_METHOD_OTA_TRANSFER_DELEGATE_LOCAL,
	UI_RPC_METHOD_OTA_TRANSFER_DELEGATE_SERVER,
} from "@valet/lib";
import { Context, RpcRequest, RpcResponse } from "../types";
import { DerivationPath } from "../keyring";
import { KeyringStoreState } from "../keyring/keystore";

const logger = getLogger("background-server-ui");

export function start(events: EventEmitter, b: Backend): Handle {
	const rpcServerUi = ChannelAppUi.server(CHANNEL_POPUP_RPC);
	const notificationsUi = ChannelAppUi.notifications(
		CHANNEL_POPUP_NOTIFICATIONS
	);

	events.on(BACKEND_EVENT, (notification: any) => {
		notificationsUi.pushNotification(notification);
	});

	rpcServerUi.handler(withContextPort(b, events, handle));

	return {
		rpcServerUi,
		notificationsUi,
	};
}

async function handle<T = any>(
	ctx: Context<Backend>,
	msg: RpcRequest
): Promise<RpcResponse<T>> {
	logger.debug(`handle rpc ${msg.method}`, msg);

	const { method, params } = msg;
	switch (method) {
		//
		// Keyring.
		//
		case UI_RPC_METHOD_KEYRING_STORE_CREATE:
			return await handleKeyringStoreCreate(
				ctx,
				params[0],
				params[1],
				params[2]
			);
		case UI_RPC_METHOD_KEYRING_STORE_CREATE_NEW:
			return await handleKeyringStoreCreateNew(ctx, params[0], params[1]);
		case UI_RPC_METHOD_KEYRING_STORE_CREATE_EXISTING:
			return await handleKeyringStoreCreateExisting(ctx, params[0]);
		case UI_RPC_METHOD_KEYRING_STORE_UNLOCK:
			return await handleKeyringStoreUnlock(ctx, params[0]);
		case UI_RPC_METHOD_KEYRING_STORE_LOCK:
			return await handleKeyringStoreLock(ctx);
		case UI_RPC_METHOD_KEYRING_STORE_READ_ALL_PUBKEYS:
			return await handleKeyringStoreReadAllPubkeys(ctx);
		case UI_RPC_METHOD_HD_KEYRING_CREATE:
			return await handleHdKeyringCreate(ctx, params[0]);
		case UI_RPC_METHOD_KEYRING_CREATE:
			return await handleKeyringCreate(ctx, params[0]);
		case UI_RPC_METHOD_KEYRING_KEY_DELETE:
			return await handleKeyringKeyDelete(ctx, params[0]);
		case UI_RPC_METHOD_KEYRING_STORE_STATE:
			return await handleKeyringStoreState(ctx);
		case UI_RPC_METHOD_KEYRING_STORE_KEEP_ALIVE:
			return handleKeyringStoreKeepAlive(ctx);
		case UI_RPC_METHOD_KEYRING_DERIVE_WALLET:
			return await handleKeyringDeriveWallet(ctx);
		case UI_RPC_METHOD_KEYRING_IMPORT_SECRET_KEY:
			return await handleKeyringImportSecretKey(ctx, params[0], params[1]);
		case UI_RPC_METHOD_KEYRING_EXPORT_SECRET_KEY:
			return handleKeyringExportSecretKey(ctx, params[0], params[1]);
		case UI_RPC_METHOD_KEYRING_EXPORT_MNEMONIC:
			return handleKeyringExportMnemonic(ctx, params[0]);
		case UI_RPC_METHOD_KEYRING_RESET_MNEMONIC:
			return handleKeyringResetMnemonic(ctx, params[0]);
		case UI_RPC_METHOD_KEYRING_AUTOLOCK_UPDATE:
			return await handleKeyringAutolockUpdate(ctx, params[0]);
		case UI_RPC_METHOD_KEYRING_STORE_MNEMONIC_CREATE:
			return await handleMnemonicCreate(ctx);

		case UI_RPC_METHOD_SIGN_IN:
			return await handleSignIn(ctx);
		case UI_RPC_METHOD_SIGN_OUT:
			return await handleSignOut(ctx);
		case UI_RPC_METHOD_GET_USER_DATA:
			return await handleGetUserData(ctx);
		case UI_RPC_METHOD_IS_MNEMONIC_IN_DB:
			return await handleIsMnemonicInDb(ctx);

		// Wallet signing.
		//
		case UI_RPC_METHOD_SOLANA_SIGN_TRANSACTION:
			return await handleSignTransaction(ctx, params[0], params[1]);
		case UI_RPC_METHOD_SOLANA_SIGN_ALL_TRANSACTIONS:
			return await handleSignAllTransactions(ctx, params[0], params[1]);
		case UI_RPC_METHOD_SOLANA_SIGN_AND_SEND_TRANSACTION:
			return await handleSignAndSendTransaction(ctx, params[0], params[1]);
		case UI_RPC_METHOD_SOLANA_PREPARE_OTA_TRANSACTION:
			return await handlePrepareOtaTx(ctx, params[0], params[1]);
		//
		// Connection URL.
		//
		case UI_RPC_METHOD_CONNECTION_URL_READ:
			return await handleConnectionUrlRead(ctx);
		case UI_RPC_METHOD_CONNECTION_URL_UPDATE:
			return await handleConnectionUrlUpdate(ctx, params[0]);
		//
		// Ota
		//
		case UI_RPC_METHOD_OTA_READ_PUBKEY:
			return await handleOtaReadPubkey(ctx);

		case UI_RPC_METHOD_OTA_IS_ID_TOKEN_VALID:
			return await handleOtaIsIdTokenValid(ctx);
		case UI_RPC_METHOD_OTA_TRANSFER_DELEGATE_LOCAL:
			return await handleOtaTransferDelegateLocal(ctx, params[0], params[1]);
		case UI_RPC_METHOD_OTA_TRANSFER_DELEGATE_SERVER:
			return await handleOtaTransferDelegateServer(ctx, params[0], params[1], params[2]);
		//
		// Wallet app settings.
		//
		case UI_RPC_METHOD_WALLET_DATA_ACTIVE_WALLET:
			return await handleWalletDataActiveWallet(ctx);
		case UI_RPC_METHOD_WALLET_DATA_ACTIVE_WALLET_UPDATE:
			return await handleWalletDataActiveWalletUpdate(ctx, params[0]);
		case UI_RPC_METHOD_WALLET_DATA_DELEGATE_WALLET:
			return await handleWalletDataDelegateWallet(ctx);
		case UI_RPC_METHOD_WALLET_DATA_DELEGATE_WALLET_UPDATE:
			return await handleWalletDataDelegateWalletUpdate(ctx, params[0]);
		case UI_RPC_METHOD_SETTINGS_DARK_MODE_READ:
			return await handleDarkModeRead(ctx);
		case UI_RPC_METHOD_SETTINGS_DARK_MODE_UPDATE:
			return await handleDarkModeUpdate(ctx, params[0]);
		case UI_RPC_METHOD_APPROVED_ORIGINS_READ:
			return await handleApprovedOriginsRead(ctx);
		case UI_RPC_METHOD_APPROVED_ORIGINS_UPDATE:
			return await handleApprovedOriginsUpdate(ctx, params[0]);
		//
		// Nicknames for keys.
		//
		case UI_RPC_METHOD_KEYNAME_UPDATE:
			return await handleKeynameUpdate(ctx, params[0], params[1]);
		case UI_RPC_METHOD_PASSWORD_UPDATE:
			return await handlePasswordUpdate(ctx, params[0], params[1]);
		//
		// Solana.
		//
		case UI_RPC_METHOD_SOLANA_COMMITMENT_READ:
			return await handleSolanaCommitmentRead(ctx);
		case UI_RPC_METHOD_SOLANA_COMMITMENT_UPDATE:
			return await handleSolanaCommitmentUpdate(ctx, params[0]);
		default:
			throw new Error(`unexpected ui rpc method: ${method}`);
	}
}

async function handleKeyringStoreCreate(
	ctx: Context<Backend>,
	mnemonic: string,
	derivationPath: DerivationPath,
	password: string
): Promise<RpcResponse<string>> {
	const resp = await ctx.backend.keyringStoreCreate(
		mnemonic,
		derivationPath,
		password
	);
	return [resp];
}

async function handleKeyringStoreUnlock(
	ctx: Context<Backend>,
	password: string
) {
	try {
		const resp = await ctx.backend.keyringStoreUnlock(password);
		return [resp];
	} catch (err) {
		return [undefined, String(err)];
	}
}

async function handleKeyringStoreLock(ctx: Context<Backend>) {
	const resp = await ctx.backend.keyringStoreLock();
	return [resp];
}

async function handleHdKeyringCreate(
	ctx: Context<Backend>,
	mnemonic: string
): Promise<RpcResponse<string>> {
	const resp = ctx.backend.hdKeyringCreate(mnemonic);
	return [resp];
}

async function handleKeyringCreate(
	ctx: Context<Backend>,
	secretKey: string
): Promise<RpcResponse<string>> {
	const resp = ctx.backend.keyringCreate(secretKey);
	return [resp];
}

async function handleKeyringStoreState(
	ctx: Context<Backend>
): Promise<RpcResponse<KeyringStoreState>> {
	const resp = await ctx.backend.keyringStoreState();
	return [resp];
}

function handleKeyringStoreKeepAlive(
	ctx: Context<Backend>
): RpcResponse<string> {
	const resp = ctx.backend.keyringStoreKeepAlive();
	return [resp];
}

async function handleConnectionUrlRead(
	ctx: Context<Backend>
): Promise<RpcResponse<string>> {
	const resp = await ctx.backend.connectionUrlRead();
	return [resp];
}

async function handleConnectionUrlUpdate(
	ctx: Context<Backend>,
	url: string
): Promise<RpcResponse<boolean>> {
	const didChange = await ctx.backend.connectionUrlUpdate(url);
	return [didChange];
}

async function handleWalletDataActiveWallet(
	ctx: Context<Backend>
): Promise<RpcResponse<string>> {
	const pubkey = await ctx.backend.activeWallet();
	return [pubkey];
}

async function handleWalletDataActiveWalletUpdate(
	ctx: Context<Backend>,
	newWallet: string
): Promise<RpcResponse<string>> {
	const resp = await ctx.backend.activeWalletUpdate(newWallet);
	return [resp];
}

async function handleWalletDataDelegateWallet(
	ctx: Context<Backend>
): Promise<RpcResponse<string>> {
	const pubkey = await ctx.backend.delegateWallet();
	return [pubkey];
}

async function handleWalletDataDelegateWalletUpdate(
	ctx: Context<Backend>,
	newWallet: string
): Promise<RpcResponse<string>> {
	const resp = await ctx.backend.delegateWalletUpdate(newWallet);
	return [resp];
}

async function handleKeyringStoreReadAllPubkeys(
	ctx: Context<Backend>
): Promise<RpcResponse<Array<string>>> {
	const resp = await ctx.backend.keyringStoreReadAllPubkeys();
	return [resp];
}

async function handleKeyringDeriveWallet(
	ctx: Context<Backend>
): Promise<RpcResponse<string>> {
	const resp = await ctx.backend.keyringDeriveWallet();
	return [resp];
}

async function handleKeynameUpdate(
	ctx: Context<Backend>,
	pubkey: string,
	newName: string
): Promise<RpcResponse<string>> {
	const resp = await ctx.backend.keynameUpdate(pubkey, newName);
	return [resp];
}

async function handleKeyringKeyDelete(
	ctx: Context<Backend>,
	pubkey: string
): Promise<RpcResponse<string>> {
	const resp = await ctx.backend.keyringKeyDelete(pubkey);
	return [resp];
}

async function handlePasswordUpdate(
	ctx: Context<Backend>,
	currentPassword: string,
	newPassword: string
): Promise<RpcResponse<string>> {
	try {
		const resp = await ctx.backend.passwordUpdate(currentPassword, newPassword);
		return [resp];
	} catch (err: any) {
		return [undefined, String(err)];
	}
}

async function handleKeyringImportSecretKey(
	ctx: Context<Backend>,
	secretKey: string,
	name: string
): Promise<RpcResponse<string>> {
	const resp = await ctx.backend.importSecretKey(secretKey, name);
	return [resp];
}

function handleKeyringExportSecretKey(
	ctx: Context<Backend>,
	password: string,
	pubkey: string
): RpcResponse<string> {
	const resp = ctx.backend.keyringExportSecretKey(password, pubkey);
	return [resp];
}

function handleKeyringExportMnemonic(
	ctx: Context<Backend>,
	password: string
): RpcResponse<string> {
	const resp = ctx.backend.keyringExportMnemonic(password);
	return [resp];
}

function handleKeyringResetMnemonic(
	ctx: Context<Backend>,
	password: string
): RpcResponse<string> {
	const resp = ctx.backend.keyringResetMnemonic(password);
	return [resp];
}

async function handleKeyringAutolockUpdate(
	ctx: Context<Backend>,
	autolockSecs: number
): Promise<RpcResponse<string>> {
	const resp = await ctx.backend.keyringAutolockUpdate(autolockSecs);
	return [resp];
}

async function handleMnemonicCreate(
	ctx: Context<Backend>
): Promise<RpcResponse<string>> {
	const resp = await ctx.backend.mnemonicCreate();
	return [resp];
}

async function handleKeyringStoreCreateNew(
	ctx: Context<Backend>,
	mnemonic: string,
	password: string
): Promise<RpcResponse<string>> {
	const resp = await ctx.backend.keyringStoreCreateNew(mnemonic, password);
	return [resp];
}

async function handleKeyringStoreCreateExisting(
	ctx: Context<Backend>,
	password: string
): Promise<RpcResponse<string>> {
	const resp = await ctx.backend.keyringStoreCreateExisting(password);
	return [resp];
}

async function handleDarkModeRead(
	ctx: Context<Backend>
): Promise<RpcResponse<boolean>> {
	const resp = await ctx.backend.darkModeRead();
	return [resp];
}

async function handleDarkModeUpdate(
	ctx: Context<Backend>,
	darkMode: boolean
): Promise<RpcResponse<string>> {
	const resp = await ctx.backend.darkModeUpdate(darkMode);
	return [resp];
}

async function handleSolanaCommitmentRead(
	ctx: Context<Backend>
): Promise<RpcResponse<string>> {
	const resp = await ctx.backend.solanaCommitmentRead();
	return [resp];
}

async function handleSolanaCommitmentUpdate(
	ctx: Context<Backend>,
	commitment: string
): Promise<RpcResponse<string>> {
	const resp = await ctx.backend.solanaCommitmentUpdate(commitment);
	return [resp];
}

async function handleSignTransaction(
	ctx: Context<Backend>,
	messageBs58: string,
	walletAddress: string
): Promise<RpcResponse<string>> {
	const resp = await ctx.backend.signTransaction(messageBs58, walletAddress);
	return [resp];
}

async function handleSignAllTransactions(
	ctx: Context<Backend>,
	txs: Array<string>,
	walletAddress: string
): Promise<RpcResponse<string>> {
	const resp = await ctx.backend.signAllTransactions(txs, walletAddress);
	return [resp];
}

async function handleSignAndSendTransaction(
	ctx: Context<Backend>,
	tx: string,
	walletAddress: string
): Promise<RpcResponse<string>> {
	const resp = await ctx.backend.signAndSendTx(tx, walletAddress);
	return [resp];
}

async function handleOtaReadPubkey(
	ctx: Context<Backend>
): Promise<RpcResponse<string>> {
	const pubkey = await ctx.backend.otaPublickey();
	return [pubkey];
}

async function handleOtaIsIdTokenValid(
	ctx: Context<Backend>
): Promise<RpcResponse<boolean>> {
	const resp = await ctx.backend.isIdTokenValid();
	return [resp];
}

async function handleOtaTransferDelegateLocal(
	ctx: Context<Backend>,
	from: string,
	to: string
): Promise<RpcResponse<string>> {
	const resp = await ctx.backend.otaTransferDelegateLocal(from, to);
	return [resp];
}

async function handleOtaTransferDelegateServer(
	ctx: Context<Backend>,
	from: string,
	to: string,
	password: string
): Promise<RpcResponse<string>> {
	const resp = await ctx.backend.otaTransferDelegateServer(from, to, password);
	return [resp];
}

async function handlePrepareOtaTx(
	ctx: Context<Backend>,
	tx: string,
	isVersioned: boolean
): Promise<RpcResponse<[string, string]>> {
	const resp = await ctx.backend.prepareOtaTransaction(tx, isVersioned);
	return [resp];
}

async function handleApprovedOriginsRead(
	ctx: Context<Backend>
): Promise<RpcResponse<Array<string>>> {
	const resp = await ctx.backend.approvedOriginsRead();
	return [resp];
}

async function handleApprovedOriginsUpdate(
	ctx: Context<Backend>,
	approvedOrigins: Array<string>
): Promise<RpcResponse<string>> {
	const resp = await ctx.backend.approvedOriginsUpdate(approvedOrigins);
	return [resp];
}

async function handleSignIn(ctx: Context<Backend>) {
	const resp = await ctx.backend.signIn();
	return [resp];
}

async function handleSignOut(ctx: Context<Backend>) {
	const resp = await ctx.backend.signOut();
	return [resp];
}

async function handleGetUserData(ctx: Context<Backend>) {
	const resp = await ctx.backend.getUserData();
	return [resp];
}

async function handleIsMnemonicInDb(ctx: Context<Backend>) {
	const resp = await ctx.backend.isMnemonicInDb();
	return [resp];
}
