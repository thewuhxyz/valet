// needed to avoid TS error TS2742, see: https://bit.ly/3ymWOFj
import type {} from "@metaplex-foundation/beet";
import {
	Commitment,
	Connection,
	ConnectionConfig,
	LAMPORTS_PER_SOL,
	PublicKey,
	SystemProgram,
	Transaction,
	TransactionInstruction,
	TransactionSignature,
} from "@solana/web3.js";
import BN from "bn.js";
import type {
	SolanaTokenAccountWithKeyAndProgramId,
	SolanaTokenAccountWithKeyAndProgramIdString,
	SplNftMetadataString,
	TokenMetadata,
	TokenMetadataString,
} from "./types";
import {
	CustomSplTokenAccountsResponse,
	CustomSplTokenAccountsResponseString,
	TokenInterface,
	associatedTokenAddress,
} from ".";
import {
	SOLANA_CONNECTION_RPC_CUSTOM_SPL_METADATA_URI,
	SOLANA_CONNECTION_RPC_CUSTOM_SPL_TOKEN_ACCOUNTS,
	UI_RPC_METHOD_SOLANA_SIGN_ALL_TRANSACTIONS,
	UI_RPC_METHOD_SOLANA_SIGN_AND_SEND_TRANSACTION,
	UI_RPC_METHOD_SOLANA_SIGN_TRANSACTION,
} from "../constants";
import { BackgroundClient } from "../channel";
import type { TokenInfo } from "@solana/spl-token-registry";
import * as bs58 from "bs58";
import { createAssociatedTokenAccountInstruction } from "@solana/spl-token";
import * as anchor from "@coral-xyz/anchor";
import * as assertOwner from "./assert-owner";

export class SolanaSplConnection extends Connection {
	private _backgroundClient: BackgroundClient;

	// Note that this constructor is actually meaningless.
	// We only use it so that we can subclass Connection.
	// In reality, the params here are actually read in the context of the
	// background script.
	constructor(
		backgroundClient: BackgroundClient,
		endpoint: string,
		commitmentOrConfig?: Commitment | ConnectionConfig
	) {
		super(endpoint, commitmentOrConfig);
		this._backgroundClient = backgroundClient;
	}

	async customSplMetadataUri(
		tokens: Array<SolanaTokenAccountWithKeyAndProgramIdString>,
		tokenMetadata: Array<TokenMetadataString | null>
	): Promise<Array<[string, SplNftMetadataString]>> {
		return await this._backgroundClient.request({
			method: SOLANA_CONNECTION_RPC_CUSTOM_SPL_METADATA_URI,
			params: [tokens, tokenMetadata],
		});
	}

	async customSplTokenAccounts(
		publicKey: PublicKey
	): Promise<CustomSplTokenAccountsResponseString> {
		const resp = await this._backgroundClient.request({
			method: SOLANA_CONNECTION_RPC_CUSTOM_SPL_TOKEN_ACCOUNTS,
			params: [publicKey.toString()],
		});
		return SolanaSplConnection.customSplTokenAccountsFromJson(resp);
	}

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
				];
			}),
			fts: {
				...json.fts,
				fungibleTokens: json.fts.fungibleTokens.map((t: any) => {
					return {
						...t,
						amount: new BN(t.amount),
					};
				}),
			},
			nfts: {
				...json.nfts,
				nftTokens: json.nfts.nftTokens.map((t: any) => {
					return {
						...t,
						amount: new BN(t.amount),
					};
				}),
			},
		};
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
				];
			}),
			fts: {
				fungibleTokens: _resp.fts.fungibleTokens.map((t) => {
					return SolanaSplConnection.solanaTokenAccountWithKeyToJson(t);
				}),
				fungibleTokenMetadata: _resp.fts.fungibleTokenMetadata.map((t) => {
					return t ? SolanaSplConnection.tokenMetadataToJson(t) : null;
				}),
			},
			nfts: {
				nftTokens: _resp.nfts.nftTokens.map((t) => {
					return SolanaSplConnection.solanaTokenAccountWithKeyToJson(t);
				}),
				nftTokenMetadata: _resp.nfts.nftTokenMetadata.map((t) => {
					return t ? SolanaSplConnection.tokenMetadataToJson(t) : null;
				}),
			},
		};
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
		};
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
						};
					}),
				},
			},
		};
	}

	public static async transferSol(
		ctx: SolanaContext,
		req: TransferSolRequest
	): Promise<string> {
		const { walletPublicKey, tokenInterface, commitment } = ctx;
		const tx = new Transaction();
		tx.add(
			SystemProgram.transfer({
				fromPubkey: new PublicKey(req.source),
				toPubkey: new PublicKey(req.destination),
				lamports: req.amount * LAMPORTS_PER_SOL,
			})
		);
		tx.feePayer = walletPublicKey;
		tx.recentBlockhash = (
			await tokenInterface.provider.connection.getLatestBlockhash(commitment)
		).blockhash;
		const signedTx = await SolanaProvider.signTransaction(ctx, tx);
		const rawTx = signedTx.serialize();

		return await ctx.tokenInterface.provider.connection.sendRawTransaction(
			rawTx,
			{
				skipPreflight: false,
				preflightCommitment: ctx.commitment,
			}
		);
	}

	public static async transferToken(
		ctx: SolanaContext,
		req: TransferTokenRequest
	): Promise<string> {
		const { walletPublicKey, registry, tokenInterface, commitment } = ctx;
		const { mint, programId, destination, amount } = req;

		const decimals = (() => {
			if (req.decimals !== undefined) {
				return req.decimals;
			}
			const tokenInfo = registry.get(mint.toString());
			if (!tokenInfo) {
				throw new Error("no token info found");
			}
			const decimals = tokenInfo.decimals;
			return decimals;
		})();

		const nativeAmount = new BN(amount);

		const destinationAta = associatedTokenAddress(mint, destination, programId);
		const sourceAta = associatedTokenAddress(mint, walletPublicKey, programId);

		const [destinationAccount, destinationAtaAccount] =
			await anchor.utils.rpc.getMultipleAccounts(
				tokenInterface.provider.connection,
				[destination, destinationAta],
				commitment
			);

		//
		// Require the account to either be a system program account or a brand new
		// account.
		//
		if (
			destinationAccount &&
			!destinationAccount.account.owner.equals(SystemProgram.programId)
		) {
			throw new Error("invalid account");
		}

		// Instructions to execute prior to the transfer.
		const preInstructions: Array<TransactionInstruction> = [];
		if (!destinationAtaAccount) {
			preInstructions.push(
				assertOwner.assertOwnerInstruction({
					account: destination,
					owner: SystemProgram.programId,
				})
			);
			preInstructions.push(
				createAssociatedTokenAccountInstruction(
					walletPublicKey,
					destinationAta,
					destination,
					mint,
					programId
				)
			);
		}

		const tx = await tokenInterface
			.withProgramId(programId)
			.methods.transferChecked(nativeAmount, decimals)
			.accounts({
				source: sourceAta,
				mint,
				destination: destinationAta,
				authority: walletPublicKey,
			})
			.preInstructions(preInstructions)
			.transaction();
		tx.feePayer = walletPublicKey;
		tx.recentBlockhash = (
			await tokenInterface.provider.connection.getLatestBlockhash(commitment)
		).blockhash;
		const signedTx = await SolanaProvider.signTransaction(ctx, tx);
		const rawTx = signedTx.serialize();

		return await tokenInterface.provider.connection.sendRawTransaction(rawTx, {
			skipPreflight: false,
			preflightCommitment: commitment,
		});
	}
}

export class SolanaProvider {
	public static async signTransaction(
		ctx: SolanaContext,
		tx: Transaction
	): Promise<Transaction> {
		const { walletPublicKey, backgroundClient } = ctx;
		const txStr = bs58.encode(tx.serialize({ requireAllSignatures: false }));
		const respSignature = await backgroundClient.request({
			method: UI_RPC_METHOD_SOLANA_SIGN_TRANSACTION,
			params: [txStr, walletPublicKey.toString()],
		});
		tx.addSignature(walletPublicKey, Buffer.from(bs58.decode(respSignature)));
		return tx;
	}

	public static async signAllTransactions(
		ctx: SolanaContext,
		txs: Transaction[]
	): Promise<Transaction[]> {
		const { walletPublicKey } = ctx;
		// Serialize messages.
		const txStrs = txs.map((tx) => {
			return bs58.encode(tx.serialize({ requireAllSignatures: false }));
		});

		// Get signatures from the background script.
		const signatures: Array<string> = await ctx.backgroundClient.request({
			method: UI_RPC_METHOD_SOLANA_SIGN_ALL_TRANSACTIONS,
			params: [txStrs, walletPublicKey.toString()],
		});

		// Add the signatures to the transactions.
		txs.forEach((t, idx) => {
			t.addSignature(
				walletPublicKey,
				Buffer.from(bs58.decode(signatures[idx]))
			);
		});

		// Done.
		return txs;
	}

	public static async signAndSendTransaction(
		ctx: SolanaContext,
		tx: Transaction
	): Promise<TransactionSignature> {
		const { walletPublicKey, connection, commitment, backgroundClient } = ctx;

		tx.feePayer = walletPublicKey;
		tx.recentBlockhash = (
			await connection.getLatestBlockhash(commitment)
		).blockhash;
		const txSerialize = tx.serialize({
			requireAllSignatures: false,
		});
		const message = bs58.encode(txSerialize);

		const sig = await backgroundClient.request({
			method: UI_RPC_METHOD_SOLANA_SIGN_AND_SEND_TRANSACTION,
			params: [message, walletPublicKey!.toString()],
		});

		return sig;
	}
}

export type SolanaContext = {
	walletPublicKey: PublicKey;
	connection: Connection;
	tokenInterface: TokenInterface;
	registry: Map<string, TokenInfo>;
	commitment: Commitment;
	backgroundClient: BackgroundClient;
};

export type TransferSolRequest = {
	// SOL address.
	source: PublicKey;
	// SOL address.
	destination: PublicKey;
	amount: number;
};

export type TransferTokenRequest = {
	// SOL address.
	destination: PublicKey;
	mint: PublicKey;
	programId: PublicKey;
	amount: number;
	decimals?: number;
	// Source token addess. If not provided, an ATA will
	// be derived from the wallet.
	source?: PublicKey;
};
