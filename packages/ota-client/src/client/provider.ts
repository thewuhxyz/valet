import {
	PublicKey,
	type ConfirmOptions,
	Transaction,
	VersionedTransaction,
	Connection,
} from "@solana/web3.js"
import axios from "axios"
import {
	connectResponseSchema,
	signAllTransactionsResponseSchema,
	signTransactionResponseSchema,
	userJwtSchema,
} from "../zod"
import {
	DappServerRequest,
	OtaAction,
	OtaServerRequest,
	OtaServerResponse,
	VALET_USER_AVATAR,
	VALET_USER_TOKEN,
} from "../types"
import {
	approveAllTransactions,
	approveTransaction,
	getPassword,
	renderError,
} from "./ui"
import Cookies from "js-cookie"
import { decode, encode } from "bs58"
import { DappServerResponse } from "../dapp-server"
import { SendTransactionOptions } from "@solana/wallet-adapter-base"
import {
	isVersionedTransaction,
	decodeJWT,
	OTA_SERVER_DOMAIN,
} from "@valet/lib"

export const OTA_SERVER_ENDPOINT = `${OTA_SERVER_DOMAIN}/ota`

export class OtaProvider {
	private _publicKey: string | undefined
	private _accountKey: string | undefined
	private _icon: string | undefined
	private _dappUrlEndpoint: string
	private _dappDomain: string | undefined
	private _connectionUrl: string
	private _commitmentOptions: ConfirmOptions | undefined

	constructor(otaConfig: OtaConfig) {
		this._connectionUrl = otaConfig.connectionUrl
		this._dappUrlEndpoint = otaConfig.dappUrlEndpoint || "/ota"
		this._dappDomain = otaConfig.dappdomain
		this._commitmentOptions = otaConfig.commitmentOptions
	}

	get connection() {
		return new Connection(this.connectionUrl, this.commitmentOptions)
	}

	get commitmentOptions() {
		return this._commitmentOptions
	}

	get connectionUrl() {
		return this._connectionUrl
	}

	get dappDomain() {
		return this._dappDomain
	}

	get dappEndpoint(): string {
		return this._dappUrlEndpoint
	}

	get dappOtaEndpoint() {
		return this.dappDomain
			? `${this.dappDomain}${this.dappEndpoint}`
			: `${this.dappEndpoint}`
	}

	get publicKey() {
		const publicKey = this.getWalletData().publicKey
		return publicKey ? new PublicKey(publicKey) : undefined
	}

	get accountKey() {
		const accountKey = this.getWalletData().accountKey
		return accountKey ? new PublicKey(accountKey) : undefined
	}

	get icon() {
		return this.getWalletData().icon
	}

	get connected() {
		return !!(this.publicKey && this.accountKey)
	}

	async connect() {
		try {
			if (this.connected) return

			const { data: dappConnectResponse, error: dappConnectError } =
				await this.sendRequestToDappServer({
					action: OtaAction.Connect,
					payload: {},
				})

			if (!dappConnectResponse) {
				dappConnectError && renderError(dappConnectError.message)
				return
			}

			const password = await getPassword()

			if (!password) return

			const connectParams = { ...dappConnectResponse, password }

			const responseData = await this.sendRequestToServer({
				action: OtaAction.Connect,
				payload: connectParams,
			})

			if (!responseData) return

			const { success } = connectResponseSchema.safeParse(responseData)
			if (!success) return

			const { data, error } = connectResponseSchema.parse(responseData)

			if (!data) {
				console.error(error?.message)
				if (error) renderError(error?.message)
				return
			}

			const { image } = data

			this.setUserData(image)
		} catch (e: any) {
			console.error("error connecting to dapp:", e)
			renderError(e.message || e)
		}
	}

	async disconnect() {
		try {
			const { error: otaServerError } = await this.sendRequestToServer({
				action: OtaAction.Disconnect,
				payload: {},
			})

			if (otaServerError) return

			const { error: dappServerError } = await this.sendRequestToDappServer({
				action: OtaAction.Disconnect,
				payload: {},
			})

			if (dappServerError) return

			this.clearUserData()
		} catch (e: any) {
			console.error(e.message || e)
		}
	}

	async signTransaction<T extends Transaction | VersionedTransaction>(
		tx: T
	): Promise<T> {
		try {
			const txString = encode(tx.serialize({ requireAllSignatures: false }))

			const isVersioned = isVersionedTransaction(tx)

			const { data: dappData, error: dappError } =
				await this.sendRequestToDappServer({
					action: OtaAction.SignTransaction,
					payload: { transaction: { txString, isVersioned } },
				})

			if (!dappData)
				throw new Error(`Could getting data from dapp. ${dappError?.message}`)

			const userData = this.getUserData()

			if (!userData) throw new Error("unable to get user data from wallet")

			const { nonce, name } = userData

			const approve = await approveTransaction(name || undefined, this.icon)

			if (!approve) throw new Error("User reject transaction")

			const signTransactionParams = { ...dappData, nonce }

			const responseData = await this.sendRequestToServer({
				action: OtaAction.SignTransaction,
				payload: signTransactionParams,
			})

			const { success } = signTransactionResponseSchema.safeParse(responseData)
			if (!success) {
				throw new Error("parsing connect response unsuccessful")
			}
			const { data: otaServerData, error: otaServerError } =
				signTransactionResponseSchema.parse(responseData)

			if (!otaServerData) {
				console.error(
					"failed to get transaction from server:",
					otaServerError?.message
				)
				throw new Error("Failed to get Transaction from Ota Server")
			}

			const { signature } = otaServerData

			if (!isVersioned) {
				return Transaction.from(decode(signature)) as T
			}
			return VersionedTransaction.deserialize(decode(signature)) as T
		} catch (e: any) {
			console.error("Failed to sign transaction. error:", e)
			throw new Error(`Failed to sign transaction ${e.message ?? e}`)
		}
	}

	async signAllTransactions<T extends Transaction | VersionedTransaction>(
		txs: T[]
	): Promise<T[]> {
		try {
			const transactions = txs.map((tx) => {
				return {
					txString: encode(tx.serialize({ requireAllSignatures: false })),
					isVersioned: isVersionedTransaction(tx),
				}
			})

			const { data: dappData, error: dappError } =
				await this.sendRequestToDappServer({
					action: OtaAction.SignAllTransactions,
					payload: { transactions },
				})

			if (!dappData) {
				console.error("dapp server error", dappError?.message)
				throw new Error("Could getting data from dapp")
			}

			const userData = this.getUserData()

			if (!userData) throw new Error("unable to get user data from wallet")

			const { nonce, name } = userData

			const approve = await approveAllTransactions(name || undefined, this.icon)

			if (!approve) throw new Error("User reject the transactions")

			const signAllTransactionsParams = { ...dappData, nonce }

			const responseData = await this.sendRequestToServer({
				action: OtaAction.SignAllTransactions,
				payload: signAllTransactionsParams,
			})

			const { success } =
				signAllTransactionsResponseSchema.safeParse(responseData)
			if (!success) {
				throw new Error("parsing connect response unsuccessful")
			}
			const { data: otaServerData, error: otaServerError } =
				signAllTransactionsResponseSchema.parse(responseData)

			if (!otaServerData) {
				console.error(
					"failed to get transaction from server:",
					otaServerError?.message
				)
				throw new Error("Failed to get all Transactions from Ota Server")
			}

			const { signatures } = otaServerData

			return signatures.map(
				(signature) => VersionedTransaction.deserialize(decode(signature)) as T
			)
		} catch (e) {
			console.error("Failed to sign transactions. error:", e)
			throw new Error("Failed to sign transactions")
		}
	}

	async signAndSendTransaction<T extends Transaction | VersionedTransaction>(
		transaction: T,
		connection: Connection = this.connection,
		options: SendTransactionOptions = {}
	): Promise<string> {
		try {
			const tx = await this.signTransaction(transaction)
			return await connection.sendRawTransaction(tx.serialize(), options)
		} catch (e) {
			throw new Error("Failed to sign and send transaction")
		}
	}

	decodeUserToken(token: string) {
		try {
			const payload = decodeJWT(token)
			const { success } = userJwtSchema.safeParse(payload)
			if (!success) return

			return userJwtSchema.parse(payload)
		} catch {
			return
		}
	}

	setWalletData({
		publicKey,
		accountKey,
		icon,
	}: {
		publicKey: string
		accountKey: string
		icon?: string
	}) {
		this._accountKey = accountKey
		;(this._publicKey = publicKey), (this._icon = icon)
	}

	getWalletData() {
		if (!this._publicKey || !this._accountKey) {
			this._publicKey = this.getUserData()?.publicKey
			this._accountKey = this.getUserData()?.accountKey
			this._icon = this.getUserData()?.image || undefined
		}
		return {
			publicKey: this._publicKey,
			accountKey: this._accountKey,
			icon: this._icon,
		}
	}

	clearWalletData() {
		this._accountKey = undefined
		this._publicKey = undefined
		this._icon = undefined
	}

	setUserData(img?: string | null) {
		const userData = this.getUserData()

		if (!userData) return

		if (img) localStorage.setItem(VALET_USER_AVATAR, img)

		this.setWalletData({ ...userData, icon: img || undefined })
	}

	getUserData() {
		const token = Cookies.get(VALET_USER_TOKEN)
		if (!token) return

		const userData = this.decodeUserToken(token)

		if (!userData) return userData

		const img = localStorage.getItem(VALET_USER_AVATAR)

		return { ...userData, image: img || userData.image }
	}

	clearUserData() {
		Cookies.remove(VALET_USER_TOKEN)
		localStorage.removeItem(VALET_USER_AVATAR)
		this.clearWalletData()
	}

	async sendRequestToServer(
		request: OtaServerRequest
	): Promise<OtaServerResponse> {
		const { data } = await axios.post(
			`${OTA_SERVER_ENDPOINT}/${request.action}`,
			request.payload,
			{
				withCredentials: true,
			}
		)
		return data
	}

	async sendRequestToDappServer(
		params: DappServerRequest
	): Promise<DappServerResponse> {
		const res = await axios.post(this.dappOtaEndpoint, params)
		return res.data
	}
}

export type OtaConfig = {
	connectionUrl: string
	/**
	 * should begin with a "/"
	 * @default "/ota"
	 */
	dappUrlEndpoint?: string
	commitmentOptions?: ConfirmOptions
	dappdomain?: string // ? include if not main website
}
