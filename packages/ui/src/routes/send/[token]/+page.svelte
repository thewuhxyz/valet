<script lang="ts">
	import { page } from "$app/stores";
	import Button from "$lib/components/ui/button/button.svelte";
	import TokenHero from "$lib/components/valet-ui/token/TokenHero.svelte";
	import { getActiveWallet } from "$lib/stores/index.js";

	let {
		params: { token: tokenAddress },
	} = $page;

	$: ({ balances } = getActiveWallet());
	$: token = $balances && $balances.get(tokenAddress);
</script>

<div class="w-full min-h-screen text-center flex flex-col items-center">
	<TokenHero {tokenAddress} />
	{#if $balances && token}
		<Button href={`/send/${token.address}`} class="cta-btn max-w-3xl"
			>Send {token.ticker}</Button
		>
	{/if}
	<div class="flex-1 flex w-full h-full items-center justify-center flex-col">
		{#if $balances && token}
			<h1 class="text-xl">
				++++++++++ {token.ticker} +++++++++
			</h1>
			<p class="text-base">Show Recent Transaction for {token.ticker}</p>
		{:else if $balances && !token}
			<p class="text-base">Could not find token: {tokenAddress}</p>
		{:else}
			<p class="text-base">Loading...</p>
		{/if}
	</div>
	<div>Footer</div>
</div>
