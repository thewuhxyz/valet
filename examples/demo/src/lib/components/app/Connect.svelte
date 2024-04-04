<script lang="ts">
	import { WalletMultiButton } from "@svelte-on-solana/wallet-adapter-ui"
	import SignInButton from "$lib/components/app/SignInButton.svelte"
	import SignOutButton from "$lib/components/app/SignOutButton.svelte"
	import Separator from "$lib/components/ui/separator/separator.svelte"
	import { walletStore } from "@svelte-on-solana/wallet-adapter-core"
</script>

<div class="flex flex-col justify-center items-center text-center space-y-8">
	<div class="flex flex-col w-full space-y-4 items-center">
		{#if !$walletStore.connected}
			<p class="text-xl">Connect wallet to open app</p>
		{/if}
		<div>
			<WalletMultiButton />
		</div>
	</div>
	<Separator class="bg-primary/40" />
	<div class="flex flex-col space-y-4">
		<p class="opacity-80">No Wallet?</p>
		<div class="w-full flex flex-col space-y-3">
			<SignOutButton />
			<SignInButton />
		</div>
		<p class="text-sm">Sign in with Google ⇢ Select Wallet ⇢ ValetOTA</p>
	</div>
</div>
