<script lang="ts">
	import { page } from "$app/stores"
	import { TransferTokenForm, TokenHero, getActiveWallet } from "@valet/ui"
	import { wallet } from "$lib/stores"

	$: ({
		params: { token: tokenAddress },
	} = $page)
	$: ({ balances } = getActiveWallet())
	$: token = $balances && $balances.get(tokenAddress)
</script>

<div class="w-full min-h-scree flex-1 text-center flex flex-col items-center">
	<TokenHero {tokenAddress} />
	{#if $balances && token}
		<TransferTokenForm {tokenAddress} wallet={$wallet} />
	{/if}
	<div class="flex-1 flex w-full h-full items-center justify-center flex-col">
		{#if $balances && token}
			<h1 class="text-xl">
				{token.ticker}
			</h1>
			<p class="text-base">Show Recent Transaction for {token.ticker}</p>
		{:else if $balances && !token}
			<p class="text-base">Could not find token: {tokenAddress}</p>
		{:else}
			<p class="text-base">Loading...</p>
		{/if}
	</div>
</div>
