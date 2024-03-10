<script lang="ts">
	import { mnemonicStore } from "$lib/stores/mnemonic-store";
	import ExistingUser from "./ExistingUser.svelte";
	import NewUser from "./NewUser.svelte";
</script>


{#if $mnemonicStore}
	<ExistingUser />
{:else}
	<NewUser />
{/if}
