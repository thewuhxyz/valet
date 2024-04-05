<script lang="ts">
	import { getActiveWallet } from "$lib/stores/context.js";
	import Hero from "./Hero.svelte";

	$: ({ solBalance } = getActiveWallet());
	$: solAmount = $solBalance ? $solBalance.displayBalance : "-";
</script>

<Hero>
	<slot slot="main" name="main" />
	<p slot="sub" class="text-sm">◎ {solAmount}</p>
</Hero>
