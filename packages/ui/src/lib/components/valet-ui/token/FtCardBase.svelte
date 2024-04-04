<script lang="ts">
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import type { TokenDataWithPrice } from "$lib/types.js";
	export let token: TokenDataWithPrice;
	
	let cardDefault = "border bg-accent border-opacity-30 text-primary border-primary hover:bg-primary hover:text-secondary hover:opacity-90"
	let className: string = "";
	export { className as class };

</script>

<div
	class={`flex items-center w-full ${cardDefault} rounded-lg px-4 p-1 ${className} `}
>
	<Avatar.Root class="mr-4">
		<Avatar.Image src={token.logo} />
		<Avatar.Fallback class="hover:cursor-default text-primary text-lg"
			>{"?"}</Avatar.Fallback
		>
	</Avatar.Root>
	<div class="flex-1">
		<div class="flex justify-between items-center">
			<p class="text-lg">
				{token.ticker}
				<span class="text-xs">
					${token.priceData ? token.priceData.usd : "-"}
				</span>
			</p>
			<p class="text-base">${token.usdBalance.toFixed(2)}</p>
		</div>
		<p class="text-base">{token.displayBalance}</p>
	</div>
</div>
