<script lang="ts">
	import type { TokenData, TokenDataWithPrice } from "$lib/types";
	import TokenBar from "./TokenBar.svelte";
	import TokenHero from "./TokenHero.svelte";

	export let token: TokenDataWithPrice;

</script>

<div class="w-full">
	<TokenBar {token} />
	<TokenHero {token} />
</div>
