import { sveltekit } from "@sveltejs/kit/vite"
import { defineConfig } from "vite"
import path from "path"
import { nodePolyfills } from "vite-plugin-node-polyfills"

export default defineConfig({
	plugins: [
		sveltekit(),
		nodePolyfills({
			protocolImports: true,
		}),
	],

	resolve: {
		alias: {
			$lib: path.resolve("./src/lib"),
		},
	},
})
