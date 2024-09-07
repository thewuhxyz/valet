import type { Provider } from "@coral-xyz/anchor";
import type { Connection } from "@solana/web3.js";
import { writable } from "svelte/store";

export const provider = writable<Provider | undefined>(undefined);
export const connection = writable<Connection | undefined>(undefined)