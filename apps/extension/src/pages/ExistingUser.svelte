<script lang="ts">
	import PageContainer from "$lib/components/valet-ui/PageContainer.svelte";
	import Hero from "$lib/components/valet-ui/Hero.svelte";
	import EnterPassword from "$lib/components/valet-ui/EnterPassword.svelte";
	import { BackgroundRequest } from "$lib/background-client";

	let handleSubmit = async (password: string) => {
		await BackgroundRequest.createKeyringStoreExisting(password);
	};
</script>

<PageContainer class="flex flex-col">
	<Hero class="flex-1" />
	<EnterPassword {handleSubmit} buttonText={"Finish Setup"} />
</PageContainer>
