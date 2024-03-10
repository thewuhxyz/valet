<script lang="ts">
	import { userStore } from "$lib/stores/user-store";
	import { buttonVariants } from "$lib/components/ui/button";
	import UserAvatar from "./UserAvatar.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import { BackgroundRequest } from "$lib/background-client";

	let className: string = "";
	export { className as class };
</script>

<div class={`flex flex-col ${className}`}>
	<div class="flex flex-col justify-center items-center min-h-16 pt-8">
		<img src="/valet-hero-logo-white.svg" alt="valet-hero-logo-white" />
		<p>The First Social Wallet on Solana</p>
	</div>

	<div class={"flex-1 flex flex-col justify-center items-center"}>
		{#if $userStore}
			<p class="text-xs">At your service</p>
			<div class="flex items-center pt-2">
				<UserAvatar class="mr-2" />
				<div class="flex-1">
					<p class="text-xl">{$userStore.name}</p>
				</div>
			</div>
			<Button variant="ghost" on:click={BackgroundRequest.signOut}>
				Sign out
			</Button>
		{:else}
			<p class="text-xl italic tracking-wider">At Your Service</p>
			<p class="">sign in to continue</p>
		{/if}
	</div>
</div>
