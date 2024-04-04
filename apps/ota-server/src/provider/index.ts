import { OAuth2Client } from "google-auth-library";

export async function getGoogleToken(token: string, clientId: string) {
	try {
		const client = new OAuth2Client();
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: clientId, 
		});

		const payload = ticket.getPayload();

		if (!payload) throw new Error("Not a valid token");

		return { providerId: payload.sub, image: payload.picture, name: payload.given_name };
	} catch (error) {
		console.error("Google Verification failed:", error);
		return null;
	}
}
