<script lang="ts">
	import PageContainer from "$lib/components/valet-ui/PageContainer.svelte";
	import Hero from "$lib/components/valet-ui/Hero.svelte";
	import EnterPassword from "$lib/components/valet-ui/EnterPassword.svelte";
	import { BackgroundRequest, UiResponse } from "$lib/background-client";
	import { keyringStoreState } from "$lib/stores";
	import { KeyringStoreState } from "@valet/lib";
	import Button from "$lib/components/ui/button/button.svelte";
	import { URLSearchParams } from "url";
	import { querystring } from "svelte-spa-router";

	const search = new URLSearchParams($querystring)

	const requestId = search.get("requestId");
	const origin = search.get("origin");

	let handleUnlock = async (password: string) => {
		await BackgroundRequest.unlock(password);
	};

	let handleApproveOrigin = async () => {
		await UiResponse.approveOrigin(requestId!, true);
	};
</script>

<PageContainer class="flex flex-col">
	{#if $keyringStoreState === KeyringStoreState.Locked}
		<Hero class="flex-1" />
		<p>Unlock to approve origin: {origin}</p>
		<EnterPassword handleSubmit={handleUnlock} />
	{:else if $keyringStoreState === KeyringStoreState.Unlocked}
		<div class="flex-1 flex flex-col items-center justify-center">
			<Button on:click={handleApproveOrigin} class="cta-btn">Approve</Button>
			<Button class="cta-btn" variant="destructive">Cancel</Button>
		</div>
	{:else}
		Not Allowed
	{/if}
</PageContainer>
