import { BackgroundRequest } from "$lib/background-client";
import { writable } from "svelte/store";

export const mnemonicStore = writable<boolean | undefined>()

export const setMnemonicStore = (isMnemonicInDb: boolean) => {
	mnemonicStore.set(isMnemonicInDb);
};

export const initializeAndSetMnemonicStore = async () => {
  try {
    const mnemonic = await BackgroundRequest.isMnemonicInDb()
    setMnemonicStore(mnemonic)
  } catch (e) {
    console.error("error fetching mnemonic from db")
  }
}