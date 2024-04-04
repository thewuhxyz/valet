<script lang="ts">
	import EditProject from "./EditProject.svelte"
	import type { ProjectData } from "$lib/mockdata"
	import DeleteProject from "./DeleteProject.svelte"

	export let project: ProjectData
</script>

<div class="w-full flex space-x-2 justify-end">
	<EditProject {project} />
	<DeleteProject {project} />
</div>
