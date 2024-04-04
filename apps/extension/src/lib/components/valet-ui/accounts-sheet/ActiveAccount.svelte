<script lang="ts">
	import { walletStore } from "$lib/stores";
	import Account from "./Account.svelte";

	$: ({ activeWalletWithName } = walletStore);
</script>

{#if $activeWalletWithName}
	<Account class="cursor-default" account={$activeWalletWithName} selected />
{/if}
