import { Program, AnchorProvider } from "@coral-xyz/anchor"
import {
	PublicKey,
	Transaction,
	TransactionInstruction,
	VersionedTransaction,
} from "@solana/web3.js"
import { ValetProtocol, ValetProtocolIDL } from "@valet/protocol"
import { ProtocolInstructionBuilder } from "./instruction-builder"
import {
	ClusterWithLocalnet,
	ValetUser,
	ValetUserContext,
	ValetUserKeys,
} from "./types"
import { getProgramIdByCluster, solanaHash } from "./helpers"
import { ProtocolTransaction } from "./transaction"

export class ProtocolClient extends ProtocolInstructionBuilder {
	private program: Program<ValetProtocol>
	constructor(
		public provider: AnchorProvider,
		cluster: ClusterWithLocalnet
	) {
		const valetProgram = new Program(
			ValetProtocolIDL,
			getProgramIdByCluster(cluster),
			provider
		)
		super(valetProgram)
		this.program = valetProgram
	}

	get programId() {
		return this.program.programId
	}

	getAccountData(publicKey: string) {
		return this.program.account.walletAccount.fetch(publicKey)
	}

	async createWalletAccountInstruction(
		ctx: ValetUserContext,
		accountSeeds: string
	) {
		return super.createWalletAccountIx({ ...ctx, accountSeeds })
	}

	async transferDelegateInstruction(
		ctx: ValetUserContext,
		newWalletDelegate: PublicKey
	) {
		return super.transferDelegateIx({ ...ctx, newWalletDelegate })
	}

	async prepareTransaction<T extends Transaction | VersionedTransaction>(
		transaction: T,
		feePayerIfDelegateNotTransfered?: PublicKey
	) {
		return ProtocolTransaction.prepare(
			this,
			transaction,
			feePayerIfDelegateNotTransfered
		)
	}

	async prepareInstructions(
		instructions: TransactionInstruction[],
		feePayer: PublicKey,
		feePayerIfDelegateNotTransfered?: PublicKey
	) {
		return ProtocolTransaction.prepareInstructions(
			this,
			instructions,
			feePayer,
			feePayerIfDelegateNotTransfered
		)
	}

	signerSeeds(user: ValetUser) {
		return `${user.provider}-${user.providerId}`
	}

	toValetContext(user: ValetUser, delegate: PublicKey): ValetUserContext {
		return {
			...this.valetPubkeys(user),
			walletDelegate: delegate,
		}
	}


	valetPubkeys(user: ValetUser) {
		const idString = this.signerSeeds(user)

		const walletSigner = PublicKey.findProgramAddressSync(
			[this._signerHash(idString)],
			this.programId
		)[0]

		const walletAccount = PublicKey.findProgramAddressSync(
			[walletSigner.toBuffer()],
			this.programId
		)[0]

		return { walletAccount, walletSigner }
	}

	userKeys(user: ValetUser): ValetUserKeys {
		const ctx = this.valetPubkeys(user)
		return {
			accountKey: ctx.walletAccount.toBase58(),
			publicKey: ctx.walletSigner.toBase58(),
		}
	}

	private _signerHash(seeds: string) {
		const hash = solanaHash(seeds)
		return Uint8Array.from(Buffer.from(hash, "hex"))
	}
}
