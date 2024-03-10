<script lang="ts">
	import AccountsSheet from "$lib/components/valet-ui/accounts-sheet/AccountsSheet.svelte";
	import ProfileSheet from "$lib/components/valet-ui/profile-sheet/ProfileSheet.svelte";
	import { truncate } from "$lib/helpers";
	import { activeWalletWithName } from "$lib/stores";

	$: publicKey = $activeWalletWithName ? $activeWalletWithName[0] : "";
	$: name = $activeWalletWithName ? $activeWalletWithName[1] : "No Wallet Yet";
</script>

<div class="flex w-full items-center">
	<ProfileSheet />
	<div class="flex-1 text-center">
		<p class="text-lg">{name}</p>
		<p class="">{truncate(publicKey)}</p>
	</div>
	<AccountsSheet />
</div>
