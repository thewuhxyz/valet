<script lang="ts">
	import type { TokenDataWithPrice } from "$lib/types.js";
	import WithHref from "../generic/WithHref.svelte";
	import FtCardBase from "./FtCardBase.svelte";
	export let token: TokenDataWithPrice;
	export let href: (token: TokenDataWithPrice) => string;
</script>

<WithHref class="w-full" href={href(token)}>
	<FtCardBase {token} />
</WithHref>
