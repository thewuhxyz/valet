import base58, { encode } from "bs58"
import {
	Commitment,
	Connection,
	Keypair,
	PublicKey,
	TransactionMessage,
	VersionedTransaction,
} from "@solana/web3.js"
import {
	BACKEND_EVENT,
	NOTIFICATION_CONNECTION_URL_UPDATED,
	NOTIFICATION_DELEGATE_WALLET_UPDATED,
	NOTIFICATION_KEYRING_STORE_CREATED,
	NOTIFICATION_KEYRING_STORE_LOCKED,
	NOTIFICATION_KEYRING_STORE_UNLOCKED,
	NOTIFICATION_SIGNOUT_SUCCESSFUL,
	RPC_DEVNET_ENDPOINT,
	getLogger,
	deserializeOriginalTransaction,
} from "@valet/lib"
import { AnchorProvider } from "@coral-xyz/anchor"
import { ProtocolClient, ValetUser } from "@valet/ota-client"
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet"
import EventEmitter from "eventemitter3"
import { Notification } from "../types"

const logger = getLogger("ota-client")

export class OtaClient {
	private provider?: AnchorProvider
	private connection?: Connection
	private connectionUrl?: string
	private commitment?: Commitment
	private delegateWallet?: string

	constructor(public events: EventEmitter) {
		this.init()
	}

	init() {
		this.setDefault()
		this.setupEventListeners()
	}

	private setupEventListeners() {
		this.events.addListener(BACKEND_EVENT, (notif: Notification) => {
			logger.debug(`received notification: ${notif.name}`, notif)

			switch (notif.name) {
				case NOTIFICATION_KEYRING_STORE_CREATED:
					handleKeyringStoreCreated(notif)
					break
				case NOTIFICATION_KEYRING_STORE_UNLOCKED:
					handleKeyringStoreUnlocked(notif)
					break
				case NOTIFICATION_KEYRING_STORE_LOCKED:
					handleKeyringStoreLocked(notif)
				case NOTIFICATION_SIGNOUT_SUCCESSFUL:
					handleSignoutSuccessful(notif)
					break
				case NOTIFICATION_DELEGATE_WALLET_UPDATED:
					handleDelegateWalletUpdated(notif)
					break
				case NOTIFICATION_CONNECTION_URL_UPDATED:
					handleConnectionUrlUpdated(notif)
					break
				default:
					break
			}
		})

		const handleKeyringStoreCreated = (notif: Notification) => {
			handleKeyringStoreUnlocked(notif)
		}

		const handleKeyringStoreUnlocked = async (notif: Notification) => {
			const { url, delegateWallet, commitment } = notif.data
			this.delegateWallet = delegateWallet
			this.connectionUrl = url
			this.commitment = commitment
			this.connection = new Connection(url, commitment)
			this.provider = this.setProvider(this.connection)
		}
		const handleKeyringStoreLocked = (notif: Notification) => {
			this.reset()
		}
		const handleSignoutSuccessful = (notif: Notification) => {
			this.reset()
		}
		const handleDelegateWalletUpdated = (notif: Notification) => {
			const { delegateWallet } = notif.data
			this.delegateWallet = delegateWallet
		}
		const handleConnectionUrlUpdated = async (notif: Notification) => {
			const { url } = notif.data
			this.connectionUrl = url
			this.connection = new Connection(url, { commitment: this.commitment })
			this.provider = this.setProvider(this.connection)
		}
	}

	reset() {
		this.provider = undefined
		this.connection = undefined
		this.connectionUrl = undefined
		this.commitment = undefined
		this.delegateWallet = undefined
	}

	setProvider(connection: Connection) {
		return new AnchorProvider(
			connection,
			new NodeWallet(Keypair.generate()),
			{}
		)
	}

	setDefault() {
		this.commitment = "processed"
		this.connectionUrl = this.defaultConnectionUrl
		this.connection = new Connection(this.connectionUrl)
		this.provider = this.setProvider(this.connection)

		return {
			provider: this.provider,
			connectionUrl: this.connectionUrl,
			connection: this.connection,
		}
	}

	get default() {
		return { ...this.setDefault() }
	}

	get otaClient() {
		if (!this.provider)
			throw new Error("Error loading otaClient. Provider not defined")
		return new ProtocolClient(this.provider, "devnet")
	}

	private get defaultConnectionUrl() {
		return RPC_DEVNET_ENDPOINT
	}

	publicKey(valetUser: ValetUser) {
		return this.otaClient.userKeys(valetUser).publicKey
	}

	async transferDelegate(
		valetUser: ValetUser,
		currentDelegate: string,
		newDelegate: string
	) {
		if (this.delegateWallet !== currentDelegate || !this.delegateWallet)
			throw new Error("Current delegate does not match")

		const ix = await this.otaClient.transferDelegateInstruction(
			this.otaClient.toValetContext(valetUser, new PublicKey(currentDelegate)),
			new PublicKey(newDelegate)
		)

		const latestBlockhash = await this.connection!.getLatestBlockhash()

		const messageV0 = new TransactionMessage({
			payerKey: new PublicKey(currentDelegate),
			recentBlockhash: latestBlockhash.blockhash,
			instructions: [ix],
		}).compileToV0Message()

		return encode(new VersionedTransaction(messageV0).serialize())
	}

	async prepareOtaTransaction(
		txStr: string,
		isVersioned: boolean
	): Promise<[string, string]> {
		const tx = deserializeOriginalTransaction(txStr, isVersioned)

		if (!this.delegateWallet) throw new Error("delegate is not defined")
		if (!this.connection) throw new Error("connection is not defined")


		const transaction = await this.otaClient.prepareTransaction(tx)

		return [
			this.delegateWallet,
			base58.encode(transaction.serialize({ requireAllSignatures: false })),
		]
	}
}
