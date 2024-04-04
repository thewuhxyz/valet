import {
	clusterApiUrl,
	Connection,
	PublicKey,
	Transaction,
	VersionedTransaction,
} from "@solana/web3.js"
import {
	SolanaSplConnection,
	customSplTokenAccounts,
	type SolanaTokenAccountWithKeyAndProgramIdString,
	type TokenMetadataString,
	fetchSplMetadataUri,
} from "@valet/token"
import { TokenSuperStore, ActiveWallet } from "@valet/ui"
import { OtaTransaction } from "@valet/ota"
import type { AnchorProvider } from "@coral-xyz/anchor"
import {
	PUBLIC_APP_DOMAIN,
	PUBLIC_DAPP_WALLET_PUBLICKEY,
} from "$env/static/public"

const endpoint = clusterApiUrl("devnet")
const connection = new Connection(endpoint)

console.log("app domian:", PUBLIC_APP_DOMAIN)

const getCustomSplTokenAccounts = async (publicKey: string) => {
	const data = await customSplTokenAccounts(
		connection,
		new PublicKey(publicKey)
	)
	const json = SolanaSplConnection.customSplTokenAccountsToJson(data)
	// @ts-ignore
	const bar = SolanaSplConnection.customSplTokenAccountsFromJson(json)
	return bar
}

const getCustomSplMetadataUri = async (
	tokens: Array<SolanaTokenAccountWithKeyAndProgramIdString>,
	tokenMetadata: Array<TokenMetadataString | null>
) => {
	return await fetchSplMetadataUri(tokens, tokenMetadata)
}

const otaPrepareTransaction = async <
	T extends Transaction | VersionedTransaction,
>(
	provider: AnchorProvider,
	transaction: T
): Promise<T> => {
	return await OtaTransaction.prepare(provider, transaction, {
		feePayerIfDelegateNotTransfered: new PublicKey(
			PUBLIC_DAPP_WALLET_PUBLICKEY
		),
	})
}

const tokens = new TokenSuperStore({
	connectionUrl: endpoint,
	getCustomSplTokenAccounts,
	getCustomSplMetadataUri,
	otaPrepareTransaction,
})

export const activeWallet = new ActiveWallet(tokens)

export const refresh = async () => {
	try {
		await activeWallet.refreshTokens()
	} catch (e) {
		console.error("something went wrong updating tokens:", e)
	}
}
