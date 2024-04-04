<script lang="ts">
	import "../app.pcss"
	import {
		WalletMultiButton,
		WalletProvider,
	} from "@svelte-on-solana/wallet-adapter-ui"
	import { walletStore } from "@svelte-on-solana/wallet-adapter-core"
	import { ValetOtaWalletAdapter } from "@valet/ota-adapter"
	import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets"
	import { AppBar, TokenProvider } from "@valet/ui"
	import { activeWallet, refresh } from "$lib/app"
	import { userStore } from "$lib/stores"
	import type { LayoutData } from "./$types"
	import { goto } from "$app/navigation"
	import { Connect } from "$lib/components/app"
	import { RPC_DEVNET_ENDPOINT } from "@valet/lib"

	export let data: LayoutData

	$: ({ user } = data)
	$: userStore.set(user)

	const localStorageKey = "walletAdapter"

	const wallets = [
		new PhantomWalletAdapter(),
		new ValetOtaWalletAdapter({ connectionUrl: RPC_DEVNET_ENDPOINT }),
	]

	$: $walletStore.adapter?.on("disconnect", () => goto("/"))

	let refreshId: NodeJS.Timeout | undefined = undefined

	const startRefresh = () => {
		refreshId = setInterval(refresh, 60 * 1000)
	}

	const stopRefresh = () => {
		if (refreshId) {
			clearInterval(refreshId)
		}
		refreshId = undefined
	}

	activeWallet.init()

	$: publicKey = $walletStore.connected && $walletStore.publicKey

	$: publicKey
		? activeWallet.updateActiveWallet(publicKey.toBase58())
		: activeWallet.updateActiveWallet(undefined)

	$: publicKey ? startRefresh() : stopRefresh()
</script>

<WalletProvider autoConnect {localStorageKey} {wallets} />
<TokenProvider {activeWallet}>
	<div class="w-full flex flex-col items-center min-h-screen p-2">
		<AppBar>
			<WalletMultiButton slot="right" />
		</AppBar>
		{#if publicKey}
			<slot />
		{:else}
			<div class="flex-1 flex flex-col items-center justify-center space-y-8">
				<div class="text-right italic w-[360px]">
					<img
						src="/valet-hero-logo-white.svg"
						alt="valet-hero-logo-white"
						width="360"
					/>
					<p class="text-lg pr-4">Wallet App</p>
				</div>
				<Connect />
			</div>
		{/if}
	</div>
</TokenProvider>
