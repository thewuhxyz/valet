<script lang="ts">
	import type { SendTokenFormData } from "$lib/types.js";
	import CollectData from "./CollectData.svelte";
	import ConfirmSend from "./ConfirmSend.svelte";

	let steps = ["collect-data", "send-transaction"];
	let currentStep = 0;

	let formData: SendTokenFormData = {
		amount: 0,
		recipient: ""
	}

	$: formData;

	const handleNext = () => {
		if (currentStep < steps.length - 1) {
			currentStep = currentStep + 1;
		}
	};
	const handlePrev = () => {
		if (currentStep > 0) {
			currentStep = currentStep - 1;
		}
	};

	export let cluster: string;
	export let fee: string;
	export let feeInSol: string;
	export let tokenName: string;
	export let handleSubmit: (recipient: string, amount: number) => Promise<void>;
</script>

<form
	on:submit|preventDefault={() =>
		handleSubmit(formData.recipient, formData.amount)}
	class="flex-1-y-scroll flex flex-col items-center"
>
	{#if steps[currentStep] == "collect-data"}
		<CollectData
			{handleNext}
			cancel={handlePrev}
			bind:recipient={formData.recipient}
			bind:amount={formData.amount}
		/>
	{:else if steps[currentStep] == "send-transaction"}
		<ConfirmSend
			recipient={formData.recipient}
			amount={formData.amount}
			cancel={handlePrev}
			{handleSubmit}
			{fee}
			{feeInSol}
			{tokenName}
			{cluster}
		/>
	{:else}
		something wrong
	{/if}
</form>
