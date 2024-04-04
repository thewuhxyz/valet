import { AnchorProvider } from "@coral-xyz/anchor"
import { ClusterWithLocalnet, ProtocolClient } from "../protocol"
import {
	PublicKey,
	Transaction,
	TransactionInstruction,
	VersionedTransaction,
} from "@solana/web3.js"

export class OtaTransaction {
	static async prepare<T extends Transaction | VersionedTransaction>(
		provider: AnchorProvider,
		transaction: T,
		options?: OtaTransactionOptions
	): Promise<T> {
		const otaClient = new ProtocolClient(provider, options?.cluster ?? "devnet")
		return await otaClient.prepareTransaction(
			transaction,
			options?.feePayerIfDelegateNotTransfered
		)
	}

	static async prepareInstructions(
		provider: AnchorProvider,
		instructions: TransactionInstruction[],
		feePayer: PublicKey,
		options?: OtaTransactionOptions
	) {
		const otaClient = new ProtocolClient(provider, options?.cluster ?? "devnet")
		return await otaClient.prepareInstructions(
			instructions,
			feePayer,
			options?.feePayerIfDelegateNotTransfered
		)
	}
}

export type OtaTransactionOptions = {
	feePayerIfDelegateNotTransfered?: PublicKey
	cluster?: ClusterWithLocalnet
}
