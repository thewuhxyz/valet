import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import * as path from "path";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
	plugins: [
		nodePolyfills({
			protocolImports: true,
		}),
		sveltekit(),
	],

	resolve: {
		alias: {
			$lib: path.resolve("./src/lib"),
		},
	},
});
