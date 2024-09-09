// ✅ setup ota request route
import { otaDappServer } from "@/lib/ota";

export async function POST(req: Request) {
	const data = await req.json();

	const response = await otaDappServer.dappRequest(data);

	return new Response(JSON.stringify(response));
}
