<script lang="ts">
	import * as Avatar from "$lib/components/ui/avatar";
	import { user } from "$lib/stores/user-store";

	let twClass = "";
	export let size = 8;
	export { twClass as class };
</script>

<Avatar.Root class={`w-${size} h-${size} ${twClass}`}>
	{#if $user}
		<Avatar.Image src={$user.avatar} alt={`${$user.name}`} />
		<Avatar.Fallback class="hover:cursor-default text-lg">
			{$user.name ? $user.name[0] : "?"}
		</Avatar.Fallback>
	{:else}
		<Avatar.Fallback class="hover:cursor-default text-lg">?</Avatar.Fallback>
	{/if}
</Avatar.Root>
