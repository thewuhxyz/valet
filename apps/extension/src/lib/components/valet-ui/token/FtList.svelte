<script lang=ts>
	import { ftToBalancesMap } from "$lib/stores/token";
	import FtCard from "./FtCard.svelte";

	const tokens = Array.from($ftToBalancesMap.values()).map((token) => {
		return token
	})
</script>

<div>
	{#each tokens as token}
		<FtCard {token} />
	{/each}
</div>
