import {
	PublicKey,
	Transaction,
	TransactionInstruction,
	VersionedTransaction,
	Connection,
	AddressLookupTableAccount,
	TransactionMessage,
	AccountMeta,
} from "@solana/web3.js"
import { isVersionedTransaction } from "@valet/lib"
import { PreparedInstructionData, ValetUserContext } from "./types"
import { ProtocolClient } from "./client"

export class ProtocolTransaction {
	static async prepare<T extends Transaction | VersionedTransaction>(
		client: ProtocolClient,
		transaction: T,
		feePayerIfDelegateNotTransfered?: PublicKey
	): Promise<T> {
		if (isVersionedTransaction(transaction))
			return (await this.prepareVersionedTransaction(
				client,
				transaction,
				feePayerIfDelegateNotTransfered
			)) as T
		return (await this.prepareLegacyTransaction(
			client,
			transaction,
			feePayerIfDelegateNotTransfered
		)) as T
	}

	private static async prepareLegacyTransaction(
		client: ProtocolClient,
		transaction: Transaction,
		feePayerIfDelegateNotTransfered?: PublicKey
	): Promise<Transaction> {
		const instructionsToPrepare = transaction.instructions
		const proposedFeePayer = transaction.feePayer

		if (!proposedFeePayer) throw new Error("Transaction Fee Payer not ser")

		const { instructions, modified, feePayer } = await this.prepareInstructions(
			client,
			instructionsToPrepare,
			proposedFeePayer,
			feePayerIfDelegateNotTransfered
		)

		if (!modified) {
			if (transaction.feePayer !== feePayer) {
				transaction.feePayer = feePayer
			}
			return transaction
		}

		const latestBlockhash =
			await client.provider.connection.getLatestBlockhash("processed")

		const newTx = new Transaction()

		newTx.add(...instructions)
		newTx.feePayer = feePayer
		newTx.recentBlockhash = latestBlockhash.blockhash

		return newTx
	}

	private static async prepareVersionedTransaction(
		client: ProtocolClient,
		transaction: VersionedTransaction,
		feepayerIfDelegateNotTransfered?: PublicKey
	): Promise<VersionedTransaction> {
		const { payerKey, instructions: instructionsToPrepare } =
			TransactionMessage.decompile(transaction.message)

		const { instructions, modified, feePayer } = await this.prepareInstructions(
			client,
			instructionsToPrepare,
			payerKey,
			feepayerIfDelegateNotTransfered
		)

		if (!modified) return transaction

		const [_, LUTs] = await this.instructionsFromVersionedTransaction(
			transaction,
			client.provider.connection
		)

		const latestBlockhash =
			await client.provider.connection.getLatestBlockhash()

		const messageV0 = new TransactionMessage({
			payerKey: feePayer,
			recentBlockhash: latestBlockhash.blockhash,
			instructions,
		}).compileToV0Message(LUTs)

		return new VersionedTransaction(messageV0)
	}

	private static async instructionsFromVersionedTransaction(
		versionedTx: VersionedTransaction,
		connection: Connection
	): Promise<[TransactionInstruction[], AddressLookupTableAccount[]]> {
		const LUTs = (
			await Promise.all(
				versionedTx.message.addressTableLookups.map((acc) =>
					connection.getAddressLookupTable(acc.accountKey)
				)
			)
		)
			.map((lut) => lut.value)
			.filter((val) => val !== null) as AddressLookupTableAccount[]

		const allAccs = versionedTx.message
			.getAccountKeys({ addressLookupTableAccounts: LUTs })
			.keySegments()
			.reduce((acc, cur) => acc.concat(cur), [])

		const instructions = versionedTx.message.compiledInstructions.map(
			(compiledInstruction) => {
				const { accountKeyIndexes, data, programIdIndex } = compiledInstruction
				return {
					data: Buffer.from(data),
					keys: accountKeyIndexes.map((i) => {
						return {
							pubkey: allAccs[i],
							isSigner: versionedTx.message.isAccountSigner(i),
							isWritable: versionedTx.message.isAccountWritable(i),
						}
					}),
					programId: allAccs[programIdIndex],
				}
			}
		)

		return [instructions, LUTs]
	}

	static async prepareInstructions(
		client: ProtocolClient,
		transactionInstructions: TransactionInstruction[],
		proposedFeePayer: PublicKey,
		feePayerIfDelegateNotTransfered?: PublicKey
	): Promise<PreparedInstructionData> {
		const valetContextMap = new Map<
			string,
			ValetUserContext & { delegateTransferred: boolean }
		>()
		const nonValetSigners = new Set<string>()

		const instructions = await Promise.all(
			transactionInstructions.map(async (instruction) => {
				const pubkeys = new Set<string>()
				const uniqueValetSigners = new Set<string>()

				const { keys, data, programId } = instruction

				await Promise.all(
					keys.map(async ({ pubkey, isSigner }) => {
						pubkeys.add(pubkey.toBase58())

						if (!isSigner) return

						if (
							nonValetSigners.has(pubkey.toBase58()) ||
							uniqueValetSigners.has(pubkey.toBase58())
						)
							return

						if (valetContextMap.has(pubkey.toBase58())) {
							uniqueValetSigners.add(pubkey.toBase58())
							return
						}

						const [walletAccountKey] = PublicKey.findProgramAddressSync(
							[pubkey.toBuffer()],
							client.programId
						)

						const accountInfo =
							await client.provider.connection.getAccountInfo(walletAccountKey)

						if (
							!accountInfo ||
							accountInfo.owner.toBase58() !== client.programId.toBase58()
						) {
							nonValetSigners.add(pubkey.toBase58())
							return
						}

						const { walletDelegate, delegateTransferred } =
							await client.getAccountData(walletAccountKey.toBase58())

						uniqueValetSigners.add(pubkey.toBase58())

						valetContextMap.set(pubkey.toBase58(), {
							walletAccount: walletAccountKey,
							walletDelegate,
							walletSigner: pubkey,
							delegateTransferred,
						})
					})
				)

				if (!uniqueValetSigners.size) return instruction

				const formattedInstruction = {
					data,
					keys: keys.map((i) => {
						if (uniqueValetSigners.has(i.pubkey.toBase58()) && i.isSigner) {
							return { ...i, isSigner: false }
						}
						return i
					}),
					programId,
				}

				const getWalletAccounts = (
					valetCtx: ValetUserContext
				): AccountMeta[] => {
					return [
						{
							pubkey: valetCtx.walletAccount,
							isSigner: false,
							isWritable: false,
						},
						{
							pubkey: valetCtx.walletSigner,
							isSigner: false,
							isWritable: true,
						},
						{
							pubkey: valetCtx.walletDelegate,
							isSigner: true,
							isWritable: true,
						},
					]
				}

				const walletAccounts = Array.from(uniqueValetSigners.values())
					.map((signer) => {
						const valetCtx = valetContextMap.get(signer)
						if (!valetCtx)
							throw new Error(`Valet context not found for ${signer}`)
						return getWalletAccounts(valetCtx)
					})
					.reduce((acc, cur) => acc.concat(cur), [])

				return await client.signInstructionIx({
					instruction: formattedInstruction,
					uniqueSigners: uniqueValetSigners.size,
					walletAccounts,
				})
			})
		)

		const valetContext = valetContextMap.get(proposedFeePayer.toBase58())

		let feePayer: PublicKey

		if (!valetContext) feePayer = proposedFeePayer
		else if (valetContext.delegateTransferred)
			feePayer = valetContext.walletDelegate
		else
			feePayer = feePayerIfDelegateNotTransfered ?? valetContext.walletDelegate

		const modified = !!valetContextMap.size

		return { instructions, feePayer, modified }
	}
}
