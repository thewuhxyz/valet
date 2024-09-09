export const GET = async ({ locals: { oauth2client } }) => {
	const authUrl = oauth2client.generateAuthUrl({
		access_type: "offline",
		scope: "openid email profile",
	});

	return new Response(JSON.stringify({ url: authUrl }));
};
