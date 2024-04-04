import { Connection } from "@solana/web3.js"
import { AnchorProvider, Wallet } from "@coral-xyz/anchor"
import { OtaServerClient } from "./client"
import { RPC_DEVNET_ENDPOINT } from "packages/lib/dist/esm"

const secretKey = process.env.VALET_DELEGATE_SECRET!
const valetDelegate = OtaServerClient.keypairFromString(secretKey)

console.log("Valet Delegate:", valetDelegate.publicKey.toBase58())

const endpoint = RPC_DEVNET_ENDPOINT

const connection = new Connection(endpoint, {
	commitment: "processed",
})

const anchorProvider = new AnchorProvider(
	connection,
	new Wallet(valetDelegate),
	{ commitment: "processed", preflightCommitment: "processed" }
)

export const otaServerClient = new OtaServerClient(anchorProvider, "devnet")
