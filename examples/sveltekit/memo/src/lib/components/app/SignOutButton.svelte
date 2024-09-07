<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte"
	import * as Avatar from "$lib/components/ui/avatar/index.js"
	import { userStore } from "$lib/stores"
	import { invalidateAll } from "$app/navigation"

	const signOut = async () => {
		await fetch("/auth/signout")
		await invalidateAll()
	}
</script>

{#if $userStore}
	<div class="flex items-center w-full">
		<Avatar.Root class="mr-4">
			<Avatar.Image src={$userStore.avatar} />
			<Avatar.Fallback class="hover:cursor-default text-primary text-lg"
				>{"?"}</Avatar.Fallback
			>
		</Avatar.Root>
		<div class="text-left w-full">
			<div class="flex justify-between">
				<p class="text-lg">{$userStore.name}</p>
				<Button
					on:click={signOut}
					size="sm"
					class="hover:text-destructive"
					variant="link">Sign out</Button
				>
			</div>
			<p class="text-sm opacity-50">{$userStore.email}</p>
		</div>
	</div>
{/if}
