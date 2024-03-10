<script lang="ts">
	import Separator from "$lib/components/ui/separator/separator.svelte";
	import { activeWalletStore } from "$lib/stores";
	import { ftToBalancesMap } from "$lib/stores/token";

	const tokens = $ftToBalancesMap
	let totalInUsd: number = 0
	Array.from(tokens.values()).forEach(({ usdBalance })=> {
		totalInUsd = totalInUsd + usdBalance
	})

	let sol = tokens.get($activeWalletStore!)!
	
	let solAmount = sol.displayBalance

	$: totalInUsd = totalInUsd ? totalInUsd : 0

</script>

<div class="w-full">
	<Separator class="my-2 bg-primary" />
	<div class=" bg-primary text-secondary text-center p-1">
		<p class="text-3xl">${totalInUsd.toFixed(2)}</p>
		<p class="">{parseFloat(solAmount).toFixed(2)} SOL</p>
	</div>
	<Separator class="my-2 bg-primary" />
</div>
