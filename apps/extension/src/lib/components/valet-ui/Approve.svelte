<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import ActionButtonArea from "./ActionButtonArea.svelte";

	let twClass: string = "";
	export { twClass as class };

	export let buttonText: string = "Approve";
	export let subject: string;
	export let handleApprove: () => void;
	export let handleCancel: () => void;
</script>

<div class={`flex flex-col w-full text-center ${twClass}`}>
	<div class="flex flex-col items-center">
		<img
			src="/valet-hero-logo-white.svg"
			alt="valet-hero-logo-white"
			width="128"
		/>
		<p>The First Social Wallet on Solana</p>
		<div class="p-4">
			<h1 class="text-lg">{subject}</h1>
		</div>
	</div>
	<div class="flex-1 flex flex-col items-center justify-center text-center">
		<slot />
	</div>
	<ActionButtonArea>
		<Button on:click={handleApprove} class="cta-btn">{buttonText}</Button>
		<Button on:click={handleCancel} class="cta-btn" variant="destructive">
			Cancel
		</Button>
	</ActionButtonArea>
</div>
