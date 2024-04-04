import { redirect } from "@sveltejs/kit"

export const GET = async ({ url, locals: { supabase } }) => {
	const code = url.searchParams.get("code") as string
	const next = url.searchParams.get("next") ?? "/dashboard"

	if (code) {
		const { error } = await supabase.auth.exchangeCodeForSession(code)
		if (!error) {
			throw redirect(303, `/${next.slice(1)}`)
		}
	}

	throw redirect(303, "/")
}
