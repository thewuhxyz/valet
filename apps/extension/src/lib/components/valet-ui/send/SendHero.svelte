<script lang="ts">
	import Separator from "$lib/components/ui/separator/separator.svelte";

	export let amount = "32.06";
	export let amountInUsd = "3.09584";
	export let token = "SOL";
</script>

<Separator class="my-2 bg-primary" />
<div class=" bg-primary text-secondary text-center p-1">
	<p class="text-3xl">{amount} <span class="text-base">{token}</span></p>
	<p class="">${amountInUsd}</p>
</div>
<Separator class="my-2 bg-primary" />
