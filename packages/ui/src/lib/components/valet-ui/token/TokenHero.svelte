<script lang="ts">
	import { getActiveWallet } from "$lib/index.js";
	import HeroWithSol from "../generic/HeroWithSol.svelte";

	export let tokenAddress: string;

	$: ({ balances } = getActiveWallet());
	$: token = $balances && $balances.get(tokenAddress);
</script>

<HeroWithSol>
	<p slot="main" class="text-3xl">
		{token ? token.displayBalance : "-.--"}
		<span class="text-base">{token ? token.ticker : ""}</span>
		<span class="text-sm">
			{token ? `~$${token.usdBalance.toFixed(2)}` : ""}
		</span>
	</p>
</HeroWithSol>
