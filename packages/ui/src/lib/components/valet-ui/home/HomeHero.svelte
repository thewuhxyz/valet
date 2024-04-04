<script lang="ts">
	import { getActiveWallet } from "$lib/stores/context.js";
	import HeroWithSol from "../generic/HeroWithSol.svelte";

	$: ({ balances } = getActiveWallet());

	$: totalInUsd = $balances
		? Array.from($balances.values())
				.map((i) => i.usdBalance)
				.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
		: 0;
</script>

<HeroWithSol>
	<p slot="main" class="text-3xl">
		${$balances ? totalInUsd.toFixed(2) : "0.00"}
	</p>
</HeroWithSol>
