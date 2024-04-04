import {
	AnchorProvider,
	Program,
	setProvider,
	workspace,
} from "@coral-xyz/anchor"
import {
	AccountMeta,
	LAMPORTS_PER_SOL,
	PublicKey,
	SystemProgram,
	Transaction,
	TransactionInstruction,
} from "@solana/web3.js"
import { ValetProtocol } from "../src/idl"
import crypto from "crypto"

setProvider(AnchorProvider.env())

const program = workspace.ValetProtocol as Program<ValetProtocol>

export class User {
	constructor(public id: string) {}

	get accountSeeds() {
		const hash = this.solanaHash(this.id)
		return Uint8Array.from(Buffer.from(hash, "hex"))
	}

	private solanaHash = (payload: string) => {
		return crypto.createHash("sha256").update(payload, "utf-8").digest("hex")
	}
}

export class Protocol {
	readonly program: Program<ValetProtocol> = program

	constructor(public provider: AnchorProvider) {}

	get programId() {
		return this.program.programId
	}

	get connection() {
		return this.provider.connection
	}

	async transferSol(user: User, sol: number) {
		const { walletDelegate, walletSigner } = this.getUserAddresses(user)
		const transfer = SystemProgram.transfer({
			fromPubkey: walletDelegate,
			toPubkey: walletSigner,
			lamports: sol * LAMPORTS_PER_SOL,
		})

		const newTransaction = new Transaction()
		newTransaction.instructions = [transfer]
		newTransaction.feePayer = walletDelegate
		newTransaction.recentBlockhash = (
			await this.connection.getLatestBlockhash()
		).blockhash

		const signedTx = await this.provider.wallet.signTransaction(newTransaction)
		const confirmTx = await this.provider.connection.sendRawTransaction(
			signedTx.serialize()
		)
		return confirmTx
	}

	async createWalletAccount(user: User) {
		const userAddresses = this.getUserAddresses(user)
		const instruction = await this.program.methods
			.createWalletAccount(user.id)
			.accountsStrict({
				...userAddresses,
				creator: userAddresses.walletDelegate,
				systemProgram: SystemProgram.programId,
			})
			.instruction()

		const newTransaction = new Transaction()
		newTransaction.instructions = [instruction]
		newTransaction.feePayer = userAddresses.walletDelegate
		newTransaction.recentBlockhash = (
			await this.connection.getLatestBlockhash()
		).blockhash

		const signedTx = await this.provider.wallet.signTransaction(newTransaction)
		const confirmTx = await this.provider.connection.sendRawTransaction(
			signedTx.serialize()
		)
		return confirmTx
	}

	async signInstruction(
		instruction: TransactionInstruction,
		additionalKeys: AccountMeta[],
		uniqueSigners: number
	) {
		return await this.program.methods
			.signInstructionMultipleSigners(instruction.data, uniqueSigners)
			.accountsStrict({
				instructionProgramId: instruction.programId,
				systemProgram: SystemProgram.programId,
			})
			.remainingAccounts([...additionalKeys, ...instruction.keys])
			.instruction()
	}

	async signTransaction(user: User, transaction: Transaction) {
		const { walletDelegate } = this.getUserAddresses(user)
		const instructions = await Promise.all(
			transaction.instructions.map((ix) => this.convertInstruction(user, ix))
		)

		const newTransaction = new Transaction()
		newTransaction.instructions = instructions
		newTransaction.feePayer = walletDelegate
		newTransaction.recentBlockhash = (
			await this.connection.getLatestBlockhash()
		).blockhash

		const signedTx = await this.provider.wallet.signTransaction(newTransaction)
		const confirmTx = await this.provider.connection.sendRawTransaction(
			signedTx.serialize(),
			{ skipPreflight: false }
		)
		return confirmTx
	}

	convertInstruction(user: User, ix: TransactionInstruction) {
		const { walletSigner, walletAccount, walletDelegate } =
			this.getUserAddresses(user)
		const instruction = convertInstruction(ix, walletSigner)
		const additionalKeys = [
			{
				pubkey: walletAccount,
				isSigner: false,
				isWritable: false,
			},
			{
				pubkey: walletSigner,
				isSigner: false,
				isWritable: true,
			},
			{
				pubkey: walletDelegate,
				isSigner: true,
				isWritable: true,
			},
		]

		return this.signInstruction(instruction, additionalKeys, 1)
	}

	getUserAddresses(user: User) {
		const walletSigner = PublicKey.findProgramAddressSync(
			[user.accountSeeds],
			this.programId
		)[0]

		const walletAccount = PublicKey.findProgramAddressSync(
			[walletSigner.toBuffer()],
			this.programId
		)[0]

		return { walletSigner, walletAccount, walletDelegate: this.provider.publicKey }
	}

	async getWalletAccount(user: User) {
		const { walletAccount } = this.getUserAddresses(user)
		return await this.program.account.walletAccount.fetch(walletAccount)
	}

	async getBalance(publickey: PublicKey) {
		return await this.connection.getBalance(publickey)
	}

	async getUserBalances(user: User) {
		const { walletAccount, walletDelegate, walletSigner } =
			this.getUserAddresses(user)
		return {
			walletSignerBalance: await this.getBalance(walletSigner),
			delegateBalance: await this.getBalance(walletDelegate),
			walletAccountBalance: await this.getBalance(walletAccount),
		}
	}
}

export const convertInstruction = (
	ix: TransactionInstruction,
	walletSigner: PublicKey
): TransactionInstruction => {
	return {
		...ix,
		keys: ix.keys.map((i) => {
			if (i.pubkey.toBase58() === walletSigner.toBase58()) {
				return { ...i, isSigner: false }
			} else {
				return i
			}
		}),
	}
}

export const convertToOtaInstruction = (
	transaction: Transaction,
	signerPubkey: PublicKey,
	client: Protocol
): TransactionMeta[] => {
	const instructions = transaction.instructions
	return instructions.map((instruction) => {
		const {
			data: instructionData,
			keys,
			programId: instructionProgramId,
		} = instruction

		let accounts: AccountMeta[] = [
			{
				pubkey: instructionProgramId,
				isSigner: false,
				isWritable: false,
			},
		]

		// set account signer accountmeta to false
		keys.forEach((i) => {
			if (i.pubkey.toBase58() === signerPubkey.toBase58()) {
				accounts.push({ ...i, isSigner: false })
			} else {
				accounts.push(i)
			}
		})

		const instructionMeta: InstructionMeta = {
			data: instructionData,
			noOfAccounts: accounts.length,
		}

		return { accountMetas: accounts, instructionMeta }
	})
}

type TransactionMeta = {
	instructionMeta: InstructionMeta
	accountMetas: AccountMeta[]
}

type InstructionMeta = {
	noOfAccounts: number
	data: Buffer
}
