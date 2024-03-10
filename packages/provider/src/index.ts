import type { Event } from "@valet/lib";
import {
	CHANNEL_SOLANA_NOTIFICATION,
	CHANNEL_SOLANA_RPC_REQUEST,
	CHANNEL_SOLANA_RPC_RESPONSE,
	InjectedRequestManager,
	NOTIFICATION_ACTIVE_WALLET_UPDATED,
	NOTIFICATION_CONNECTION_URL_UPDATED,
	NOTIFICATION_SOLANA_CONNECTED,
	NOTIFICATION_SOLANA_DISCONNECTED,
	SOLANA_RPC_METHOD_CONNECT,
	SOLANA_RPC_METHOD_DISCONNECT,
	SOLANA_RPC_METHOD_SIGN_ALL_TXS,
	SOLANA_RPC_METHOD_SIGN_AND_SEND_TX,
	SOLANA_RPC_METHOD_SIGN_MESSAGE,
	SOLANA_RPC_METHOD_SIGN_TX,
	getLogger,
	isVersionedTransaction,
} from "@valet/lib";
import type {
	ConfirmOptions,
	SendOptions,
	Signer,
	Transaction,
	TransactionSignature,
	VersionedTransaction,
} from "@solana/web3.js";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

import { PrivateEventEmitter } from "./PrivateEventEmitter";
import { decode, encode } from "bs58";

const logger = getLogger("provider-solana-injection");

export class ProviderSolanaInjection extends PrivateEventEmitter {
	#options?: ConfirmOptions;
	//
	// Channel to send extension specific RPC requests to the extension.
	//
	#valetRequestManager: InjectedRequestManager;

	#requestManager: InjectedRequestManager;

	#isValet: boolean;
	#isConnected: boolean;
	#publicKey?: PublicKey;
	#connection: Connection;

	constructor() {
		super();
		if (new.target === ProviderSolanaInjection) {
			Object.freeze(this);
		}
		this.#options = undefined;
		this.#valetRequestManager = new InjectedRequestManager(
			CHANNEL_SOLANA_RPC_REQUEST,
			CHANNEL_SOLANA_RPC_RESPONSE
		);

		this.#requestManager = this.#valetRequestManager;

		this.#initChannels();

		this.#isValet = true;
		this.#isConnected = false;
		this.#publicKey = undefined;
		this.#connection = this.defaultConnection();
	}

	defaultConnection(): Connection {
		return new Connection(
			process.env.DEFAULT_SOLANA_CONNECTION_URL || clusterApiUrl("devnet")
		);
	}

	// Setup channels with the content script.
	#initChannels() {
		window.addEventListener("message", this.#handleNotification.bind(this));
	}

	#handleNotification(event: Event) {
		// if (!isValidEventOrigin(event)) return;
		if (event.data.type !== CHANNEL_SOLANA_NOTIFICATION) return;
		logger.debug("notification", event);

		switch (event.data.detail.name) {
			// BROWSER EVENTS
			case NOTIFICATION_SOLANA_CONNECTED:
				this.#handleNotificationConnected(event);
				break;
			case NOTIFICATION_SOLANA_DISCONNECTED:
				this.#handleNotificationDisconnected(event);
				break;
			case NOTIFICATION_CONNECTION_URL_UPDATED:
				this.#handleNotificationConnectionUrlUpdated(event);
				break;
			case NOTIFICATION_ACTIVE_WALLET_UPDATED:
				this.#handleNotificationActiveWalletUpdated(event);
				break;

			default:
				throw new Error(`unexpected notification ${event.data.detail.name}`);
		}
	}

	#handleNotificationConnected(event: Event) {
		this.emit("connect", event.data.detail);
	}

	#connect(publicKey: string, connectionUrl: string) {
		this.#isConnected = true;
		this.#publicKey = new PublicKey(publicKey);
		this.#connection = new Connection(connectionUrl);
	}

	#handleNotificationDisconnected(event: Event) {
		this.#isConnected = false;
		this.#connection = this.defaultConnection();
		this.emit("disconnect", event.data.detail);
	}

	#handleNotificationConnectionUrlUpdated(event: Event) {
		this.#connection = new Connection(event.data.detail.data.url);
		this.emit("connectionDidChange", event.data.detail);
	}

	#handleNotificationActiveWalletUpdated(event: Event) {
		this.#publicKey = new PublicKey(event.data.detail.data.activeWallet);
		this.emit("activeWalletDidChange", event.data.detail);
	}

	async connect() {
		if (this.#isConnected) {
			throw new Error("provider already connected");
		}
		// Send request to the RPC API.
		const result = await this.#requestManager.request({
			method: SOLANA_RPC_METHOD_CONNECT,
			params: [],
		});
		this.#connect(result.publicKey, result.connectionUrl);
	}

	async disconnect() {
		await this.#requestManager.request({
			method: SOLANA_RPC_METHOD_DISCONNECT,
			params: [],
		});
		this.#connection = this.defaultConnection();
		this.#publicKey = undefined;
	}

	async sendAndConfirm<T extends Transaction | VersionedTransaction>(
		tx: T,
		signers?: Signer[],
		options?: ConfirmOptions,
		connection?: Connection,
		publicKey?: PublicKey
	): Promise<TransactionSignature> {
		if (!this.#publicKey) {
			throw new Error("wallet not connected");
		}
		let _connection = connection ? connection : this.#connection;
		return await this.send(
			tx,
			signers,
			options,
			_connection,
			this.#publicKey,
			true
		);
	}

	async send<T extends Transaction | VersionedTransaction>(
		tx: T,
		signers?: Signer[],
		options?: SendOptions,
		connection?: Connection,
		publicKey?: PublicKey,
		confirmTransaction?: boolean
	): Promise<TransactionSignature> {
		if (!this.#publicKey) {
			throw new Error("wallet not connected");
		}
		let _connection = connection ? connection : this.#connection;
		const versioned = isVersionedTransaction(tx);
		if (!versioned) {
			if (signers) {
				signers.forEach((s: Signer) => {
					tx.partialSign(s);
				});
			}
			if (!tx.feePayer) {
				tx.feePayer = publicKey;
			}
			if (!tx.recentBlockhash) {
				const { blockhash } = await _connection!.getLatestBlockhash(
					options?.preflightCommitment
				);
				tx.recentBlockhash = blockhash;
			}
		} else {
			if (signers) {
				tx.sign(signers);
			}
		}
		const txSerialize = tx.serialize({
			requireAllSignatures: false,
		});
		const txStr = encode(txSerialize);
		return await this.#requestManager.request({
			method: SOLANA_RPC_METHOD_SIGN_AND_SEND_TX,
			params: [txStr, this.#publicKey.toString(), options, confirmTransaction],
		});
	}

	// @ts-ignore
	async sendAll<T extends Transaction | VersionedTransaction>(
		_txWithSigners: { tx: T; signers?: Signer[] }[],
		_opts?: ConfirmOptions,
		connection?: Connection,
		publicKey?: PublicKey
	): Promise<Array<TransactionSignature>> {
		throw new Error("sendAll not implemented");
	}

	async signTransaction<T extends Transaction | VersionedTransaction>(
		tx: T,
		publicKey?: PublicKey,
		connection?: Connection
	): Promise<T> {
		if (!this.publicKey) {
			throw new Error("wallet not connected");
		}
		const pk = publicKey ?? this.publicKey
		let _connection = connection ? connection : this.#connection;
		const versioned = isVersionedTransaction(tx);
		if (!versioned) {
			if (!tx.feePayer) {
				tx.feePayer = publicKey;
			}
			if (!tx.recentBlockhash) {
				const { blockhash } = await _connection!.getLatestBlockhash();
				tx.recentBlockhash = blockhash;
			}
		}
		const txStr = encode(tx.serialize({ requireAllSignatures: false }));
		const signature: string = await this.#requestManager.request({
			method: SOLANA_RPC_METHOD_SIGN_TX,
			params: [txStr, pk.toString()],
		});
		// @ts-ignore
		tx.addSignature(this.#publicKey, decode(signature));
		return tx;
	}

	async signAllTransactions<T extends Transaction | VersionedTransaction>(
		txs: Array<T>,
		publicKey?: PublicKey,
		connection?: Connection
	): Promise<Array<T>> {
		if (!this.publicKey) {
			throw new Error("wallet not connected");
		}
		const pk = publicKey ?? this.publicKey;
		let _connection = connection ? connection : this.#connection;
		let _blockhash: string | undefined;
		for (let k = 0; k < txs.length; k += 1) {
			const tx = txs[k];
			if (isVersionedTransaction(tx)) {
				continue;
			}
			if (!tx.feePayer) {
				tx.feePayer = publicKey;
			}
			if (!tx.recentBlockhash) {
				if (!_blockhash) {
					const { blockhash } = await _connection!.getLatestBlockhash();
					_blockhash = blockhash;
				}
				tx.recentBlockhash = _blockhash;
			}
		}

		// Serialize messages.
		const txStrs = txs.map((tx) => {
			const txSerialized = tx.serialize({ requireAllSignatures: false });
			return encode(txSerialized);
		});

		// Get signatures from the background script.
		const signatures: Array<string> = await this.#requestManager.request({
			method: SOLANA_RPC_METHOD_SIGN_ALL_TXS,
			params: [txStrs, pk.toString()],
		});

		// Add the signatures to the transactions.
		txs.forEach((t, idx) => {
			// @ts-ignore
			t.addSignature(publicKey, decode(signatures[idx]));
		});

		return txs;
	}

	async signMessage(
		msg: Uint8Array,
		publicKey?: PublicKey
	): Promise<Uint8Array> {
		if (!this.publicKey) {
			throw new Error("wallet not connected");
		}
		const pk = publicKey ?? this.publicKey;
		const msgStr = encode(msg);
		const signature = await this.#requestManager.request({
			method: SOLANA_RPC_METHOD_SIGN_MESSAGE,
			params: [msgStr, pk.toString()],
		});
		return decode(signature);
	}

	public get isValet() {
		return this.#isValet;
	}

	public get isConnected() {
		return this.#isConnected;
	}

	public get publicKey() {
		return this.#publicKey;
	}

	public get connection() {
		return this.#connection;
	}
}
