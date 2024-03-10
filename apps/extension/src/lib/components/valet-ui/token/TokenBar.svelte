<script lang="ts">
	import { buttonVariants } from "$lib/components/ui/button";
	import Button from "$lib/components/ui/button/button.svelte";
	import type { TokenDataWithPrice } from "$lib/types";
	import { Cross1 } from "radix-icons-svelte";
	import { link } from "svelte-spa-router";

	export let token: TokenDataWithPrice;
</script>

<div class="flex items-center">
	<a
		class={buttonVariants({ variant: "ghost", size: "icon" })}
		href="/"
		use:link
	>
		<Cross1 />
	</a>
	<div class="flex-1 text-center">
		<p class="text-lg">{token.ticker}</p>
		<p class="">{token.name}</p>
	</div>
	<!-- This is for visual balance. Doesn't do anything  -->
	<Button variant="ghost" class="collapse" size="icon" />
</div>
