<script lang="ts">
	import * as Avatar from "$lib/components/ui/avatar";
	import { userStore } from "$lib/stores";

	let className = "";
	export let size = 8;
	export { className as class };
</script>

<Avatar.Root class={`w-${size} h-${size} ${className}`}>
	{#if $userStore}
		<Avatar.Image src={$userStore.avatar} alt={`${$userStore.name}`} />
		<Avatar.Fallback class="hover:cursor-default text-lg">
			{$userStore.name[0]}
		</Avatar.Fallback>
	{:else}
		<Avatar.Fallback class="hover:cursor-default text-lg">V</Avatar.Fallback>
	{/if}
</Avatar.Root>
