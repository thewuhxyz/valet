import type { ProjectData } from "$lib/mockdata.js"
import { Portal } from "$lib/database/client.js"
import { generateSecret } from "$lib/helpers.js"

export const POST = async ({ locals: { supabase }, request }) => {
	try {
		const project = (await request.json()) as ProjectData

		await Portal.createProject(supabase, {
			...project,
			secret: generateSecret(),
		})
	} catch {
		return new Response(JSON.stringify({ success: false }))
	}

	return new Response(JSON.stringify({ success: true }))
}
