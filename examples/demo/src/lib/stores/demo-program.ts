import type { DemoProgramClient } from "$lib/demo-protocol";
import { writable } from "svelte/store";

export const demoProgram = writable<DemoProgramClient | undefined>(undefined);
