import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
	plugins: [
		sveltekit(),
		nodePolyfills({
			protocolImports: true,
		}),
	],
	// server: {
	// 	port: 7000,
	// 	strictPort: true,
	// 	hmr: {
	// 		port: 7000,
	// 	},
	// },
})


