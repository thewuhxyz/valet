<script lang="ts">
	import * as Avatar from "$lib/components/ui/avatar";
	import { link } from "svelte-spa-router";
	import type { TokenDataWithPrice } from "$lib/types";
	export let token: TokenDataWithPrice;
</script>

<a href={`/token/${token.address}`} use:link>
	<div class="flex items-center card-default rounded-lg px-4 p-1 my-4 m-2">
		<Avatar.Root class="mr-4">
			<Avatar.Image src={token.logo} />
			<Avatar.Fallback class="hover:cursor-default text-primary text-lg"
				>{token.ticker[0]}</Avatar.Fallback
			>
		</Avatar.Root>
		<div class="flex-1">
			<div class="flex justify-between items-center">
				<p class="text-lg">
					{token.ticker}
					<span class="text-xs">
						- ${token.priceData ? token.priceData.usd : "-"}
					</span>
				</p>
				<p class="text-base">${token.usdBalance.toFixed(2)}</p>
			</div>
			<p class="text-base">{Number(token.displayBalance).toFixed(2)}</p>
		</div>
	</div>
</a>
