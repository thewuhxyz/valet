<script lang="ts">
	import { FTList, type TokenDataWithPrice } from "@valet/ui"
	import Home from "./Home.svelte"
	
	const href = (token: TokenDataWithPrice) => `#/token/${token.address}`
</script>

<Home>
	<FTList class="my-2 w-full" {href} />
</Home>
