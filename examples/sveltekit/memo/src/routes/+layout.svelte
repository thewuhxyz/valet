<script lang="ts">
	import "../app.pcss"
	import { WalletProvider } from "@svelte-on-solana/wallet-adapter-ui"
	import { clusterApiUrl } from "@solana/web3.js"
	import { ValetOtaWalletAdapter } from "@valet/ota-adapter"
	import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets"
	import AnchorProvider from "$lib/demo-protocol/AnchorProvider.svelte"
	import { userStore } from "$lib/stores"
	import type { LayoutData } from "./$types"
	import { Toaster } from "$lib/components/ui/sonner"

	export let data: LayoutData

	$: ({ user } = data)
	$: userStore.set(user)

	const localStorageKey = "walletAdapter"
	const network = "http://localhost:8899"

	const wallets = [
		new PhantomWalletAdapter(),
		new ValetOtaWalletAdapter({ connectionUrl: network }),
	]
</script>

<WalletProvider {localStorageKey} {wallets} />
<AnchorProvider {network} />
<slot />
<Toaster />
