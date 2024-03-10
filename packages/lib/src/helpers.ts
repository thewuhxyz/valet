import { v1 } from "uuid";
import { Transaction, VersionedTransaction } from "@solana/web3.js";
import bs58 from "bs58";

export function generateUniqueId() {
	return v1();
}

export function isMobile(): boolean {
	if (typeof window !== "undefined" && typeof window.document !== "undefined") {
		return false;
	}

	return true;
}

export const deserializeTransaction = (serializedTx: string) => {
	return VersionedTransaction.deserialize(bs58.decode(serializedTx));
};

export const deserializeLegacyTransaction = (serializedTx: string) => {
	return Transaction.from(bs58.decode(serializedTx));
};

export const isVersionedTransaction = (
	tx: Transaction | VersionedTransaction
): tx is VersionedTransaction => {
	return "version" in tx;
};

export function externalResourceUri(
	uri: string,
	options: { cached?: boolean } = {}
): string {
	if (uri) {
		uri = uri.replace(/\0/g, "");
	}
	if (uri && uri.startsWith("ipfs://")) {
		return uri.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/");
	}
	if (uri && uri.startsWith("ar://")) {
		return uri.replace("ar://", "https://arweave.net/");
	}
	if (options.cached) {
		return `https://swr.xnfts.dev/1min/${uri}`;
	}
	return `${uri}`;
}

export function parseUrlHash(url: string) {
	const hashParts = new URL(url).hash.slice(1).split("&");
	const hashMap = new Map(
		hashParts.map((part) => {
			const [name, value] = part.split("=");
			return [name, value];
		})
	);

	return hashMap;
}