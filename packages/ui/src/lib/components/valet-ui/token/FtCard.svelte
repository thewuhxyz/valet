<script lang="ts">
	import { getActiveWallet } from "$lib/index.js"
	import type { TokenDataWithPrice } from "$lib/types.js"
	import FtCardBase from "./FtCardBase.svelte"
	import FtCardLoading from "./FtCardLoading.svelte"
	import WithHref from "../generic/WithHref.svelte"

	let className = ""
	export { className as class }

	export let href: ((token: TokenDataWithPrice) => string) | undefined =
		undefined

	export let tokenAddress: string

	$: ({ balances } = getActiveWallet())
	$: token = $balances && $balances.get(tokenAddress)
</script>

<div class="w-full max-w-3xl items-center flex flex-col">
	{#if $balances && token}
		{#if href}
			<WithHref class="w-full" href={href(token)}>
				<FtCardBase class={className} {token} />
			</WithHref>
		{:else}
			<FtCardBase class={className} {token} />
		{/if}
	{:else if $balances && !token}
		<p class="text-base text-center">Cannot Find Token</p>
	{:else}
		<FtCardLoading />
	{/if}
</div>
