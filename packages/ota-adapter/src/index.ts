import {
	BaseSignerWalletAdapter,
	SendTransactionOptions,
	SupportedTransactionVersions,
	TransactionOrVersionedTransaction,
	WalletDisconnectionError,
	WalletLoadError,
	WalletName,
	WalletNotConnectedError,
	WalletNotReadyError,
	WalletReadyState,
	WalletSignTransactionError,
} from "@solana/wallet-adapter-base"
import { Connection } from "@solana/web3.js"
import { OtaConfig, OtaProvider } from "@valet/ota-client"
import { icon } from "./icon"
import type { ProviderSolanaInjection } from "@valet/provider"

export const ValetOtaWalletName = "ValetOTA" as WalletName<"ValetOTA">

interface ValetWindow extends Window {
	valet?: ProviderSolanaInjection
}

declare const window: ValetWindow

export class ValetOtaWalletAdapter extends BaseSignerWalletAdapter {
	///////////////////////////////////////
	// Base Properties
	/////////////////////////////////////////
	name = ValetOtaWalletName
	url: string = "https://valetw.xyz"
	private _connecting: boolean
	private _readyState: WalletReadyState =
		typeof window === "undefined" || typeof document === "undefined"
			? WalletReadyState.Unsupported
			: WalletReadyState.Loadable

	readonly supportedTransactionVersions?: SupportedTransactionVersions =
		new Set(["legacy"])
	/////////////////////////////////////////////
	// Ota Properties
	/////////////////////////////////////////////
	private _ota: OtaProvider
	private _valet?: ProviderSolanaInjection

	private _useValet?: boolean

	constructor(private config: OtaConfig & { disableWindowWallet?: boolean }) {
		super()
		this._ota = new OtaProvider({ ...config })
	}

	get icon() {
		return this._ota.icon || icon
	}

	get readyState() {
		return this._readyState
	}

	get connecting() {
		return this._connecting
	}

	get connected() {
		return this._valet?.isConnected || this._ota.connected
	}

	get publicKey() {
		return this._valet?.publicKey || this._ota.publicKey || null
	}

	async connect(): Promise<void> {
		try {
			if (this.connected || this.connecting) return
			if (this._readyState !== WalletReadyState.Loadable)
				throw new WalletNotReadyError()

			this._valet = window.valet

			this._connecting = true

			try {
				if (!this.config.disableWindowWallet && this._valet) {
					await this._valet.connect()
					this._useValet = true
				}
			} catch {
				console.error(
					"user did not connect with extension. using ota provider..."
				)
			}

			try {
				if (!this.publicKey) await this._ota.connect()
				this._useValet = false
			} catch (error: any) {
				throw new WalletLoadError(error?.message, error)
			}

			const publicKey = this.publicKey!

			this.emit("connect", publicKey)
		} catch (error: any) {
			this.emit("error", error)
			throw error
		} finally {
			this._connecting = false
		}
	}

	async disconnect(): Promise<void> {
		try {
			if (this._useValet) await this._valet?.disconnect()
			else await this._ota.disconnect()
			this._useValet = undefined
		} catch (error: any) {
			this.emit("error", new WalletDisconnectionError(error?.message, error))
			throw error
		}
	}

	sendTransaction(
		transaction: TransactionOrVersionedTransaction<
			this["supportedTransactionVersions"]
		>,
		connection: Connection,
		options?: SendTransactionOptions | undefined
	): Promise<string> {
		try {
			const wallet = this._ota
			if (!wallet) throw new WalletNotConnectedError()

			try {
				if (this._useValet) {
					return this._valet?.sendAndConfirm(
						transaction,
						[],
						options,
						connection
					)!
				}
				return this._ota.signAndSendTransaction(
					transaction,
					connection,
					options
				)
			} catch (error: any) {
				throw new WalletSignTransactionError(error?.message, error)
			}
		} catch (error: any) {
			this.emit("error", error)
			throw error
		}
	}

	async signTransaction<
		T extends TransactionOrVersionedTransaction<
			this["supportedTransactionVersions"]
		>,
	>(transaction: T): Promise<T> {
		try {
			if (this._useValet && !this._valet) throw new WalletNotConnectedError()

			try {
				if (this._useValet) {
					const wallet = this._valet
					if (!wallet) throw new WalletNotConnectedError()
					const tx = await wallet.signTransaction(transaction)
					return tx
				}
				return await this._ota.signTransaction(transaction)
			} catch (error: any) {
				throw new WalletSignTransactionError(error?.message, error)
			}
		} catch (error: any) {
			this.emit("error", error)
			throw error
		}
	}

	signAllTransactions<
		T extends TransactionOrVersionedTransaction<
			this["supportedTransactionVersions"]
		>,
	>(transactions: T[]): Promise<T[]> {
		try {
			if (this._useValet && !this._valet) throw new WalletNotConnectedError()

			try {
				if (this._useValet) {
					const wallet = this._valet
					if (!wallet) throw new WalletNotConnectedError()
					return wallet.signAllTransactions(transactions)
				}
				return this._ota.signAllTransactions(transactions)
			} catch (error: any) {
				throw new WalletSignTransactionError(error?.message, error)
			}
		} catch (error: any) {
			this.emit("error", error)
			throw error
		}
	}
}
