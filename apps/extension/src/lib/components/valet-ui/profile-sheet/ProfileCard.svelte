<script lang="ts">
	import { walletStore } from "$lib/stores";
	import UserAvatar from "../UserAvatar.svelte";

	$: ({ user } = walletStore);

	$: name = $user ? $user.name : "...";
	$: email = $user ? $user.email : "...@...";
</script>

<div class="flex w-full items-center card-active rounded-sm p-1 mt-2">
	<UserAvatar class="mr-2" />
	<div class="flex-1">
		<p class="text-lg">{name}</p>
		<p class="text">{email}</p>
	</div>
</div>
