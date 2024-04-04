<script lang="ts">
	import { walletStore } from "$lib/stores/wallet-store";
	import { KeyringStoreState } from "@valet/background";
	import Unlocked from "./router/Unlocked.svelte";
	import Locked from "./router/Locked.svelte";
	import Setup from "./router/Setup.svelte";
	import PageContainer from "$lib/components/valet-ui/PageContainer.svelte";
	import { TokenProvider } from "@valet/ui";
	import { Toaster } from "$lib/components/ui/sonner"

	$: walletStore.init();
	$: ({ state } = walletStore);
</script>

<main>
	<TokenProvider activeWallet={walletStore}>
		<PageContainer>
			{#if $state}
				{#if $state === KeyringStoreState.Unlocked}
					<Unlocked />
				{:else if $state === KeyringStoreState.Locked}
					<Locked />
				{:else}
					<Setup />
				{/if}
			{:else}
				Loading...
			{/if}
		</PageContainer>
	</TokenProvider>
	<Toaster />
</main>
