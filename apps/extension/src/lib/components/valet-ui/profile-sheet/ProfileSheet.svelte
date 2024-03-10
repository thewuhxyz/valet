<script lang="ts">
	import * as Sheet from "$lib/components/ui/sheet";
	import Button from "$lib/components/ui/button/button.svelte";
	import Separator from "$lib/components/ui/separator/separator.svelte";
	import ProfileCard from "./ProfileCard.svelte";
	import UserAvatar from "../UserAvatar.svelte";
	import { BackgroundRequest } from "$lib/background-client";
	

</script>

<Sheet.Root>
	<Sheet.Trigger>
		<UserAvatar size={8} />
	</Sheet.Trigger>
	<Sheet.Content class="flex flex-col pb-0 p-2 pt-4" side="left">
		<div>
			<div>Valet</div>
			<ProfileCard />
		</div>
		<Separator class="bg-primary" />
		<div class="flex-1-y-scroll">Profile options</div>
		<div>
			<Button variant="secondary" on:click={BackgroundRequest.lock} class="cta-btn">Lock</Button>
			<Button variant="destructive" on:click={BackgroundRequest.signOut} class="cta-btn">Sign Out</Button>
		</div>
	</Sheet.Content>
</Sheet.Root>
