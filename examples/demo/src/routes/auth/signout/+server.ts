export const GET = async ({ locals: { otaDappServer } }) => {
	await otaDappServer.removeProviderAndToken()
	return new Response(JSON.stringify({ success: true }));
};
