<script lang="ts">
	import type { ProjectData } from "$lib/mockdata"
	import { projectData } from "$lib/stores"
	import { getSupabase } from "$lib/stores/context"
	import Button from "$lib/components/ui/button/button.svelte"
	import ProjectDialog from "./ProjectDialog.svelte"
	import ProjectForm from "./ProjectForm.svelte"

  const supabase = getSupabase()

	let title = "Create Project"
	let desc = "Create a new project. Click save when you are done"

	let project: ProjectData = {}

	async function handleSubmit(project: ProjectData) {
		const res = await fetch("/api/create-project", {
			method: "POST",
			body: JSON.stringify(project),
		})

		const { success } = await res.json()
    if (success) projectData.setProjects(supabase)
	}
</script>

<ProjectDialog {title} {desc}>
	<Button variant="secondary" slot="trigger">+ Add New</Button>
	<ProjectForm slot="form" {handleSubmit} {project} />
</ProjectDialog>
