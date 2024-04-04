import type { ProjectData } from "$lib/mockdata.js"
import { Portal } from "$lib/database/client.js"

export const POST = async ({ locals: { supabase }, request }) => {
	try {
		const project = (await request.json()) as ProjectData

		await Portal.editProject(supabase, project)
	} catch {
		return new Response(JSON.stringify({ success: false }))
	}

	return new Response(JSON.stringify({ success: true }))
}
