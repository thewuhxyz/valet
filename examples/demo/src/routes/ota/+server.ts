export const POST = async ({ request, locals: { otaDappServer } }) => {
	const data = await request.json();
	
	const response = await otaDappServer.dappRequest(data);

	return new Response(JSON.stringify(response));
};
