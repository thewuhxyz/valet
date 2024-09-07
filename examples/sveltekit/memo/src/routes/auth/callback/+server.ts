import { PUBLIC_PROJECT_GOOGLE_ID } from "$env/static/public"
import { redirect } from "@sveltejs/kit"
import { Provider } from "@valet/ota"

export const GET = async (event) => {
	const {
		url,
		locals: { oauth2client, otaDappServer },
	} = event
	const code = url.searchParams.get("code") as string

	try {
		const { tokens } = await oauth2client.getToken(code)

		if (!tokens) throw redirect(300, "/")
		if (!tokens.id_token) throw redirect(300, "/")

		const ticket = await oauth2client.verifyIdToken({
			idToken: tokens.id_token,
			audience: PUBLIC_PROJECT_GOOGLE_ID,
		})

		const payload = ticket.getPayload()

		if (!payload) throw redirect(300, "/")

		await otaDappServer.setProviderAndToken(Provider.Google, tokens.id_token, {
			path: "/",
			secure: false,
			httpOnly: true,
			sameSite: "lax",
			expires: new Date(Date.now() + 3600000),
			maxAge: 3600,
		})
	} catch (error) {
		console.error("Authentication error:", error)
		return new Response(JSON.stringify({ successful: false }), { status: 500 })
	}

	throw redirect(303, "/")
}
