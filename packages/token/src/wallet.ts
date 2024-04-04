import { createAssociatedTokenAccountInstruction } from "@solana/spl-token"
import {
	Commitment,
	Connection,
	LAMPORTS_PER_SOL,
	PublicKey,
	SystemProgram,
	Transaction,
	TransactionInstruction,
	VersionedTransaction,
} from "@solana/web3.js"
import * as assertOwner from "./assert-owner"
import * as anchor from "@coral-xyz/anchor"
import { TokenInterface, associatedTokenAddress } from "./tokens"
import { TokenInfo } from "@solana/spl-token-registry"
import { BN } from "bn.js"

export class Solana {
	public static async transferSol(
		ctx: WalletContext,
		req: TransferSolRequest,
		wallet: SolanaWallet
	): Promise<string> {
		const { tokenInterface } = ctx

		const tx = new Transaction()
		tx.add(
			SystemProgram.transfer({
				fromPubkey: new PublicKey(req.source),
				toPubkey: new PublicKey(req.destination),
				lamports: req.amount * LAMPORTS_PER_SOL,
			})
		)
		const latestBlockhash =
			await tokenInterface.provider.connection.getLatestBlockhash("processed")
		tx.feePayer = wallet.publicKey
		tx.recentBlockhash = latestBlockhash.blockhash

		let transaction = tx

		if (ctx.otaPrepareTransaction)
			transaction = await ctx.otaPrepareTransaction(tokenInterface.provider, tx)

		const signedTx = await wallet.signTransaction(transaction)

		const rawTx = signedTx.serialize()

		return await ctx.tokenInterface.provider.connection.sendRawTransaction(
			rawTx,
			{
				preflightCommitment: "processed",
				maxRetries: 10,
			}
		)
	}

	public static async transferToken(
		ctx: WalletContext,
		req: TransferTokenRequest,
		wallet: SolanaWallet
	): Promise<string> {
		const { registry, tokenInterface, commitment } = ctx
		const { mint, programId, destination, amount } = req

		const decimals = (() => {
			if (req.decimals !== undefined) {
				return req.decimals
			}
			const tokenInfo = registry.get(mint.toString())
			if (!tokenInfo) {
				throw new Error("no token info found")
			}
			const decimals = tokenInfo.decimals
			return decimals
		})()

		const nativeAmount = new BN(amount)

		const destinationAta = associatedTokenAddress(mint, destination, programId)
		const sourceAta = associatedTokenAddress(mint, wallet.publicKey, programId)

		const [destinationAccount, destinationAtaAccount] =
			await anchor.utils.rpc.getMultipleAccounts(
				tokenInterface.provider.connection,
				[destination, destinationAta],
				commitment
			)

		//
		// Require the account to either be a system program account or a brand new
		// account.
		//
		if (
			destinationAccount &&
			!destinationAccount.account.owner.equals(SystemProgram.programId)
		) {
			throw new Error("invalid account")
		}

		// Instructions to execute prior to the transfer.
		const preInstructions: Array<TransactionInstruction> = []
		if (!destinationAtaAccount) {
			preInstructions.push(
				assertOwner.assertOwnerInstruction({
					account: destination,
					owner: SystemProgram.programId,
				})
			)
			preInstructions.push(
				createAssociatedTokenAccountInstruction(
					wallet.publicKey,
					destinationAta,
					destination,
					mint,
					programId
				)
			)
		}

		let tx = await tokenInterface
			.withProgramId(programId)
			.methods.transferChecked(nativeAmount, decimals)
			.accounts({
				source: sourceAta,
				mint,
				destination: destinationAta,
				authority: wallet.publicKey,
			})
			.preInstructions(preInstructions)
			.transaction()
		tx.feePayer = wallet.publicKey
		tx.recentBlockhash = (
			await tokenInterface.provider.connection.getLatestBlockhash(commitment)
		).blockhash

		let transaction = tx

		if (ctx.otaPrepareTransaction)
			transaction = await ctx.otaPrepareTransaction(tokenInterface.provider, tx)

		const signedTx = await wallet.signTransaction(transaction)
		const rawTx = signedTx.serialize()

		return await tokenInterface.provider.connection.sendRawTransaction(rawTx, {
			skipPreflight: false,
			preflightCommitment: commitment,
		})
	}
}

export type TransferSolRequest = {
	// SOL address.
	source: PublicKey
	// SOL address.
	destination: PublicKey
	amount: number
}

export type TransferTokenRequest = {
	// SOL address.
	destination: PublicKey
	mint: PublicKey
	programId: PublicKey
	amount: number
	decimals?: number
	// Source token addess. If not provided, an ATA will
	// be derived from the wallet.
	source?: PublicKey
}

export interface SolanaWallet {
	signTransaction<T extends Transaction | VersionedTransaction>(
		tx: T
	): Promise<T>
	signAllTransactions<T extends Transaction | VersionedTransaction>(
		txs: T[]
	): Promise<T[]>
	publicKey: PublicKey
}

export type WalletContext = {
	connection: Connection
	tokenInterface: TokenInterface
	registry: Map<string, TokenInfo>
	commitment: Commitment
	otaPrepareTransaction?: OtaPrepareTransaction
}

export type OtaPrepareTransaction = <
	T extends Transaction | VersionedTransaction,
>(
	provider: anchor.AnchorProvider,
	transaction: T
) => Promise<T>
