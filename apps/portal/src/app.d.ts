// See https://kit.svelte.dev/docs/types#app

import type { OtaDappServer } from "@valet/ota";
import type { OAuth2Client } from "google-auth-library";
import type { SupabaseClient, Session, User } from "@supabase/supabase-js";
import type { Database } from "$lib/database/schema";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient<Database>;
			getSession: () => Promise<Session | null>
			getUser: () => Promise<User | null>
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
