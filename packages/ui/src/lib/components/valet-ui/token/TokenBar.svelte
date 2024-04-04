<script lang="ts">
	import { getActiveWallet } from "$lib/stores/index.js";
	import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";

	export let tokenAddress: string;

	$: ({ balances, solBalance } = getActiveWallet());
	$: token = $balances && $balances.get(tokenAddress);
</script>

<div class="flex items-center justify-between p-2 max-w-3xl w-full">
	<div class="flex w-full">
		<slot name="left" />
	</div>

	<div class="w-full max-w-sm text-center">
		{#if $balances}
			{#if token}
				<p class="text-lg">{token.ticker}</p>
				{#if $solBalance}
					<p class="w-full text-xs w-sm">{$solBalance.displayBalance} SOL</p>
				{:else}
					<p class="text-xs">{token.name}</p>
				{/if}
			{:else}
				<p class="text-lg">Token Not Found</p>
			{/if}
		{:else}
			<Skeleton class="w-12" />
			<Skeleton class="w-16" />
		{/if}
	</div>

	<div class="flex justify-end w-full">
		<slot name="right" />
	</div>
</div>
