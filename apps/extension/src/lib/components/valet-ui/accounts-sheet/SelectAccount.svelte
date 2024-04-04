<script lang="ts">
	import { BackgroundRequest } from "$lib/background-client"
	import { walletStore } from "$lib/stores"
	import { toast } from "svelte-sonner"
	import Account from "./Account.svelte"

	$: ({ allKeysNoOta, delegate, activeWallet, isOta } = walletStore)
	$: current = $isOta ? $delegate : $activeWallet

	$: keys = $allKeysNoOta

	async function updateWallet(wallet: string) {
		if (wallet === current) return
		try {
			$isOta
				? await BackgroundRequest.updateDelegateWallet(wallet)
				: await BackgroundRequest.updateActiveWallet(wallet)
		} catch (e: any) {
			console.error("error switching ota:", e)
			toast(`❌ Error switching to/from OTA. ${e.message ?? e}`)
		}
	}
</script>

{#if keys}
	<div class="flex items-center flex-col">
		{#each Array.from(keys.entries()) as account}
			<Account
				on:click={() => updateWallet(account[0])}
				selected={$isOta
					? $delegate === account[0]
					: $activeWallet === account[0]}
				{account}
			/>
		{/each}
	</div>
{/if}
