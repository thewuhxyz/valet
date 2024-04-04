<script lang="ts">
	import { goto } from "$app/navigation"
	import Button from "$lib/components/ui/button/button.svelte"
	import { walletStore } from "@svelte-on-solana/wallet-adapter-core"

	$walletStore.adapter?.on("connect", () => "/wallet")

	$: publicKey = $walletStore.connected && $walletStore.publicKey

	$: publicKey && goto("/wallet")
</script>

<div class="flex-1 flex flex-col items-center justify-center space-y-8">
	<Button href="/wallet">Launch App</Button>
</div>
