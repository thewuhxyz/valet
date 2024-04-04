<script lang="ts">
	import PageContainer from "$lib/components/valet-ui/PageContainer.svelte";
	import { walletStore } from "$lib/stores";
	import { KeyringStoreState } from "@valet/background";
	import Unlock from "./Unlock.svelte";
	import Approve from "$lib/components/valet-ui/Approve.svelte";

	export let handleApprove: () => Promise<void>;
	export let handleCancel: () => Promise<void>;
	export let buttonText: string;
	export let subject: string;

	$: ({ state } = walletStore);
</script>

{#if $state}
	{#if $state === KeyringStoreState.Locked}
		<Unlock />
	{:else if $state === KeyringStoreState.Unlocked}
		<Approve
			class="flex-1"
			{handleApprove}
			{handleCancel}
			{buttonText}
			{subject}
		>
			<slot />
		</Approve>
	{:else}
		Not Allowed
	{/if}
	{:else}
	Loading...
{/if}
