<script lang="ts">
	import type { ProjectData } from "$lib/mockdata"
	import { projectData } from "$lib/stores"
	import { getSupabase } from "$lib/stores/context"
	import { Pencil2 } from "radix-icons-svelte"
	import ProjectDialog from "./ProjectDialog.svelte"
	import ProjectForm from "./ProjectForm.svelte"
	import Button from "../ui/button/button.svelte"

	export let project: ProjectData

	const supabase = getSupabase()

	let title = "Edit Project"
	let desc = "Edit this project project. Click save when you are done"

	async function handleSubmit(project: ProjectData) {
		const res = await fetch("/api/edit-project", {
			method: "POST",
			body: JSON.stringify(project),
		})

		const { success } = await res.json()
		if (success) projectData.setProjects(supabase)
	}
</script>

<ProjectDialog {title} {desc}>
	<Button slot="trigger" variant="ghost" size="icon" class="">
		<Pencil2 class="h-4" />
	</Button>
	<ProjectForm slot="form" {handleSubmit} {project} />
</ProjectDialog>
