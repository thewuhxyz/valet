<script lang="ts">
	import AccountsSheet from "$lib/components/valet-ui/accounts-sheet/AccountsSheet.svelte";
	import ProfileSheet from "$lib/components/valet-ui/profile-sheet/ProfileSheet.svelte";
	import { truncate } from "$lib/helpers";
	import { walletStore } from "$lib/stores";
	import { TitleBar } from "@valet/ui";

	$: ({ activeWalletWithName } = walletStore);

	$: publicKey = $activeWalletWithName ? $activeWalletWithName[0] : "";
	$: name = $activeWalletWithName ? $activeWalletWithName[1] : "...";
</script>

<TitleBar>
	<div class="flex justify-end" slot=left>
		<ProfileSheet />
	</div>
	<div slot="main" class="flex-1 text-center">
		<p class="text-lg">{name}</p>
		<p class="">{truncate(publicKey)}</p>
	</div>
	<div class="flex justify-end" slot=right>
		<AccountsSheet />
	</div>
</TitleBar>
