<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte"
	import Hero from "$lib/components/valet-ui/Hero.svelte"
	import ActionButtonArea from "$lib/components/valet-ui/ActionButtonArea.svelte"
	import { BackgroundRequest } from "$lib/background-client"
</script>

<Hero class="flex-1" />

<ActionButtonArea class="pb-[48px] max-w-xl" separator={false}>
	<Button on:click={BackgroundRequest.signIn} class="cta-btn">
		Sign in with Google
	</Button>
</ActionButtonArea>
