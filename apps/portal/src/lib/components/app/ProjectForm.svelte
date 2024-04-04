<script lang="ts">
	import type { ProjectData } from "$lib/mockdata"
	import { Label } from "$lib/components/ui/label"
	import { Input } from "$lib/components/ui/input"
	import Button from "$lib/components/ui/button/button.svelte"

	export let project: ProjectData

	let name: string = project.name ?? "",
		domain: string = project.domain ?? "",
		googleId: string = project.googleId ?? "",
		twitterId: string = project.twitterId ?? "",
		discord: string = project.discord ?? ""

	$: project = {
		...project,
		name: name || project.name,
		domain: domain || project.domain,
		googleId: googleId || project.googleId,
		twitterId: twitterId || project.twitterId,
		discord: discord || project.discord,
	}

	export let handleSubmit: (projectData: ProjectData) => Promise<void>

	export let action: string | undefined = undefined
	export let method: string | undefined = undefined
</script>

<form
	on:submit|preventDefault={() => handleSubmit(project)}
	{action}
	{method}
	class="grid gap-4 py-4"
>
	<div class="grid grid-cols-4 items-center gap-4">
		<Label for="name" class="text-right">Name</Label>
		<Input
			id="name"
			placeholder="Name of Project"
			bind:value={name}
			class="col-span-3"
		/>
	</div>
	<div class="grid grid-cols-4 items-center gap-4">
		<Label for="domain" class="text-right">Domain</Label>
		<Input
			id="domain"
			placeholder="https://"
			bind:value={domain}
			class="col-span-3"
		/>
	</div>
	<div class="grid grid-cols-4 items-center gap-4">
		<Label for="google-id" class="text-right">Google ID</Label>
		<Input
			id="google-id"
			placeholder="Project's Google Client ID (Optional)"
			bind:value={googleId}
			class="col-span-3"
		/>
	</div>
	<div class="grid grid-cols-4 items-center gap-4">
		<Label for="twitter-id" class="text-right">Twitter ID</Label>
		<Input
			id="twitter-id"
			placeholder="Project's Twitter OAUTH ID (Optional)"
			bind:value={twitterId}
			class="col-span-3"
		/>
	</div>
	<div class="grid grid-cols-4 items-center gap-4">
		<Label for="discord-id" class="text-right">Discord ID</Label>
		<Input
			id="discord-id"
			placeholder="Project's Discord ID (Optional)"
			bind:value={discord}
			class="col-span-3"
		/>
	</div>
  <Button on:click type="submit">Save changes</Button>
</form>
