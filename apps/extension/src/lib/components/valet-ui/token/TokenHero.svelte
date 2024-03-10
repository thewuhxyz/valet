<script lang="ts">
	import Separator from "$lib/components/ui/separator/separator.svelte";
	import type { TokenDataWithPrice } from "$lib/types";

	export let token: TokenDataWithPrice;
</script>

<Separator class="my-2 bg-primary" />
<div class=" bg-primary text-secondary text-center p-1">
	<p class="text-3xl">{token.displayBalance} <span class="text-base">{token.ticker}</span></p>
	<p class="">${token.usdBalance}</p>
</div>
<Separator class="my-2 bg-primary" />
