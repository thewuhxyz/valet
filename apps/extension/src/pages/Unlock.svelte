<script lang="ts">
	import Hero from "$lib/components/valet-ui/Hero.svelte"
	import EnterPassword from "$lib/components/valet-ui/EnterPassword.svelte"
	import { BackgroundRequest } from "$lib/background-client"
	import { toast } from "svelte-sonner"

	let handleSubmit = async (password: string) => {
		try {
			await BackgroundRequest.unlock(password)
		} catch (e) {
			toast( `❌ ${(e as any).message || e}`)
		}
	}
</script>

<Hero class="flex-1" />
<EnterPassword {handleSubmit} />
