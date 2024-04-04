<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte"
	import TokenBar from "$lib/components/valet-ui/token/TokenBar.svelte"
	import { walletStore } from "$lib/stores"
	import { TokenHero, TransferTokenForm } from "@valet/ui"

	export let params: { id: string }

	const tokenAddress = params.id
	$: ({ wallet, tokens } = walletStore)
	$: ({ balances } = tokens)
	$: token = $balances && $balances.get(tokenAddress)
</script>

{#if token}
	<TokenBar {tokenAddress} />
	<TokenHero {tokenAddress} />

	<div class="flex-1-y-scroll items-center flex flex-col w-full">
		<TransferTokenForm {tokenAddress} wallet={$wallet} />
	</div>
{:else}
	<div class="flex-1-y-scroll items-center justify-center flex flex-col w-full">
		<p class="text-lg">{params.id}</p>
		Cannot Find Token
		<Button href="#/">Back to Home</Button>
	</div>
{/if}
