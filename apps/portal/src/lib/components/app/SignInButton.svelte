<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte"
	import { Portal } from "$lib/database/client"
	import { getSupabase } from "$lib/stores/context"

	export let provider: "google" | "github"


	const supabase = getSupabase()

	let signIn = async () => {
		await Portal.signIn(supabase, provider)
	}
</script>

<Button on:click={signIn} class="space-x-2">
	<slot name="icon"/>
	<slot name="text" />
</Button>
