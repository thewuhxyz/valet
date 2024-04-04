<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte"
	import ActionButtonArea from "$lib/components/valet-ui/ActionButtonArea.svelte"
	import { TokenHero } from "@valet/ui"
	import { truncate } from "$lib/helpers"
	import { walletStore } from "$lib/stores"
	import TokenBar from "$lib/components/valet-ui/token/TokenBar.svelte"
	export let params: { id: string }

	const tokenAddress = params.id
	$: ({ tokens } = walletStore)
	$: ({ balances } = tokens)
	$: token = $balances && $balances.get(tokenAddress)
</script>

{#if token}
	<TokenBar {tokenAddress} />
	<TokenHero {tokenAddress} />

	<div class="flex-1-y-scroll items-center justify-center flex flex-col w-full">
		<p class="text-lg">{truncate(params.id)}</p>
		Recent Transactions
	</div>
	<ActionButtonArea>
		<Button class="cta-btn" href={`#/token/${params.id}/send`}>Send</Button>
	</ActionButtonArea>
{:else}
	<div class="flex-1-y-scroll items-center justify-center flex flex-col w-full">
		<p class="text-lg">{truncate(params.id)}</p>
		Cannot Find Token
		<Button href="#/">Back to Home</Button>
	</div>
{/if}
