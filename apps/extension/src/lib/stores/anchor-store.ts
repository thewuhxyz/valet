import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import {
	TokenInterface,
	type SolanaContext,
	getBackgroundClient,
	SolanaSplConnection,
	SOL_NATIVE_MINT,
  RPC_LOCALNET_ENDPOINT,
  TOKEN_PROGRAM_ID,
} from "@valet/lib";
import { derived, get } from "svelte/store";
import { AnchorProvider} from "@coral-xyz/anchor";
import { activeWalletStore, tokenMintMap, tokenRegistry } from ".";
import type { TokenDataWithPrice } from "$lib/types";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

const dummyKeypair = Keypair.generate();
const wallet = new NodeWallet(dummyKeypair);
const connection = new Connection(RPC_LOCALNET_ENDPOINT); // todo: make this dynamic
const provider = new AnchorProvider(connection, wallet, {
	skipPreflight: false,
});
const tokenInterface = new TokenInterface(provider); // * for sending, not signing

const solanaContext = derived(
	[activeWalletStore, tokenRegistry],
	([activeWallet, tokenRegistry]) => {
		if (!activeWallet || !tokenRegistry) return;
		return {
			walletPublicKey: new PublicKey(activeWallet),
			backgroundClient: getBackgroundClient(),
			commitment: connection.commitment,
			connection,
			registry: tokenRegistry,
			tokenInterface,
		} as SolanaContext;
	}
);

export async function transfer(
	token: TokenDataWithPrice,
	destinationAddress: string,
	amount: number
) {
	const solanaCtx = get(solanaContext);
	if (!solanaCtx)
		throw new Error("Active wallet or token registry is not defined");

	const mintMap = get(tokenMintMap);
	if (!mintMap) throw new Error("Token mint map is undefined");

	const mintInfo = mintMap.get(token.mint);

	if (token.mint === SOL_NATIVE_MINT.toString()) {
		return await SolanaSplConnection.transferSol(solanaCtx, {
			source: solanaCtx.walletPublicKey,
			destination: new PublicKey(destinationAddress),
			amount: amount,
		});
	}

	return await SolanaSplConnection.transferToken(solanaCtx, {
		destination: new PublicKey(destinationAddress),
		mint: new PublicKey(token.mint),
		programId: new PublicKey(mintInfo ? mintInfo.programId : TOKEN_PROGRAM_ID),
		amount: amount,
		decimals: token.decimals,
	});
}
