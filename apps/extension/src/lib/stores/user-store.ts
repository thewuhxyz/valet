import { BackgroundRequest } from "$lib/background-client";
import { type ValetUser } from "@valet/lib";
import { writable } from "svelte/store";

export const userStore = writable<ValetUser | undefined>();

export const resetUserStore = () => {
	userStore.set(undefined);
};

export const setUserStore = (user: ValetUser) => {
	userStore.set(user);
};

export const initializeAndSetUserStore = async () => {
	try {
		const user = await BackgroundRequest.getUserData();
		setUserStore(user);
	} catch (e) {
		resetUserStore();
	}
};
