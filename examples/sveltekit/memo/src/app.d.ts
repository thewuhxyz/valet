// See https://kit.svelte.dev/docs/types#app

import type { OtaDappServer } from "@valet/ota";
import type { OAuth2Client } from "google-auth-library";


// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			oauth2client: OAuth2Client
			otaDappServer: OtaDappServer
			getUserData: () => Promise<{
				avatar: string
				email: string
				name: string
			} | null>
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
