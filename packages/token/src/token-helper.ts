// needed to avoid TS error TS2742, see: https://bit.ly/3ymWOFj
import type {} from "@metaplex-foundation/beet"
import { Connection } from "@solana/web3.js"
import BN from "bn.js"
import type {
	SolanaTokenAccountWithKeyAndProgramId,
	TokenMetadata,
} from "./types"
import {
	CustomSplTokenAccountsResponse,
	CustomSplTokenAccountsResponseString,
} from "./tokens"

export class SolanaSplConnection extends Connection {
	static customSplTokenAccountsFromJson(
		json: CustomSplTokenAccountsResponseString
	): CustomSplTokenAccountsResponseString {
		return {
			mintsMap: json.mintsMap.map((m: any) => {
				return [
					m[0],
					{
						...m[1],
						supply: BigInt(m[1].supply),
					},
				]
			}),
			fts: {
				...json.fts,
				fungibleTokens: json.fts.fungibleTokens.map((t: any) => {
					return {
						...t,
						amount: new BN(t.amount),
					}
				}),
			},
			nfts: {
				...json.nfts,
				nftTokens: json.nfts.nftTokens.map((t: any) => {
					return {
						...t,
						amount: new BN(t.amount),
					}
				}),
			},
		}
	}

	static customSplTokenAccountsToJson(
		_resp: CustomSplTokenAccountsResponse
	) /* : CustomSplTokenAccountsResponseString */ {
		return {
			mintsMap: _resp.mintsMap.map(([publicKey, mintStr]) => {
				return [
					publicKey,
					mintStr != null
						? {
								...mintStr,
								supply: mintStr.supply.toString(),
								mintAuthority: mintStr.mintAuthority?.toString(),
								freezeAuthority: mintStr.freezeAuthority?.toString(),
							}
						: null,
				]
			}),
			fts: {
				fungibleTokens: _resp.fts.fungibleTokens.map((t) => {
					return SolanaSplConnection.solanaTokenAccountWithKeyToJson(t)
				}),
				fungibleTokenMetadata: _resp.fts.fungibleTokenMetadata.map((t) => {
					return t ? SolanaSplConnection.tokenMetadataToJson(t) : null
				}),
			},
			nfts: {
				nftTokens: _resp.nfts.nftTokens.map((t) => {
					return SolanaSplConnection.solanaTokenAccountWithKeyToJson(t)
				}),
				nftTokenMetadata: _resp.nfts.nftTokenMetadata.map((t) => {
					return t ? SolanaSplConnection.tokenMetadataToJson(t) : null
				}),
			},
		}
	}

	static solanaTokenAccountWithKeyToJson(
		t: SolanaTokenAccountWithKeyAndProgramId
	) /* : SolanaTokenAccountWithKeyAndProgramIdString */ {
		return {
			...t,
			mint: t.mint.toString(),
			key: t.key.toString(),
			programId: t.programId.toString(),
			amount: t.amount.toString(),
			delegate: t.delegate?.toString(),
			delegatedAmount: t.delegatedAmount.toString(),
			// authority: t.authority.toString(),
			closeAuthority: t.closeAuthority?.toString(),
		}
	}

	static tokenMetadataToJson(t: TokenMetadata) /* : TokenMetadataString */ {
		return {
			...t,
			publicKey: t.publicKey.toString(),
			account: {
				...t.account,
				updateAuthority: t.account.updateAuthority.toString(),
				mint: t.account.mint.toString(),
				collection: t.account.collection
					? {
							...t.account.collection,
							key: t.account.collection.key.toString(),
						}
					: null,
				uses: t.account.uses
					? {
							...t.account.uses,
							remaining: t.account.uses.remaining.toString(),
							total: t.account.uses.total.toString(),
						}
					: null,
				data: {
					...t.account.data,
					creators: (t.account.data.creators ?? []).map((c) => {
						return {
							...c,
							address: c.address.toString(),
						}
					}),
				},
			},
		}
	}
}