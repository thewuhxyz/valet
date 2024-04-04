import {
	PUBLIC_SUPABASE_URL,
	PUBLIC_SUPABASE_ANON_KEY,
} from "$env/static/public"
import type { Database } from "$lib/database/schema"
import { createServerClient } from "@supabase/ssr"
import { redirect, type Handle } from "@sveltejs/kit"

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient<Database>(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				get: (key) => event.cookies.get(key),
				set: (key, value, options) => {
					event.cookies.set(key, value, { ...options, path: "/" })
				},
				remove: (key, options) => {
					event.cookies.delete(key, { ...options, path: "/" })
				},
			},
		}
	)

	event.locals.getSession = async () => {
		const { data: getUserData, error: err } =
			await event.locals.supabase.auth.getUser()

		let {
			data: { session },
		} = await event.locals.supabase.auth.getSession()

		if (getUserData.user == null) {
			session = null
		}
		return session
	}

	event.locals.getUser = async () => {
		const {
			data: { user },
		} = await event.locals.supabase.auth.getUser()
		return user
	}

	const user = await event.locals.getUser()

	if (user && event.url.pathname === "/") {
		redirect(303, "/dashboard")
	}

	const nonProtectedRoute =
		event.url.pathname.startsWith("/auth") || event.url.pathname === "/"

	if (!user && !nonProtectedRoute) {
		redirect(303, "/")
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === "content-range"
		},
	})
}
