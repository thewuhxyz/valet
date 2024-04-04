<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import Input from "$lib/components/ui/input/input.svelte";
	import Label from "$lib/components/ui/label/label.svelte";
	import ActionButtonArea from "$lib/components/valet-ui/generic/ActionButtonArea.svelte";

  export let recipient:  string;
	export let amount: number;
	export let handleNext: () => void;
	export let cancel: () => void;
</script>

<div class="flex flex-col flex-1-y-scroll w-full">
	<div class="flex-1-y-scroll p-2">
		<Label for="recipient" class="w-full my-2">
      Recipient Address
			<Input
				class="my-2 focus:border-primary"
				name="recipient"
				type="text"
				placeholder="Recipient"
				bind:value={recipient}
			/>
		</Label>
		<Label for="amount" class="w-full my-2">
      Amount
			<Input
				class="my-2 focus:border-primary"
				name="amount"
				type="number"
				placeholder="Amount"
				bind:value={amount}
			/>
		</Label>
	</div>
	<ActionButtonArea>
		<Button class="cta-btn" on:click={handleNext}>Next</Button>
		<Button class="cta-btn" variant="secondary" on:click={cancel}>
			Cancel
		</Button>
	</ActionButtonArea>
</div>
