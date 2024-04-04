import { AnchorProvider, Wallet } from "@coral-xyz/anchor"
import {
	Keypair,
	PublicKey,
	Transaction,
	TransactionInstruction,
	TransactionMessage,
	VersionedTransaction,
} from "@solana/web3.js"
import {
	ProtocolClient,
	ValetUser,
	ClusterWithLocalnet,
} from "@valet/ota-client"
import { deserializeOriginalTransaction } from "@valet/lib"
import { encode, decode } from "bs58"

export class OtaServerClient extends ProtocolClient {
	constructor(
		public provider: AnchorProvider,
		cluster: ClusterWithLocalnet
	) {
		super(provider, cluster)
	}

	static keypairFromString(secret: string) {
		return Keypair.fromSecretKey(decode(secret))
	}

	static keypairToString(keypair: Keypair) {
		return encode(keypair.secretKey)
	}

	static generateNewSecret() {
		const keypair = Keypair.generate()
		const secretKey = OtaServerClient.keypairToString(keypair)
		return { publicKey: keypair.publicKey.toBase58(), secretKey }
	}

	get connection() {
		return this.provider.connection
	}

	async signAllTransactions(
		delegate: string,
		transactions: { txString: string; isVersioned: boolean }[]
	): Promise<string[]> {
		return await Promise.all(
			transactions.map((transaction) => {
				return this.signTransaction(delegate, transaction)
			})
		)
	}

	async signTransaction(
		delegate: string,
		transaction: {
			txString: string
			isVersioned: boolean
		}
	): Promise<string> {
		const tx = deserializeOriginalTransaction(
			transaction.txString,
			transaction.isVersioned
		)

		const delegateWallet = new Wallet(
			OtaServerClient.keypairFromString(delegate)
		)

		const signedTransaction = await delegateWallet.signTransaction(tx)

		return encode(signedTransaction.serialize({ requireAllSignatures: false }))
	}

	async createAccount(user: ValetUser, delegate: Keypair) {
		const createUserAccountIx = await this.createWalletAccountInstruction(
			this.toValetContext(user, delegate.publicKey),
			this.signerSeeds(user)
		)

		const tx = new Transaction()
		tx.feePayer = this.provider.publicKey
		tx.recentBlockhash = (await this.connection.getLatestBlockhash()).blockhash
		tx.add(createUserAccountIx)

		const txSig = await this.provider.sendAndConfirm(tx, [delegate])
		console.log("create user account tx successful... tx:", txSig)
	}

	async createAccountIfNotCreated(user: ValetUser, userSecretKey: string) {
		const valetPubkeys = this.valetPubkeys(user)

		const accountInfo = await this.connection.getAccountInfo(
			valetPubkeys.walletAccount
		)

		if (
			accountInfo &&
			accountInfo.owner.toBase58() === this.programId.toBase58()
		)
			return

		console.log("account not created yet. creating account...")
		const delegate = OtaServerClient.keypairFromString(userSecretKey)
		await this.createAccount(user, delegate)
	}

	async transferDelegate(
		user: ValetUser,
		userDelegate: string,
		serverDelegate: string,
		direction: string
	): Promise<string> {

		const delegateWallet = new Wallet(
			OtaServerClient.keypairFromString(serverDelegate)
		)

		let transferDelegateIx: TransactionInstruction
		if (direction === "from-server")
			transferDelegateIx = await this.transferDelegateInstruction(
				this.toValetContext(user, new PublicKey(delegateWallet.publicKey)),
				new PublicKey(userDelegate)
			)
		else if (direction === "to-server")
			transferDelegateIx = await this.transferDelegateInstruction(
				this.toValetContext(user, new PublicKey(userDelegate)),
				new PublicKey(delegateWallet.publicKey)
			)
		else throw new Error("Invalid transfer-delegate direction")

		const latestBlockhash = await this.connection.getLatestBlockhash()

		const messageV0 = new TransactionMessage({
			payerKey: new PublicKey(userDelegate),
			recentBlockhash: latestBlockhash.blockhash,
			instructions: [transferDelegateIx],
		}).compileToV0Message()

		const transaction = new VersionedTransaction(messageV0)

		const signedTransaction = await delegateWallet.signTransaction(transaction)
		return encode(signedTransaction.serialize())
	}
}
