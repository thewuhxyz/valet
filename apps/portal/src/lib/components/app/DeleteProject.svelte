<script lang='ts'>
	import type { ProjectData } from "$lib/mockdata"
	import { projectData } from "$lib/stores"
	import { getSupabase } from "$lib/stores/context"
	import Button from "$lib/components/ui/button/button.svelte"
	import { Trash } from "radix-icons-svelte"

  export let project: ProjectData

	const supabase = getSupabase()
  let handleDelete = async () => {
		const res = await fetch("/api/delete-project", {
			method: "POST",
			body: JSON.stringify(project),
		})

		const { success } = await res.json()
		if (success) projectData.setProjects(supabase)
	}
</script>

<Button
		size="icon"
		variant="ghost"
		class="hover:bg-destructive"
		on:click={handleDelete}
	>
		<Trash class="h-4" />
	</Button>