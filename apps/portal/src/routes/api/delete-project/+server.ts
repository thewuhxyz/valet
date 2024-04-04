import { Portal } from "$lib/database/client.js"
import type { ProjectData } from "$lib/mockdata.js"

export const POST = async ({ locals: { supabase }, request }) => {
	try {
		const { id } = await request.json() as ProjectData
		await Portal.deleteProjectById(supabase, id!)

	} catch {
		return new Response(JSON.stringify({ success: false }))
	}

	return new Response(JSON.stringify({ success: true }))
}
