<script lang="ts">
	import { getActiveWallet, type TokenDataWithPrice } from "$lib/index.js"
	import FtCard from "./FtCard.svelte"
	import FtCardLoading from "./FtCardLoading.svelte"

	let className = ""
	export { className as class }

	export let href: ((token: TokenDataWithPrice) => string) | undefined =
		undefined

	$: ({ balances } = getActiveWallet())
</script>

{#if $balances}
	{#each $balances.values() as token}
		<FtCard class={className} tokenAddress={token.address} {href} />
	{/each}
{:else}
	<div class="space-y-8 flex flex-col w-full ">
		<FtCardLoading />
		<FtCardLoading />
		<FtCardLoading />
		<FtCardLoading />
	</div>
{/if}
