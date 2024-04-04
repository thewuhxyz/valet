import { BackgroundRequest } from "$lib/background-client"
import { getLogger } from "@valet/lib"
import { get, writable } from "svelte/store"

const logger = getLogger("user-store")

interface User {
	avatar?: string
	email?: string
	name?: string
}

export class UserStore {
	private user = writable<User | undefined>(undefined)
	set = this.user.set
	update = this.user.update
	subscribe = this.user.subscribe

	isMnemonicInDb = writable<boolean | undefined>()

	constructor() {}

	isInited = writable<boolean>(false)

	get isUser() {
		return get(this.isInited) && get(this.user) !== undefined
	}

	async init() {
		try {
			await Promise.all([this.updateUserData(), this.updateMnemonicInDb()])
		} catch (e: any) {
			console.error("error setting user store:", e)
			this.reset()
		} finally {
			this.isInited.set(true)
		}
	}

	async updateMnemonicInDb() {
		try {
			this.isMnemonicInDb.set(await BackgroundRequest.isMnemonicInDb())
		} catch (e: any) {
			console.log("could not get isMnemonicInDb", e)
			this.isMnemonicInDb.set(undefined)
		}
	}

	async updateUserData() {
		try {
			const userData = await BackgroundRequest.getUserData()
			this.updateUser(userData)
		} catch (e: any) {
			console.log("error fetching user data from background:",e)
			this.set(undefined)
		}
	}

	updateUser(user: User) {
		this.update((prev) => {
			return { ...prev, ...user }
		})
	}

	reset() {
		this.set(undefined)
		this.isMnemonicInDb.set(undefined)
	}
}
