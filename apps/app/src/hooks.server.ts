import { OAuth2Client } from "google-auth-library"
import { type Handle } from "@sveltejs/kit"
import {
	PROJECT_GOOGLE_SECRET,
	VALET_PROJECT_SECRET,
	VALET_PROJECT_ID,
} from "$env/static/private"
import { OtaDappServer } from "@valet/ota"
import { dappWallet } from "$lib/dapp-wallet"
import { PUBLIC_APP_DOMAIN, PUBLIC_PROJECT_GOOGLE_ID } from "$env/static/public"

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.oauth2client = new OAuth2Client({
		clientId: PUBLIC_PROJECT_GOOGLE_ID,
		clientSecret: PROJECT_GOOGLE_SECRET,
		redirectUri: `${PUBLIC_APP_DOMAIN}/auth/callback`,
	})

	event.locals.otaDappServer = new OtaDappServer(
		VALET_PROJECT_ID,
		VALET_PROJECT_SECRET,
		{
			wallet: dappWallet,
			cookie: {
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

	let otaDappServer = event.locals.otaDappServer
	let oauth2client = event.locals.oauth2client

	event.locals.getUserData = async () => {
		try {
			const providerItem = await otaDappServer.getProviderAndToken()
			if (!providerItem) throw new Error("No provider item")

			const ticket = await oauth2client
				.verifyIdToken({
					idToken: providerItem.providerToken,
				})
				.catch(() => undefined)
			if (!ticket)
				throw new Error("Error verify Id token. Token may have expired")
			const payload = ticket.getPayload()
			if (!payload)
				throw new Error("No payload returned for user from auth token")
			return {
				avatar: payload.picture!,
				email: payload.email!,
				name: payload.given_name!,
			}
		} catch (e) {
			return null
		}
	}

	const response = await resolve(event)

	return response
}
