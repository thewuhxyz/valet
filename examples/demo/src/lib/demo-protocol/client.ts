import { DemoProgramIDL, type DemoProgram } from "@valet/protocol"
import { Program, AnchorProvider } from "@coral-xyz/anchor"
import {
	Connection,
	PublicKey,
	SystemProgram,
	Transaction,
	TransactionMessage,
	VersionedTransaction,
	clusterApiUrl,
} from "@solana/web3.js"
import type { WalletStore } from "@svelte-on-solana/wallet-adapter-core"
import { OtaTransaction } from "@valet/ota"
import { PUBLIC_DAPP_WALLET_PUBLICKEY } from "$env/static/public"

const DEMO_PROGRAM_ID = new PublicKey(
	"H9nFQRTmB6t1xNrRnMAnrCtdRuMYFFYxFPvNTGRgP6Am"
)

const DAPP_WALLET_PUBLICKEY = new PublicKey(PUBLIC_DAPP_WALLET_PUBLICKEY)

export const connection = new Connection(clusterApiUrl("devnet"), {
	commitment: "singleGossip",
})

class DemoProgramIxBuilder {
	constructor(public program: Program<DemoProgram>) {}

	createCounterIx = async ({
		counter,
		authority,
	}: {
		counter: PublicKey
		authority: PublicKey
	}) => {
		return await this.program.methods
			.createCounter()
			.accountsStrict({
				authority,
				counter,
				systemProgram: SystemProgram.programId,
			})
			.instruction()
	}

	incrementCountIx = async ({
		counter,
		authority,
	}: {
		counter: PublicKey
		authority: PublicKey
	}) => {
		return await this.program.methods
			.incrementCount()
			.accountsStrict({
				authority,
				counter,
			})
			.instruction()
	}
}

export class DemoProgramClient extends DemoProgramIxBuilder {
	constructor(public provider: AnchorProvider) {
		const program = new Program(DemoProgramIDL, DEMO_PROGRAM_ID, provider)
		super(program)
	}

	get programId() {
		return this.program.programId
	}

	get wallet() {
		return this.provider.wallet
	}

	async count(wallet: WalletStore) {
		if (!wallet.publicKey) throw new Error("wallet not connected")
		const { count } = await this.program.account.counter.fetch(
			this.getAddress(wallet.publicKey)
		)
		return count.toString(10)
	}

	async createCounter(wallet: WalletStore) {
		if (!wallet.publicKey || !wallet.signTransaction)
			throw new Error("wallet not connected")

		const createCounterIx = await this.createCounterIx({
			authority: wallet.publicKey,
			counter: this.getAddress(wallet.publicKey),
		})

		const latestBlockhash = await connection.getLatestBlockhash()

		const messageV0 = new TransactionMessage({
			payerKey: wallet.publicKey,
			recentBlockhash: latestBlockhash.blockhash,
			instructions: [createCounterIx],
		}).compileToV0Message()

		const transaction = new VersionedTransaction(messageV0)

		const preparedTransaction = await OtaTransaction.prepare(
			this.provider,
			transaction,
			{
				feePayerIfDelegateNotTransfered: DAPP_WALLET_PUBLICKEY,
			}
		)

		const tx = await wallet.signTransaction(preparedTransaction)

		const txSig = await connection.sendTransaction(tx)

		const confirmation = await connection.confirmTransaction({
			signature: txSig,
			blockhash: latestBlockhash.blockhash,
			lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
		})

		return txSig
	}

	async incrementCount(wallet: WalletStore) {
		// try {
		if (!wallet.publicKey || !wallet.signTransaction)
			throw new Error("wallet not connected")
		const incrementIx = await this.incrementCountIx({
			authority: wallet.publicKey,
			counter: this.getAddress(wallet.publicKey),
		})

		const transaction = new Transaction()
		transaction.feePayer = wallet.publicKey
		transaction.recentBlockhash = (
			await connection.getLatestBlockhash()
		).blockhash
		transaction.add(incrementIx)

		const preparedTransaction = await OtaTransaction.prepare(
			this.provider,
			transaction,
			{ feePayerIfDelegateNotTransfered: DAPP_WALLET_PUBLICKEY }
		)

		const tx = await wallet.signTransaction(preparedTransaction)

		const txSig = await connection.sendRawTransaction(tx.serialize())
		return txSig
	}

	async incrementCount3x(wallet: WalletStore) {
		if (!wallet.publicKey || !wallet.signTransaction)
			throw new Error("wallet not connected")
		const incrementIx = await this.incrementCountIx({
			authority: this.wallet.publicKey,
			counter: this.getAddress(wallet.publicKey),
		})

		const transaction = new Transaction()
		transaction.feePayer = wallet.publicKey
		transaction.recentBlockhash = (
			await connection.getLatestBlockhash()
		).blockhash
		transaction.add(...[incrementIx, incrementIx, incrementIx])

		const preparedTransaction = await OtaTransaction.prepare(
			this.provider,
			transaction,
			{ feePayerIfDelegateNotTransfered: DAPP_WALLET_PUBLICKEY }
		)

		const tx = await wallet.signTransaction(preparedTransaction)

		const txSig = await connection.sendRawTransaction(tx.serialize())

		return txSig
	}

	async incrementCount5x(wallet: WalletStore) {
		if (!wallet.publicKey || !wallet.signAllTransactions)
			throw new Error("wallet not connected")
		const incrementIx = await this.incrementCountIx({
			authority: this.wallet.publicKey,
			counter: this.getAddress(wallet.publicKey),
		})

		const transaction = new Transaction()
		transaction.feePayer = wallet.publicKey
		transaction.recentBlockhash = (
			await connection.getLatestBlockhash()
		).blockhash
		transaction.add(...[incrementIx, incrementIx, incrementIx])

		const transactionTwo = new Transaction()
		transactionTwo.feePayer = wallet.publicKey
		transactionTwo.recentBlockhash = (
			await connection.getLatestBlockhash()
		).blockhash
		transactionTwo.add(...[incrementIx, incrementIx])

		const preparedTransactions = await Promise.all(
			[transaction, transactionTwo].map(
				async (tx) =>
					await OtaTransaction.prepare(this.provider, tx, {
						feePayerIfDelegateNotTransfered: DAPP_WALLET_PUBLICKEY,
					})
			)
		)

		const [tx, tx2] = await wallet.signAllTransactions(preparedTransactions)

		const txSig = await connection.sendRawTransaction(tx.serialize())
		const tx2Sig = await connection.sendRawTransaction(tx2.serialize())

		return [txSig, tx2Sig]
	}

	getAddress(authority: PublicKey) {
		return PublicKey.findProgramAddressSync(
			[Buffer.from("counter"), authority.toBuffer()],
			this.programId
		)[0]
	}
}
