import { PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js"
import {
	deserializeOriginalTransaction,
	isVersionedTransaction,
} from "@valet/lib"
import { type SolanaWallet } from "@valet/token"
import * as bs58 from "bs58"
import { BackgroundRequest } from "./background-client"

export class BackgroundWallet implements SolanaWallet {
	publicKey: PublicKey
	constructor(
		publicKey: string,
		private ota: boolean = false
	) {
		this.publicKey = new PublicKey(publicKey)
	}

	async signTransaction<T extends Transaction | VersionedTransaction>(
		tx: T
	): Promise<T> {
		let transaction: T
		let signer: PublicKey

		if (this.ota) {
			const [delegate, otaTransaction] = await this._prepareOtaTransaction(tx)
			transaction = otaTransaction
			signer = delegate
		} else {
			transaction = tx
			signer = this.publicKey
		}

		return await this._signTransaction(transaction, signer)
	}

	async signAllTransactions<T extends Transaction | VersionedTransaction>(
		txs: T[]
	): Promise<T[]> {
		return Promise.all(txs.map((tx) => this.signTransaction(tx)))
	}

	private async _prepareOtaTransaction<
		T extends Transaction | VersionedTransaction,
	>(tx: T): Promise<[PublicKey, T]> {
		const isVersioned = isVersionedTransaction(tx)
		const txStr = bs58.encode(tx.serialize({ requireAllSignatures: false }))

		const [delegate, otaTransaction] =
			await BackgroundRequest.prepareOtaTransaction(txStr, isVersioned)

		const transaction = deserializeOriginalTransaction(
			otaTransaction,
			isVersioned
		) as T

		return [new PublicKey(delegate), transaction]
	}

	private async _signTransaction<T extends Transaction | VersionedTransaction>(
		tx: T,
		signer: PublicKey
	): Promise<T> {
		const txStr = bs58.encode(tx.serialize({ requireAllSignatures: false }))
		const respSignature = await BackgroundRequest.signTransaction(
			txStr,
			signer.toBase58()
		)
		tx.addSignature(signer, Buffer.from(bs58.decode(respSignature)))
		return tx
	}
}
