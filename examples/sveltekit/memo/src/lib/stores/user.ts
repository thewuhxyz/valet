import { writable } from "svelte/store"

export const userStore = writable<{
	email: string
	name: string
	avatar: string
} | null>(null)
