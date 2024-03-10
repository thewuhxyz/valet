<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import ActionButtonArea from "$lib/components/valet-ui/ActionButtonArea.svelte";
	import PageContainer from "$lib/components/valet-ui/PageContainer.svelte";
	import TokenHeader from "$lib/components/valet-ui/token/TokenHeader.svelte";
	import { truncate } from "$lib/helpers";
	import { ftToBalancesMap } from "$lib/stores";
	export let params: { id: string };

	const token = $ftToBalancesMap.get(params.id);
</script>

<PageContainer>
	{#if token}
		<TokenHeader {token} />

		<div
			class="flex-1-y-scroll items-center justify-center flex flex-col w-full"
		>
			<p class="text-lg">{truncate(params.id)}</p>
			Recent Transactions
		</div>
		<ActionButtonArea>
			<Button class="cta-btn" href={`#/token/${params.id}/send`}>Send</Button>
		</ActionButtonArea>
	{:else}
		<div
			class="flex-1-y-scroll items-center justify-center flex flex-col w-full"
		>
			<p class="text-lg">{truncate(params.id)}</p>
			Cannot Find Token
			<Button href="#/">Back to Home</Button>
		</div>
	{/if}
</PageContainer>
