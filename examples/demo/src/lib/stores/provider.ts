import type { Provider } from "@coral-xyz/anchor";
import { writable } from "svelte/store";

export const provider = writable<Provider | undefined>(undefined);
