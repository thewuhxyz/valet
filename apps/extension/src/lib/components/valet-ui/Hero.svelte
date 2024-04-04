<script lang="ts">
	import { walletStore } from "$lib/stores";
	import UserAvatar from "./UserAvatar.svelte";

	$: ({ user } = walletStore);

	let twClass: string = "";
	export { twClass as class };

	export let signing: boolean = false
</script>

<div class={`flex flex-col ${twClass}`}>
	<div class="flex flex-col justify-center items-center min-h-16 pt-8">
		<img src="/valet-hero-logo-white.svg" alt="valet-hero-logo-white" />
		<p>The First Social Wallet on Solana</p>
	</div>

	<div class={"flex-1 flex flex-col justify-center items-center"}>
		{#if $user}
			<div class="flex items-center pt-2">
				<UserAvatar class="mr-2" />
				<div class="flex-1">
					<p class="text-xl">{$user.name}</p>
				</div>
			</div>
			<p class="text-xs p-2">At your service</p>
		{:else}
			<p class="text-xl italic tracking-wider">At Your Service</p>
			<p class="">{signing ? "signing in..." : "sign in to continue"}</p>
		{/if}
	</div>
</div>
