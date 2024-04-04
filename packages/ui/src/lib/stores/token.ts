import type { TokenDataWithBalance, TokenDataWithPrice } from "$lib/types.js"
import { AnchorProvider } from "@coral-xyz/anchor"
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet.js"
import { TokenListProvider, type TokenInfo } from "@solana/spl-token-registry"
import {
	Keypair,
	type Cluster,
	type ConfirmOptions,
	Connection,
	PublicKey,
} from "@solana/web3.js"
import {
	SOL_NATIVE_MINT,
	WSOL_MINT,
	type CustomSplTokenAccountsResponseString,
	type SolanaTokenAccountWithKeyAndProgramIdString,
	type TokenMetadataString,
	type SplNftMetadataString,
	TokenInterface,
	type SolanaWallet,
	Solana,
	TOKEN_PROGRAM_ID,
	type WalletContext,
	type OtaPrepareTransaction,
} from "@valet/token"
import { getLogger } from "@valet/lib"
import BN from "bn.js"
import { derived, get, writable } from "svelte/store"

const logger = getLogger("store:token")

const BERN_MINT = "CKfatsPMUf8SkiURsDXs7eK6GWb4Jsd6UDbs7twMCWxo"
const SOL_LOGO_URI =
	"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png"

export class TokenRegistryStore {
	public registry = writable<Map<string, TokenInfo>>(new Map())
	set = this.registry.set
	subscribe = this.registry.subscribe

	constructor(private cluster: Cluster = "mainnet-beta") {}

	async setTokenRegistry() {
		try {
			const tokens = await new TokenListProvider().resolve()
			const tokenList = tokens.filterByClusterSlug(this.cluster).getList()
			const tokenMap = tokenList.reduce((map, item) => {
				if (item.address === WSOL_MINT) {
					map.set(item.address, { ...item, symbol: "wSOL" })
				} else {
					map.set(item.address, item)
				}
				return map
			}, new Map<string, TokenInfo>())
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
			})
			tokenMap.set(BERN_MINT, {
				name: "Bonk Earn",
				address: BERN_MINT,
				chainId: 101,
				decimals: 9,
				symbol: "BERN",
				logoURI: "https://i.imgur.com/nd9AVZ4.jpeg",
			})
			console.log("========== token registry updated =========")
			this.set(tokenMap)
		} catch (e) {
			logger.error("error setting token registry", e)
		}
	}
}

export class TokenInterfaceStore {
	public tokenInterface = writable<TokenInterface>()
	set = this.tokenInterface.set
	subscribe = this.tokenInterface.subscribe

	constructor(connectionUrl: string, connectionOptons: ConfirmOptions = {}) {
		this.init(connectionUrl, connectionOptons)
	}

	init(
		connectionUrl: string,
		connectionOptons: ConfirmOptions = {
			commitment: "processed",
			preflightCommitment: "processed",
		}
	) {
		const dummyKeypair = Keypair.generate()
		// @ts-ignore
		const wallet = new NodeWallet(dummyKeypair)
		const connection = new Connection(connectionUrl) // todo: make this dynamic
		const provider = new AnchorProvider(connection, wallet, connectionOptons)
		this.set(new TokenInterface(provider))
	}
}

export class TokenSuperStore {
	private tokens = writable<CustomSplTokenAccountsResponseString | undefined>()
	set = this.tokens.set
	subscribe = this.tokens.subscribe

	balances = writable<Map<string, TokenDataWithPrice> | undefined>()

	tokenRegistry: TokenRegistryStore
	tokenInterface: TokenInterfaceStore

	private getCustomSplTokenAccounts: GetCustomSplTokenAccounts
	private getCustomSplMetadataUri: GetCustomSplMetadataUri

	otaPrepareTransaction?: OtaPrepareTransaction

	constructor(config: TokenSuperStoreConfig) {
		this.tokenRegistry = new TokenRegistryStore()
		this.tokenInterface = new TokenInterfaceStore(config.connectionUrl)
		this.getCustomSplTokenAccounts = config.getCustomSplTokenAccounts
		this.getCustomSplMetadataUri = config.getCustomSplMetadataUri
		this.otaPrepareTransaction = config.otaPrepareTransaction
	}

	async init(activeWallet?: string) {
		try {
			await Promise.all([
				this.tokenRegistry.setTokenRegistry(),
				this.refreshTokens(activeWallet),
			])
		} catch (e) {
			logger.debug("something went wrong with token super store init:", e)
		}
	}

	async reset() {
		this.balances.set(undefined)
		this.set(undefined)
	}

	async refreshTokens(activeWallet?: string) {
		if (!activeWallet) {
			this.reset()
			return
		}
		const tokens = await this.getCustomSplTokenAccounts(activeWallet)
		this.updateTokens(tokens)
	}

	async updateTokens(tokens: CustomSplTokenAccountsResponseString) {
		this.set(tokens)
	}

	updateBalances(data: Map<string, TokenDataWithPrice>) {
		if (!data.size) return
		this.balances.set(data)
	}

	async transfer(
		token: TokenDataWithPrice,
		destinationAddress: string,
		amount: number,
		wallet: SolanaWallet
	) {
		const mintMap = get(this.derived.tokenMintMap)

		if (!mintMap) throw new Error("Token mint map is undefined")
		const mintInfo = mintMap.get(token.mint)

		const tokenRegistry = get(this.tokenRegistry.registry)
		const tokenInterface = get(this.tokenInterface)

		const solanaCtx: WalletContext = {
			connection: this.connection,
			commitment: this.connection.commitment!,
			registry: tokenRegistry || new Map(),
			tokenInterface: tokenInterface,
		}

		if (token.mint === SOL_NATIVE_MINT.toString()) {
			return await Solana.transferSol(
				solanaCtx,
				{
					source: wallet.publicKey,
					destination: new PublicKey(destinationAddress),
					amount: amount,
				},
				wallet
			)
		}

		return await Solana.transferToken(
			solanaCtx,
			{
				destination: new PublicKey(destinationAddress),
				mint: new PublicKey(token.mint),
				programId: new PublicKey(
					mintInfo ? mintInfo.programId : TOKEN_PROGRAM_ID
				),
				amount: amount,
				decimals: token.decimals,
			},
			wallet
		)
	}

	get connection() {
		return get(this.tokenInterface).provider.connection
	}

	get getBalances() {
		return this.derived.ftToBalancesMap
	}

	get mintMap() {
		return this.derived.tokenMintMap
	}

	get derived() {
		const ftMetadata = derived(this.tokens, async (tokens) => {
			if (!tokens) {
				logger.debug("NO TOKENS RETURNED")
				return
			}
			return new Map(
				await this.getCustomSplMetadataUri(
					tokens.fts.fungibleTokens,
					tokens.fts.fungibleTokenMetadata
				)
			)
		})

		// token account key -> token account
		const ftAccountMap = derived(this.tokens, (tokenStore) => {
			if (!tokenStore) return
			return new Map(tokenStore.fts.fungibleTokens.map((t) => [t.key, t]))
		})

		// token account key -> token mint key
		const ftToMintKeyMap = derived(this.tokens, (tokenStore) => {
			if (!tokenStore) return
			return new Map(tokenStore.fts.fungibleTokens.map((t) => [t.key, t.mint]))
		})

		// token mint key -> token mint account
		const tokenMintMap = derived(this.tokens, (tokenStore) => {
			if (!tokenStore) return
			return new Map(tokenStore.mintsMap)
		})

		const ftNativeBalances = derived(
			[
				ftToMintKeyMap,
				ftAccountMap,
				tokenMintMap,
				ftMetadata,
				this.tokenRegistry,
			],
			async ([
				ftToMintKeyMap,
				ftAccountMap,
				tokenMintMap,
				_ftMetadata,
				tokenRegistry,
			]) => {
				const tokenBalances = new Map<string, TokenDataWithBalance>()
				const ftMetadata = await _ftMetadata
				if (!ftToMintKeyMap || !tokenMintMap || !ftAccountMap || !ftMetadata)
					return tokenBalances
				ftToMintKeyMap.forEach((mintAddress, tokenAddress) => {
					const tokenMint = tokenMintMap.get(mintAddress)
					const tokenMetadata = ftMetadata.get(tokenAddress)
					const tokenRegistryItem = tokenRegistry.get(mintAddress)
					const tokenAccount = ftAccountMap.get(tokenAddress)!
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
						: tokenRegistryItem ?? ({} as TokenInfo)

					decimals = tokenMint
						? tokenMint.decimals
						: tokenRegistryItem?.decimals || 0

					if (tokenRegistryItem) {
						if (ticker === "") {
							ticker = tokenRegistryItem.symbol
						}
						if (logo === "") {
							logo = tokenRegistryItem.logoURI
						}
						if (name === "") {
							name = tokenRegistryItem.name
						}
					}

					const nativeBalance = tokenAccount.amount as BN
					const displayBalance = decimals
						? parseFloat(nativeBalance.toString()) /
							parseFloat((10 ** decimals).toString())
						: parseFloat(nativeBalance.toString())
					const priceMint =
						tokenAccount.mint.toString() === WSOL_MINT
							? SOL_NATIVE_MINT
							: tokenAccount.mint.toString()

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
					})
				})

				return tokenBalances
			}
		)

		const coingeckoIdToMintMap = derived(
			[ftToMintKeyMap, this.tokenRegistry],
			([ftToMintKeyMap, tokenRegistry]) => {
				const coingeckoIdToMint = new Map<string, string>()
				if (!ftToMintKeyMap || !tokenRegistry) return coingeckoIdToMint
				ftToMintKeyMap.forEach((mintAddress) => {
					if (coingeckoIdOverride[mintAddress]) {
						coingeckoIdToMint.set(coingeckoIdOverride[mintAddress], mintAddress)
						return
					}
					const tokenInfo = tokenRegistry.get(mintAddress)
					if (
						tokenInfo &&
						tokenInfo.extensions &&
						tokenInfo.extensions.coingeckoId
					) {
						coingeckoIdToMint.set(tokenInfo.extensions.coingeckoId, mintAddress)
					}
					return
				})
				return coingeckoIdToMint
			}
		)

		// ? maybe not make this `derived` so we don't ping coingecko on every refresh
		const mintToPriceMap = derived(
			coingeckoIdToMintMap,
			async (coingeckoIdToMintMap) => {
				try {
					const ids = [...new Set(coingeckoIdToMintMap.keys())]
					if (ids.length === 0) return new Map<string, any>()

					const params = { ...baseCoingeckoParams, ids } as any
					const queryString = new URLSearchParams(params).toString()

					const resp = await fetch(
						`https://api.coingecko.com/api/v3/simple/price?${queryString}`
					)
					const json = await resp.json()
					return new Map(
						// Transform the response from id -> price data to addresss -> price data
						Object.keys(json).map((id) => [
							coingeckoIdToMintMap.get(id),
							json[id],
						])
					) as Map<string, any>
				} catch (e) {
					return new Map<string, any>()
				}
			}
		)

		const ftToBalancesMap = derived(
			[ftToMintKeyMap, ftNativeBalances, mintToPriceMap],
			async ([ftToMintKeyMap, _ftNativeBalances, _mintToPriceMap]) => {
				const ftBalancesMap = new Map<string, TokenDataWithPrice>()
				const storedBalances = get(this.balances)

				try {
					const ftNativeBalances = await _ftNativeBalances
					const mintToPriceMap = await _mintToPriceMap

					if (!ftToMintKeyMap) return ftBalancesMap
					ftToMintKeyMap.forEach((mintAddress, tokenAddress) => {
						const ftNativeBalance = ftNativeBalances.get(tokenAddress)
						if (!ftNativeBalance) return ftBalancesMap
						const displayBalance = ftNativeBalance.displayBalance
						let price = mintToPriceMap.get(ftNativeBalance.priceMint)

						if (!price && storedBalances) {
							const data = storedBalances.get(tokenAddress)
							if (data) {
								price = data.priceData
							}
						}

						const usdBalance =
							(price?.usd ?? 0) * parseFloat(displayBalance.toString())
						const recentPercentChange = parseFloat(
							(price?.usd_24h_change ?? 0).toFixed(2)
						)
						const oldUsdBalance =
							usdBalance === 0
								? 0
								: usdBalance - usdBalance * (recentPercentChange / 100)

						const recentUsdBalanceChange = usdBalance - oldUsdBalance

						ftBalancesMap.set(tokenAddress, {
							...ftNativeBalance,
							usdBalance,
							recentPercentChange,
							recentUsdBalanceChange,
							priceData: price,
						})
					})
					this.updateBalances(ftBalancesMap)
				} catch (e) {
					console.error("fetching ft to balances map failed:", e)
				} finally {
					return ftBalancesMap
				}
			}
		)

		return {
			tokenRegistry: this.tokenRegistry,
			ftMetadata,
			ftAccountMap,
			ftToMintKeyMap,
			tokenMintMap,
			ftNativeBalances,
			coingeckoIdToMintMap,
			ftToBalancesMap,
		}
	}
}

const coingeckoIdOverride: { [key: string]: string } = {
	DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ: "dust-protocol",
	DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263: "bonk",
	bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1: "blazestake-staked-sol",
	"5yxNbU8DgYJZNi3mPD9rs4XLh9ckXrhPjJ5VCujUWg5H": "fronk",
	CvB1ztJvpYQPvdPBePtRzjL4aQidjydtUz61NWgcgQtP: "epics-token",
	J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn: "jito-staked-sol",
}

const baseCoingeckoParams = {
	vs_currencies: "usd",
	include_market_cap: "true",
	include_24hr_vol: "true",
	include_24hr_change: "true",
	include_last_updated_at: "true",
}

export type GetCustomSplTokenAccounts = (
	publicKey: string
) => Promise<CustomSplTokenAccountsResponseString>

export type GetCustomSplMetadataUri = (
	tokens: Array<SolanaTokenAccountWithKeyAndProgramIdString>,
	tokenMetadata: Array<TokenMetadataString | null>
) => Promise<Array<[string, SplNftMetadataString]>>

export type TokenSuperStoreConfig = {
	connectionUrl: string
	getCustomSplTokenAccounts: GetCustomSplTokenAccounts
	getCustomSplMetadataUri: GetCustomSplMetadataUri
	otaPrepareTransaction?: OtaPrepareTransaction
	tokenRegistryCluster?: Cluster
}
