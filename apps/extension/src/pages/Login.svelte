<script lang="ts">
	import PageContainer from "$lib/components/valet-ui/PageContainer.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import Hero from "$lib/components/valet-ui/Hero.svelte";
	import ActionButtonArea from "$lib/components/valet-ui/ActionButtonArea.svelte";
	import { BackgroundRequest } from "$lib/background-client";
</script>

<PageContainer class="flex flex-col">
	<Hero class="flex-1" />

	<ActionButtonArea class="pb-[48px]" separator={false} >
		<Button on:click={BackgroundRequest.signIn} class="cta-btn">
			Sign in with Google
		</Button>
	</ActionButtonArea>
</PageContainer>
