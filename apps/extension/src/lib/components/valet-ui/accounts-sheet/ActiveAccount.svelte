<script lang="ts">
	import { activeWalletWithName } from "$lib/stores";
	import Account from "./Account.svelte";
</script>

{#if $activeWalletWithName}
	<Account account={$activeWalletWithName} selected />
{/if}
