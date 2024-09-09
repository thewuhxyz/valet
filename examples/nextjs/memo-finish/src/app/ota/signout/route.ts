// ✅ setup signout
import { otaDappServer } from "@/lib/ota";

export async function GET() {
	await otaDappServer.removeProviderAndToken();
	return new Response(JSON.stringify({ success: true }));
}
