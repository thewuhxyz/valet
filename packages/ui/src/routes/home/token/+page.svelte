<script lang="ts">
	import FtList from "$lib/components/valet-ui/token/FtList.svelte";
	import type { TokenDataWithPrice } from "$lib/types.js";

	const href = (token: TokenDataWithPrice) => `/token/${token.address}`;
</script>

<FtList {href} />
