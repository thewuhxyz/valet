<script lang="ts">
	import { userStore } from "$lib/stores";
	import UserAvatar from "../UserAvatar.svelte";

	$: name = $userStore ? $userStore.name : "No User Name Found"
	$: email = $userStore ? $userStore.email : ""

</script>

<div
	class='flex w-full items-center card-active rounded-sm p-1 mt-2'
>
	<UserAvatar />
	<div class="flex-1">
		<p class="text-lg">{name}</p>
		<p class="text">{email}</p>
	</div>
</div>
