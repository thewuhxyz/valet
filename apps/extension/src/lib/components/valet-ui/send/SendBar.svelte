<script lang="ts">
	import { buttonVariants } from "$lib/components/ui/button";
	import Button from "$lib/components/ui/button/button.svelte";
	import { Cross1 } from "radix-icons-svelte";
	import { link } from "svelte-spa-router";

	export let token = "SOL";
	export let solAmount = "3.495";
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
		<p class="text-lg">{token}</p>
		<p class="">{solAmount} SOL</p>
	</div>
	<!-- This is for visual balance. Doesn't do anything  -->
	<Button variant="ghost" class="collapse" size="icon" />
</div>
