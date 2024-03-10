import { BackgroundRequest } from "$lib/background-client";
import type { TokenDataWithBalance, TokenDataWithPrice } from "$lib/types";
import { TokenListProvider, type TokenInfo } from "@solana/spl-token-registry";
import {
	PublicKey,
	type Connection,
	type ParsedTransactionWithMeta,
	type Cluster,
} from "@solana/web3.js";
import {
	SOL_NATIVE_MINT,
	WSOL_MINT,
	type CustomSplTokenAccountsResponseString,
	type SplNftMetadataString,
} from "@valet/lib";
import BN from "bn.js";
import { derived, get, writable } from "svelte/store";

const BERN_MINT = "CKfatsPMUf8SkiURsDXs7eK6GWb4Jsd6UDbs7twMCWxo";
const SOL_LOGO_URI =
	"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png";

const tokenStoreCreate = () => {
	const { subscribe, set } = writable<
		CustomSplTokenAccountsResponseString | undefined
	>();

	const init = async (activeWallet: string) => {
		try {
			const tokens =
				await BackgroundRequest.getCustomSplTokenAccounts(activeWallet);
			set(tokens);
		} catch (e) {
			set(undefined);
		}
	};

	return { subscribe, init, set };
};

export const tokenStore = tokenStoreCreate();
// token account key -> token account
const ftAccountMap = derived(tokenStore, (tokenStore) => {
	if (!tokenStore) return;
	return new Map(tokenStore.fts.fungibleTokens.map((t) => [t.key, t]));
});

// token account key -> token mint key
export const ftToMintKeyMap = derived(tokenStore, (tokenStore) => {
	if (!tokenStore) return;
	return new Map(tokenStore.fts.fungibleTokens.map((t) => [t.key, t.mint]));
});

// token mint key -> token mint account
export const tokenMintMap = derived(tokenStore, (tokenStore) => {
	if (!tokenStore) return;
	return new Map(tokenStore.mintsMap);
});

const ftMetadataStore = () => {
	const { subscribe, set } = writable<Map<string, SplNftMetadataString>>();

	async function setMetadata() {
		const tokens = get(tokenStore);
		if (!tokens) {
			set(new Map());
			return;
		}
		try {
			const metadata = await BackgroundRequest.getCustomSplMetadataUri(
				tokens.fts.fungibleTokens,
				tokens.fts.fungibleTokenMetadata
			);
			set(new Map(metadata));
		} catch (e) {
			set(new Map());
		}
	}

	return { subscribe, setMetadata };
};

const tokenRegistryStore = (cluster: Cluster = "mainnet-beta") => {
	const { subscribe, set } = writable<Map<string, TokenInfo>>();

	async function setTokenRegistry() {
		try {
			const tokens = await new TokenListProvider().resolve();
			const tokenList = tokens.filterByClusterSlug(cluster).getList();
			const tokenMap = tokenList.reduce((map, item) => {
				if (item.address === WSOL_MINT) {
					map.set(item.address, { ...item, symbol: "wSOL" });
				} else {
					map.set(item.address, item);
				}
				return map;
			}, new Map());
			tokenMap.set(SOL_NATIVE_MINT, {
				name: "Solana",
				address: SOL_NATIVE_MINT,
				chainId: 101,
				decimals: 9,
				symbol: "SOL",
				logoURI: SOL_LOGO_URI,
				extensions: {
					coingeckoId: "solana",
				},
			});
			tokenMap.set(BERN_MINT, {
				name: "Bonk Earn",
				address: BERN_MINT,
				chainId: 101,
				decimals: 9,
				symbol: "BERN",
				logoURI: "https://i.imgur.com/nd9AVZ4.jpeg",
			});
			set(tokenMap);
		} catch (e) {
			set(new Map());
		}
	}

	return { subscribe, setTokenRegistry };
};

export const ftMetadata = ftMetadataStore();
export const tokenRegistry = tokenRegistryStore();

export const ftNativeBalances = derived(
	[ftToMintKeyMap, ftAccountMap, tokenMintMap, ftMetadata, tokenRegistry],
	([ftToMintKeyMap, ftAccountMap, tokenMintMap, ftMetadata, tokenRegistry]) => {
		const tokenBalances = new Map<string, TokenDataWithBalance>();
		if (!ftToMintKeyMap || !tokenMintMap || !ftAccountMap) return tokenBalances;
		ftToMintKeyMap.forEach((mintAddress, tokenAddress) => {
			const tokenMint = tokenMintMap.get(mintAddress);
			const tokenMetadata = ftMetadata.get(tokenAddress);
			const tokenRegistryItem = tokenRegistry.get(mintAddress)!;
			const tokenAccount = ftAccountMap.get(tokenAddress)!;
			let {
				symbol: ticker,
				logoURI: logo,
				name,
				decimals,
			} = tokenMint &&
			tokenMetadata &&
			tokenMetadata.metadata &&
			tokenMetadata.metadata.data
				? {
						symbol: tokenMetadata.metadata.data.symbol.replace(/\0/g, ""),
						logoURI:
							tokenMetadata.tokenMetaUriData.image ??
							tokenMetadata.metadata.data.uri.replace(/\0/g, ""),
						name: tokenMetadata.metadata.data.name.replace(/\0/g, ""),
						decimals: tokenMint.decimals,
					}
				: tokenRegistryItem ?? ({} as TokenInfo);

			decimals = tokenMint ? tokenMint.decimals : tokenRegistryItem.decimals;

			if (tokenRegistryItem) {
				if (ticker === "") {
					ticker = tokenRegistryItem.symbol;
				}
				if (logo === "") {
					logo = tokenRegistryItem.logoURI;
				}
				if (name === "") {
					name = tokenRegistryItem.name;
				}
			}

			const nativeBalance = tokenAccount.amount as BN;
			const displayBalance = decimals
				? parseFloat(nativeBalance.toString()) /
					parseFloat((10 ** decimals).toString())
				: parseFloat(nativeBalance.toString());
			const priceMint =
				tokenAccount.mint.toString() === WSOL_MINT
					? SOL_NATIVE_MINT
					: tokenAccount.mint.toString();

			tokenBalances.set(tokenAddress, {
				name,
				decimals,
				nativeBalance,
				displayBalance: displayBalance.toString(),
				ticker,
				logo,
				address: tokenAddress,
				mint: tokenAccount.mint.toString(),
				priceMint,
			});
		});

		return tokenBalances;
	}
);

const coingeckoIdToMintMap = derived(
	[ftToMintKeyMap, tokenRegistry],
	([ftToMintKeyMap, tokenRegistry]) => {
		const coingeckoIdToMint = new Map<string, string>();
		if (!ftToMintKeyMap) return coingeckoIdToMint;
		ftToMintKeyMap.forEach((mintAddress) => {
			if (coingeckoIdOverride[mintAddress]) {
				coingeckoIdToMint.set(coingeckoIdOverride[mintAddress], mintAddress);
				return;
			}
			const tokenInfo = tokenRegistry.get(mintAddress);
			if (
				tokenInfo &&
				tokenInfo.extensions &&
				tokenInfo.extensions.coingeckoId
			) {
				coingeckoIdToMint.set(tokenInfo.extensions.coingeckoId, mintAddress);
			}
			return;
		});
		return coingeckoIdToMint;
	}
);

const mintToPriceStore = () => {
	const { subscribe, set } = writable<Map<string, any>>();

	async function setPrices() {
		const idToMintMap = get(coingeckoIdToMintMap);
		const ids = [...new Set(idToMintMap.keys())];
		if (ids.length === 0) return;

		const params = { ...baseCoingeckoParams, ids } as any;
		const queryString = new URLSearchParams(params).toString();
		try {
			const resp = await fetch(
				`https://api.coingecko.com/api/v3/simple/price?${queryString}`
			);
			const json = await resp.json();
			set(
				new Map(
					// Transform the response from id -> price data to addresss -> price data
					Object.keys(json).map((id) => [idToMintMap.get(id), json[id]])
				) as Map<string, any>
			);
		} catch (e) {
			set(new Map());
		}
	}

	return { subscribe, setPrices };
};

export const mintToPriceMap = mintToPriceStore();

export const ftToBalancesMap = derived(
	[ftToMintKeyMap, ftNativeBalances, mintToPriceMap],
	([ftToMintKeyMap, ftNativeBalances, mintToPriceMap]) => {
		const ftBalancesMap = new Map<string, TokenDataWithPrice>();

		if (!ftToMintKeyMap) return ftBalancesMap;
		ftToMintKeyMap.forEach((mintAddress, tokenAddress) => {
			const ftNativeBalance = ftNativeBalances.get(tokenAddress);
			if (!ftNativeBalance) return;
			const displayBalance = ftNativeBalance.displayBalance;
			const price = mintToPriceMap.get(ftNativeBalance.priceMint);
			const usdBalance =
				(price?.usd ?? 0) * parseFloat(displayBalance.toString());
			const recentPercentChange = parseFloat(
				(price?.usd_24h_change ?? 0).toFixed(2)
			);
			const oldUsdBalance =
				usdBalance === 0
					? 0
					: usdBalance - usdBalance * (recentPercentChange / 100);

			const recentUsdBalanceChange = usdBalance - oldUsdBalance;

			ftBalancesMap.set(tokenAddress, {
				...ftNativeBalance,
				usdBalance,
				recentPercentChange,
				recentUsdBalanceChange,
				priceData: price,
			});
		});

		return ftBalancesMap;
	}
);

async function fetchRecentTransactions(
	connection: Connection,
	publicKey: PublicKey
): Promise<Array<ParsedTransactionWithMeta>> {
	const resp = await connection.getConfirmedSignaturesForAddress2(publicKey, {
		limit: 15,
	});

	const signatures = resp.map((s) => s.signature);
	const transactions: Array<ParsedTransactionWithMeta | null> =
		await connection.getParsedTransactions(signatures);
	return transactions.filter(
		(tx) => tx !== null
	) as Array<ParsedTransactionWithMeta>;
}

const baseCoingeckoParams = {
	vs_currencies: "usd",
	include_market_cap: "true",
	include_24hr_vol: "true",
	include_24hr_change: "true",
	include_last_updated_at: "true",
};

// TODO move this to a remote API so it can be updated without updating
// the app
const coingeckoIdOverride: { [key: string]: string } = {
	DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ: "dust-protocol",
	DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263: "bonk",
	bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1: "blazestake-staked-sol",
	"5yxNbU8DgYJZNi3mPD9rs4XLh9ckXrhPjJ5VCujUWg5H": "fronk",
	CvB1ztJvpYQPvdPBePtRzjL4aQidjydtUz61NWgcgQtP: "epics-token",
	J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn: "jito-staked-sol",
};

export const initTokensAndMetadata = async (activeWallet: string) => {
	try {
		await tokenStore.init(activeWallet);
		await ftMetadata.setMetadata();
		await mintToPriceMap.setPrices();
	} catch {}
};

export const updateTokensAndMetadata = async (
	tokens: CustomSplTokenAccountsResponseString
) => {
	try {
		tokenStore.set(tokens);
		await ftMetadata.setMetadata();
		await mintToPriceMap.setPrices();
	} catch {}
};
