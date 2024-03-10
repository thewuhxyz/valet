<script lang="ts">
	import SendBar from "./SendBar.svelte";
	import SendHero from "./SendHero.svelte";

	export let token = "USDC";
	export let solAmount = "3.09584";
	export let amount = "32.06";
	export let amountInUsd = "32.06";
</script>

<div class="w-full">
	<SendBar {token} {solAmount} />
	<SendHero {amount} {token} {amountInUsd} />
</div>
