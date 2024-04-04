<script lang="ts">
	import type { SolanaWallet } from "@valet/token";
	import TransferTokenButton from "./TransferTokenButton.svelte";
	import Input from "$lib/components/ui/input/input.svelte";
	import Label from "$lib/components/ui/label/label.svelte";
	import { truncate } from "$lib/helpers.js";

	export let wallet: SolanaWallet | undefined
	export let tokenAddress: string;
	let recipient: string = "";
	let amount: string = "";
</script>

<div class="flex flex-col w-full max-w-3xl">
		<Label for="recipient" class="w-full my-2">
			Recipient Address
			<Input
				class="my-2 focus:border-primary"
				name="recipient"
				type="text"
				placeholder={`${truncate(tokenAddress)}`}
				bind:value={recipient}
			/>
		</Label>
		<Label for="amount" class="w-full my-2">
			Amount
			<Input
				class="my-2 focus:border-primary"
				name="amount"
				type="text"
				placeholder="0.00"
				bind:value={amount}
			/>
		</Label>

		<TransferTokenButton
			class="w-full"
			type="button"
			{wallet}
			{tokenAddress}
			{recipient}
			{amount}
		/>
</div>
