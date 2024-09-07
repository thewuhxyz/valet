<script lang="ts">
	import type { Cluster } from "@solana/web3.js";
	import { buttonVariants } from "../ui/button";
	import { cn } from "$lib/utils";

	export let tx: string;
	export let cluster: Cluster | "custom";

	const explorer = `https://explorer.solana.com/tx/${tx}?cluster=${cluster}`;
</script>

<a href={explorer} class={cn(buttonVariants({ size: "sm" }))}> See Explorer </a>
