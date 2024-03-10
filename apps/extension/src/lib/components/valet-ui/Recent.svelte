<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import ActionButtonArea from "$lib/components/valet-ui/ActionButtonArea.svelte";
	import { truncate } from "$lib/helpers";
	import { recentTxSignatures } from "$lib/stores";
</script>

{#await $recentTxSignatures}
	<div class="flex-1-y-scroll items-center justify-center flex flex-col w-full">
		Loading
	</div>
{:then txs}
	{#if txs}
		<div class="flex-1-y-scroll justify-center flex flex-col w-full">
			<p class="text-xl">Recent Transactions</p>
			{#each txs as tx}
				<ActionButtonArea>
					<Button
						class="cta-btn"
						variant="link"
						href={`https://solscan.io/tx/${tx}?cluster=devnet`}
					>
						Sig: {truncate(tx)}. Check Solscan
					</Button>
				</ActionButtonArea>
			{/each}
		</div>
	{:else}
		<div
			class="flex-1-y-scroll items-center justify-center flex flex-col w-full"
		>
			<Button href="#/">Back to Home</Button>
		</div>
	{/if}
{/await}
