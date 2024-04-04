import { setContext, getContext } from "svelte";
import type { TokenSuperStore } from "./token.js";
import type { ActiveWallet } from "./active-wallet.js";
import type { SolanaWallet } from "@valet/token";

// sets the value in parent component
export const setTokens = (tokens: TokenSuperStore) => {
  setContext<TokenSuperStore>("tokens", tokens)
}

export const getTokens = () => {
  return getContext<TokenSuperStore>("tokens")
}

export const setActiveWallet = (activeWallet: ActiveWallet) => {
  setContext<ActiveWallet>("active-wallet", activeWallet);
}

export const getActiveWallet = () => {
  return getContext<ActiveWallet>("active-wallet")
}

export const setWallet = (solanaWallet: SolanaWallet | undefined) => {
  setContext<SolanaWallet | undefined>("wallet", solanaWallet)
}

export const getWallet = () => {
  return getContext<SolanaWallet | undefined>("wallet")
}