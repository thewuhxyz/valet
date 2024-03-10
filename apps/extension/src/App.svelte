<script lang="ts">
	import { keyringStoreState } from "$lib/stores/state-store";
	import { KeyringStoreState } from "@valet/lib";
	import Unlocked from "./routes/Unlocked.svelte";
	import Locked from "./routes/Locked.svelte";
	import Setup from "./routes/Setup.svelte";
</script>

<main>
	{#if $keyringStoreState === KeyringStoreState.Unlocked}
		<Unlocked />
	{:else if $keyringStoreState === KeyringStoreState.Locked}
		<Locked />
	{:else}
		<Setup />
	{/if}
</main>
