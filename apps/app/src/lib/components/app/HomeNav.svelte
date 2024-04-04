<script>
	import { page } from "$app/stores"
</script>

<nav class="flex justify-center items-center p-2 gap-12 text-base">
	<a
		href="/wallet/home/token"
		class={`
		hover:text-foreground/80 
			${
				$page.url.pathname === "/wallet/home/token"
					? "text-foreground"
					: "text-foreground/60"
			}
		`}
	>
		Tokens
	</a>
	<p class="cursor-pointer text-foreground/60">NFTs 🔒</p>
	<p class="cursor-pointer text-foreground/60">Friends 🔒</p>
	<p class="cursor-pointer text-foreground/60">Recent Transactions 🔒</p>
</nav>
