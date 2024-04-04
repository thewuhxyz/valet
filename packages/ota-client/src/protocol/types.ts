import { PublicKey, TransactionInstruction, AccountMeta, Cluster } from "@solana/web3.js"

export type ClusterWithLocalnet = Cluster | "localnet"

export type ValetUserContext = {
	walletAccount: PublicKey
	walletDelegate: PublicKey
	walletSigner: PublicKey
}

export type ValetUserKeys = {
	publicKey: string
	accountKey: string
}

export enum Provider {
	Google = "google",
	Twitter = "twitter",
	Discord = "discord",
}

export type ValetUser = {
	providerId: string
	provider: Provider
}

export type PreparedInstructionData = {
	instructions: TransactionInstruction[]
	feePayer: PublicKey
	modified: boolean
}
