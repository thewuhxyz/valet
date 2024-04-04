import { Database } from "./schema"
import { SupabaseClient, createClient } from "@supabase/supabase-js"
import { ValetUser } from "@valet/ota-client"

export const supabaseAdmin = createClient<Database>(
	process.env.SUPABASE_URL!,
	process.env.SUPABSE_SERVICE_KEY!
)

export class OtaDatabase {
	static async adminCreateUser(userDetails: UserDetails) {
		return await supabaseAdmin.from("ota").insert(userDetails)
	}

	static async createUser(supabase: Supabase, userDetails: UserDetails) {
		return await supabase.from("ota").insert(userDetails)
	}

	static async adminGetUser(user: ValetUser) {
		const { data } = await supabaseAdmin
			.from("ota")
			.select("password, delegate")
			.eq("provider_id", user.providerId)
			.eq("provider", user.provider.toString())

		if (!data) return data
		return data[0]
	}
	static async getUser(supabase: Supabase, user: ValetUser) {
		const { data } = await supabase
			.from("ota")
			.select("password, delegate")
			.eq("provider_id", user.providerId)
			.eq("provider", user.provider.toString())

		if (!data) return data
		return data[0]
	}

	static async getAllowedDomains(supabase: Supabase) {
		const { data } = await supabase.from("projects").select("domain")
		if (!data) return data
		return data.map(({ domain }) => domain)
	}

	static async adminGetAllowedDomains() {
		const { data } = await supabaseAdmin.from("projects").select("domain")
		if (!data) return data
		return data.map(({ domain }) => domain)
	}

	static async adminGetProjectById(projectId: string) {
		const { data } = await supabaseAdmin
			.from("projects")
			.select("id, name, secret, domain, google, twitter, discord")
			.eq("id", projectId)
		if (!data) return data
		return data[0]
	}
	static async getProjectById(supabase: Supabase, projectId: string) {
		const { data } = await supabase
			.from("projects")
			.select("id, name, secret, domain, google, twitter, discord")
			.eq("id", projectId)
		if (!data) return data
		return data[0]
	}
}

export type Supabase = SupabaseClient<Database>

type UserDetails = {
	delegate: string
	password: string
	provider: string
	provider_id: string
}

export type ProjectData = {
	name?: string
	id?: string
	secret?: string
	domain?: string
	google?: string | null
	twitter?: string | null
	discord?: string | null
}
