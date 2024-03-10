import type { TokenInfo } from "@solana/spl-token-registry";
import type { HeliusParsedTransaction, TokenAccountWithKey } from "./types";

export const truncate = (str: string, len: number = 10) => {
	return str.length > len
		? `${str.slice(0, Math.floor(len / 2))}...${str.slice(
				Math.floor(str.length - len / 2)
			)}`
		: str;
};


export async function fetchRecentSolanaTransactionDetails(
	publicKey: string
): Promise<HeliusParsedTransaction[]> {
	try {
		const response = await fetch(
			`https://api.helius.xyz/v0/addresses/${publicKey}/transactions`
		);
		const json = await response.json();
		return json.transactions;
	} catch (e) {
		console.error(e);
		return [];
	}
}
