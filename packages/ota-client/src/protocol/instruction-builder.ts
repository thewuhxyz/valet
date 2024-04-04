import { Program } from "@coral-xyz/anchor"
import {
	AccountMeta,
	PublicKey,
	SystemProgram,
	TransactionInstruction,
} from "@solana/web3.js"
import { ValetProtocol } from "@valet/protocol"

export class ProtocolInstructionBuilder {
	constructor(private valetProgram: Program<ValetProtocol>) {}

	async createWalletAccountIx({
		accountSeeds,
		walletAccount,
		walletSigner,
		walletDelegate,
	}: CreateAccountIxArgs) {
		return await this.valetProgram.methods
			.createWalletAccount(accountSeeds)
			.accountsStrict({
				walletAccount,
				walletSigner,
				walletDelegate,
				creator: new PublicKey("H1oFKfS8UZXawmD3GFnGgPziJcdHKswmtC9VYSoaKnWZ"),
				systemProgram: SystemProgram.programId,
			})
			.instruction()
	}

	async signInstructionIx({
		instruction,
		walletAccounts,
		uniqueSigners,
	}: SignInstructionIxArg) {
		return await this.valetProgram.methods
			.signInstructionMultipleSigners(instruction.data, uniqueSigners)
			.accountsStrict({
				instructionProgramId: instruction.programId,
				systemProgram: SystemProgram.programId,
			})
			.remainingAccounts([...walletAccounts, ...instruction.keys])
			.instruction()
	}

	// ! rectify this ! ! ! ! !
	async transferDelegateIx({
		walletAccount,
		walletSigner,
		walletDelegate,
		newWalletDelegate,
	}: TransferDelegateIxArgs) {
		return await this.valetProgram.methods
			.transferDelegate()
			.accountsStrict({
				walletDelegate,
				walletAccount,
				newWalletDelegate,
				walletSigner,
				systemProgram: SystemProgram.programId,
			})
			.instruction()
	}
}

type CreateAccountIxArgs = {
	accountSeeds: string
	walletDelegate: PublicKey
	walletAccount: PublicKey
	walletSigner: PublicKey
}

type TransferDelegateIxArgs = {
	walletAccount: PublicKey
	walletSigner: PublicKey
	walletDelegate: PublicKey
	newWalletDelegate: PublicKey
}

type SignInstructionIxArg = {
	instruction: TransactionInstruction
	walletAccounts: AccountMeta[]
	uniqueSigners: number
}
