import { initializeAndSetMnemonicStore } from "./mnemonic-store"
import { initializeAndSetKeyringStoreState } from "./state-store"
import { initializeAndSetUserStore } from "./user-store"

export * from "./mnemonic-store"
export * from "./state-store"
export * from "./user-store"
export * from "./token"

export const initializeStores = async () => {
  initializeAndSetKeyringStoreState()
  initializeAndSetUserStore()
  initializeAndSetMnemonicStore()
} 