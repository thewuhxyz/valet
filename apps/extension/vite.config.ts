import { defineConfig } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import { purgeCss } from "vite-plugin-tailwind-purgecss"
import { crx } from "@crxjs/vite-plugin"
import * as path from "path"
import { nodePolyfills } from "vite-plugin-node-polyfills"
// @ts-ignore
import manifest from "./manifest.json"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		svelte(),
		purgeCss(),
		nodePolyfills({
			globals: { Buffer: true, global: true, process: true },
		}),
		crx({ manifest }),
	],
	server: {
		port: 8000,
		strictPort: true,
		hmr: {
			port: 8000,
		},
	},
	resolve: {
		alias: {
			$lib: path.resolve("./src/lib"),
		},
	},
})
