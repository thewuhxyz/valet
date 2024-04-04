import { toast } from "svelte-sonner"

export class Toast {
	static fail = (e: any, text?: string) => toast(`❌ ${text ?? ""} ${e.message ?? e}`)
	static success = (text: string) => toast(`✅ ${text}`)
}
