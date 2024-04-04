<script lang="ts">
	import "../app.pcss"
	import { invalidate } from "$app/navigation"
	import { user } from "$lib/stores/user-store"
	import { onMount } from "svelte"
	import { projectData } from "$lib/stores"
	import { setSupabase } from "$lib/stores/context"

	export let data
	
	$: ({ supabase, session } = data)

	$: setSupabase(supabase)

	onMount(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, _session) => {
			invalidate("supabase:auth")
		})
		return () => subscription.unsubscribe()
	})

	$: session ? user.setUser(session.user) : user.set(undefined)
	$: session && projectData.setProjects(supabase)
</script>

<slot />
