// ✅ - Setup OtaDappServer client
import "server-only"

import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { Keypair } from "@solana/web3.js";
import { OtaDappServer } from "@valet/ota";
import { cookies } from "next/headers";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

const dappKeypair = Keypair.fromSecretKey(
	bs58.decode(process.env.DAPP_WALLET_SECRETKEY!)
);

const dappWallet = new NodeWallet(dappKeypair);

export const otaDappServer = new OtaDappServer(
	process.env.VALET_PROJECT_ID!,
	process.env.VALET_PROJECT_SECRET!,
	{
		wallet: dappWallet,
		cookie: {
			get: (key) => cookies().get(key)?.value,
			set: (key, value, options) => {
				cookies().set(key, value, options);
			},
			remove: (key, options) => {
				cookies().delete(key);
			},
		},
		clearCookieOnDisconect: false,
	}
);
