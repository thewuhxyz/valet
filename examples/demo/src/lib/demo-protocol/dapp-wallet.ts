import { Wallet } from "@coral-xyz/anchor"
import { Keypair } from "@solana/web3.js"
import { decode } from "bs58"
import { DAPP_WALLET_SECRETKEY } from "$env/static/private"

export const dappWallet = new Wallet(
	Keypair.fromSecretKey(decode(DAPP_WALLET_SECRETKEY))
)
