<script lang="ts">
	import { location, link } from "svelte-spa-router"
</script>

<nav class="flex items-center justify-around space-x-2 p-2 w-full text-base">
	<a
		href="/token"
		use:link
		class={`transition-colors hover:text-foreground/80 
			${$location === "/token" ? "text-foreground" : "text-foreground/60"}
		`}
	>
		Tokens
	</a>
	<p class="cursor-default text-foreground/60">NFTs 🔒</p>
	<p class="cursor-default text-foreground/60">Friends 🔒</p>
	<p class="cursor-default text-foreground/60">Recent Tx 🔒</p>

</nav>
