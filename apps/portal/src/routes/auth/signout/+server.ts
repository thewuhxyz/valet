import { Portal } from "$lib/database/client.js"

export const GET = async ({ locals: { supabase } }) => {
	try {
		await Portal.signOut(supabase)
	} catch {
		return new Response(JSON.stringify({ success: false }))
	}
	return new Response(JSON.stringify({ success: true }))
}
