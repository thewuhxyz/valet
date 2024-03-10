<script lang="ts">
	import PageContainer from "$lib/components/valet-ui/PageContainer.svelte";
	import Hero from "$lib/components/valet-ui/Hero.svelte";
	import NewUserSetup from "$lib/components/valet-ui/NewUserSetup.svelte";
	import { BackgroundRequest } from "$lib/background-client";

	const handleSubmit = async (mnemonic: string, password: string) => {
		await BackgroundRequest.createKeyringStoreNew(mnemonic, password);
	};

	const generateMnemonic = async () => {
		return await BackgroundRequest.createMnemonic();
	};
</script>

<PageContainer class="flex flex-col">
	<Hero class="flex-1" />
	<NewUserSetup {generateMnemonic} {handleSubmit} />
</PageContainer>
