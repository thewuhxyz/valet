<script lang="ts">
	import { allKeys } from "$lib/stores";
	import Account from "./Account.svelte";
</script>

{#if $allKeys}
	<div class="flex items-center flex-col">
		{#each Array.from($allKeys.entries()) as account}
			<Account {account} />
		{/each}
	</div>
{/if}
