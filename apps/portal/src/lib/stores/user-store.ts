import type { User } from "@supabase/supabase-js"
import { writable } from "svelte/store"

function createUser() {
	const { subscribe, set } = writable<UserData | undefined>()

	async function setUser(user: User) {
		set({
			name: user.user_metadata.name,
			avatar: user.user_metadata.avatar_url,
			email: user.user_metadata.email,
		})
	}

	return { set, subscribe, setUser }
}

export const user = createUser()

type UserData = {
	avatar: string
	name: string
	email: string
}
