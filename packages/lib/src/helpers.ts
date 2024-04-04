import { v1 } from "uuid"
import {
	Cluster,
	Connection,
	Keypair,
	PublicKey,
	Transaction,
	VersionedTransaction,
	clusterApiUrl,
} from "@solana/web3.js"
import bs58 from "bs58"
import {
	RPC_DEVNET_GENESIS_HASH,
	RPC_MAINNET_BETA_GENESIS_HASH,
} from "./constants"

export function generateUniqueId() {
	return v1()
}

export function isMobile(): boolean {
	if (typeof window !== "undefined" && typeof window.document !== "undefined") {
		return false
	}

	return true
}

export const deserializeTransaction = (serializedTx: string) => {
	return VersionedTransaction.deserialize(bs58.decode(serializedTx))
}

export const deserializeLegacyTransaction = (serializedTx: string) => {
	return Transaction.from(bs58.decode(serializedTx))
}

export const isVersionedTransaction = (
	tx: Transaction | VersionedTransaction
): tx is VersionedTransaction => {
	return "version" in tx
}

export function externalResourceUri(
	uri: string,
	options: { cached?: boolean } = {}
): string {
	if (uri) {
		uri = uri.replace(/\0/g, "")
	}
	if (uri && uri.startsWith("ipfs://")) {
		return uri.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/")
		// return uri.replace("ipfs://", "https://ipfs.io/ipfs/");
	}
	if (uri && uri.startsWith("ar://")) {
		return uri.replace("ar://", "https://arweave.net/")
	}
	if (options.cached) {
		return `https://swr.xnfts.dev/1min/${uri}`
	}
	return `${uri}`
}

export function parseUrlHash(url: string) {
	const hashParts = new URL(url).hash.slice(1).split("&")
	const hashMap = new Map(
		hashParts.map((part) => {
			const [name, value] = part.split("=")
			return [name, value]
		})
	)

	return hashMap
}

export async function getCluster(conn: Connection): Promise<Cluster | null> {
	// const conn = PgConnection.createConnection({ endpoint: rpcUrl });
	const genesisHash = await conn.getGenesisHash()
	switch (genesisHash) {
		case RPC_DEVNET_GENESIS_HASH:
			return "devnet"
		case RPC_MAINNET_BETA_GENESIS_HASH:
			return "mainnet-beta"
		default:
			return null
	}
}

export function decodeJWT(token: string) {
	const parts = token.split(".")

	const payload = JSON.parse(
		atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
	)

	return payload
}

const nowInEpochSeconds = () => Math.floor(Date.now() / 1000)

const getExpiryTime = (timeInSeconds: number): [number, number] => [
	nowInEpochSeconds() + timeInSeconds,
	nowInEpochSeconds(),
]

export async function imageUrlToBase64(url: string): Promise<string | null> {
	try {
		const response = await fetch(url)

		const blob = await response.arrayBuffer()

		const contentType = response.headers.get("content-type")

		const base64String = `data:${contentType};base64,${Buffer.from(
			blob
		).toString("base64")}`

		return base64String
	} catch (err) {
		return null
	}
}

export function deserializeOriginalTransaction<
	T extends Transaction | VersionedTransaction,
>(transaction: string, isVersioned: boolean): T {
	if (isVersioned) {
		return deserializeTransaction(transaction) as T
	} else {
		return deserializeLegacyTransaction(transaction) as T
	}
}
