<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import Separator from "$lib/components/ui/separator/separator.svelte";
	import { truncate } from "$lib/helpers";
	import ActionButtonArea from "../ActionButtonArea.svelte";

	export let cluster: string;
	export let recipient: string;
	export let amount: number;
	export let fee: string;
	export let feeInSol: string;
	export let tokenName: string;
	export let handleSubmit: (recipient: string, amount: number) => void;
	export let cancel: () => void;
</script>

<div class="flex-1-y-scroll text-base flex flex-col w-full">
	<div class="flex-1-y-scroll flex flex-col justify-center">
		<div class="">
			<div class="flex justify-between">
				<p>Recipient</p>
				<p>{truncate(recipient)}</p>
			</div>
			<Separator class="bg-primary my-1" />
			<div class="flex justify-between">
				<div>Amount</div>
				<div>{amount} {tokenName}</div>
			</div>
			<Separator class="bg-primary my-1" />
			<div class="flex justify-between">
				<p>Cluster</p>
				<p>{cluster}</p>
			</div>
			<Separator class="bg-primary my-1" />
			<div class="flex justify-between">
				<p>Network Fee</p>
				<p>${fee}</p>
			</div>
			<Separator class="bg-primary my-1" />
			<div class="flex justify-between">
				<p>Fee in SOL</p>
				<p>{feeInSol} SOL</p>
			</div>
		</div>
	</div>
	<ActionButtonArea>
		<Button type="submit" class="cta-btn" on:click={() => handleSubmit}
			>Send Transaction</Button
		>
		<Button class="cta-btn" variant="secondary" on:click={cancel}>
			Back
		</Button>
	</ActionButtonArea>
</div>
