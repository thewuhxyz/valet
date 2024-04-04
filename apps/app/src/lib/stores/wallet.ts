import { walletStore } from "@svelte-on-solana/wallet-adapter-core"
import type { SolanaWallet } from "@valet/token"
import { derived } from "svelte/store"

export const wallet = derived(walletStore, (walletStore) => {
	if (!walletStore.connected || !walletStore.publicKey) return
	return {
		publicKey: walletStore.publicKey,
		signTransaction: walletStore.signTransaction!,
		signAllTransactions: walletStore.signAllTransactions!,
	} as SolanaWallet
})
