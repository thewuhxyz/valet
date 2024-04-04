<script lang="ts">
	import Hero from "$lib/components/valet-ui/Hero.svelte"
	import NewUserSetup from "$lib/components/valet-ui/NewUserSetup.svelte"
	import { BackgroundRequest } from "$lib/background-client"

	const handleSubmit = async (mnemonic: string, password: string) => {
		await BackgroundRequest.createKeyringStoreNew(mnemonic, password)
	}

	const generateMnemonic = async () => {
		return await BackgroundRequest.createMnemonic()
	}
</script>

<Hero class="flex-1" />
<NewUserSetup {generateMnemonic} {handleSubmit} />
