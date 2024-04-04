<script lang="ts">
	import { FTList, type TokenDataWithPrice } from "@valet/ui"

	const href = (token: TokenDataWithPrice) => `/wallet/token/${token.address}`
</script>

<FTList {href} class="w-full" />
