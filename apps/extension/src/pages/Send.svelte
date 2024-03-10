<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import PageContainer from "$lib/components/valet-ui/PageContainer.svelte";
	import SendForm from "$lib/components/valet-ui/send/SendForm.svelte";
	import TokenHeader from "$lib/components/valet-ui/token/TokenHeader.svelte";
	import { ftToBalancesMap } from "$lib/stores";
	import { transfer } from "$lib/stores/anchor-store";

	export let params: { id: string };

	const cluster = "mainnet-beta";
	const fee = "0.0000014";
	const feeInSol = "0.00004234";

	const tokenAddress = params.id;

	const token = $ftToBalancesMap.get(tokenAddress);

	const handleSubmit = async (recipient: string, amount: number) => {
		try {
			await transfer(token!, recipient, amount);
		} catch {}
	};
</script>

<PageContainer>
	{#if token}
		<TokenHeader {token} />

		<div class="flex-1-y-scroll flex flex-col w-full">
			<SendForm
				{cluster}
				{fee}
				{feeInSol}
				{handleSubmit}
				tokenName={token.ticker}
			/>
		</div>
	{:else}
		<div
			class="flex-1-y-scroll items-center justify-center flex flex-col w-full"
		>
			<p class="text-lg">{params.id}</p>
			Cannot Find Token
			<Button href="#/">Back to Home</Button>
		</div>
	{/if}
</PageContainer>
