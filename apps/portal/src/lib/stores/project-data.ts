import { writable } from "svelte/store"
import type { ProjectData } from "$lib/mockdata"
import type { Supabase } from "$lib/database/client"
import { Portal } from "$lib/database/client"

function createProject() {
	const { set, subscribe } = writable<ProjectData[]>([])

	const reset = () => set([])

	async function setProjects(supabase: Supabase) {
		try {
			const data = await Portal.getAllProject(supabase)
			if (data === null) throw new Error("no data returned from database")
			const projects: ProjectData[] = data.map(
				({ discord, google, twitter, name, id, domain, secret }) => {
					return {
						name,
						id,
						secret,
						domain,
						discord: discord ?? undefined,
						googleId: google ?? undefined,
						twitterId: twitter ?? undefined,
					}
				}
			)
			set(projects)
		} catch (e) {}
	}

	return { set, subscribe, reset, setProjects }
}

export const projectData = createProject()
