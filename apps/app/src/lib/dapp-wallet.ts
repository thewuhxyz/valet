import { Wallet } from "@coral-xyz/anchor"
import { Keypair } from "@solana/web3.js"
import bs58 from "bs58"
import { DAPP_WALLET_SECRETKEY } from "$env/static/private"

export const dappWallet = new Wallet(
	Keypair.fromSecretKey(bs58.decode(DAPP_WALLET_SECRETKEY))
)
