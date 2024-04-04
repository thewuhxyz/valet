<script lang="ts">
	import { page } from "$app/stores";
	import Button from "$lib/components/ui/button/button.svelte";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import TransferTokenForm from "$lib/components/valet-ui/send/TransferTokenForm.svelte";
	import TokenBar from "$lib/components/valet-ui/token/TokenBar.svelte";
	import TokenHero from "$lib/components/valet-ui/token/TokenHero.svelte";
	import { getActiveWallet, getTokens } from "$lib/stores/index.js";
	import { Cross1 } from "radix-icons-svelte";

	let {
		params: { token: tokenAddress },
	} = $page;

	$: ({ balances } = getActiveWallet());
	// $: ({ balances } = getTokens());
	$: token = $balances && $balances.get(tokenAddress);
</script>

<div class="w-full min-h-scree flex-1 text-center flex flex-col items-center">
	<TokenHero {tokenAddress} />
	{#if $balances && token}
		<TransferTokenForm {tokenAddress} wallet={undefined} />
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
	<div>Footer</div>
</div>
