import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "./schema"
import type { ProjectData } from "$lib/mockdata"
import { PUBLIC_PORTAL_DOMAIN } from "$env/static/public"

export class Portal {
	static async session(supabase: Supabase) {
		const {
			data: { session },
		} = await supabase.auth.getSession()
		if (!session) throw new Error("No session returned")
		return session
	}
	static async createProject(supabase: Supabase, projectData: ProjectData) {
		const session = await Portal.session(supabase)
		const domain = projectData.domain
		const secret = projectData.secret
		const name = projectData.name
		if (!domain || !secret || !name)
			throw new Error("Required Fields not properly filled out")

			const { error } = await supabase
			.from("projects")
			.insert({
				google: projectData.googleId,
				twitter: projectData.twitterId,
				domain,
				secret,
				name,
			})
			.eq("user_id", session.user.id)
		if (error) throw new Error(error.message)
	}

	static async editProject(supabase: Supabase, projectData: ProjectData) {
		await Portal.session(supabase)

		if (!projectData.id) throw new Error("Project ID is not defined")

		const { error } = await supabase
			.from("projects")
			.update({
				google: projectData.googleId,
				twitter: projectData.twitterId,
				discord: projectData.discord,
				domain: projectData.domain,
				name: projectData.name,
			})
			.eq("id", projectData.id!)

			if (error) throw new Error(error.message)
	}

	static async deleteProjectById(supabase: Supabase, projectId: string) {
		const session = await Portal.session(supabase)
		const { error } = await supabase
			.from("projects")
			.delete()
			.eq("id", projectId)
			.eq("user_id", session.user.id)
	}

	static async getAllProject(supabase: Supabase) {
		await Portal.session(supabase)
		const { data } = await supabase.from("projects").select("*")
		return data
	}

	static async signIn(supabase: Supabase, provider: "google" | "github") {
		const {
			data: { url },
		} = await supabase.auth.signInWithOAuth({
			provider,
			options: {
				redirectTo: `${PUBLIC_PORTAL_DOMAIN}/auth/callback`,
			},
		})

    return url
	}

	static async signOut(supabase: Supabase) {
		return await supabase.auth.signOut()
	}
}

export type Supabase = SupabaseClient<Database>
