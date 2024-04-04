<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import { TitleBar, getActiveWallet } from "@valet/ui";
	import { ArrowLeft } from "radix-icons-svelte";
	import { pop } from "svelte-spa-router";

	export let tokenAddress: string;
	$: ({ balances } = getActiveWallet());
	$: token = $balances && $balances.get(tokenAddress);
</script>

<TitleBar>
	<div slot="left" class="">
		<Button variant="ghost" size="icon" on:click={pop}>
			<ArrowLeft />
		</Button>
	</div>
	<div slot="main" class="flex-1 text-center">
		<p class="text-lg">{token ? token.ticker : "..."}</p>
		<p class="">{token ? token.name : ""}</p>
	</div>
</TitleBar>
