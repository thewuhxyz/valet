// import { nodeResolve } from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"
import commonjs from "@rollup/plugin-commonjs"
import replace from "@rollup/plugin-replace"
import json from "@rollup/plugin-json"
import dotenv from "dotenv"

dotenv.config()

export default {
	input: "src/index.ts",
	output: {
		file: "dist/esm/index.js",
		format: "es",
		sourcemap: true,
	},
	plugins: [
		typescript({
			tsconfig: "./tsconfig.json",
			moduleResolution: "node",
			outDir: ".",
			target: "es2022",
			outputToFilesystem: false,
		}),

		json(),

		commonjs(),

		replace({
			preventAssignment: true,
			"process.env.SUPABASE_URL": JSON.stringify(process.env.SUPABASE_URL),
			"process.env.SUPABASE_ANON_KEY": JSON.stringify(
				process.env.SUPABASE_ANON_KEY
			),
			"process.env.GOOGLE_CLIENT_ID": JSON.stringify(
				process.env.GOOGLE_CLIENT_ID
			),
			"process.env.GOOGLE_CLIENT_SECRET": JSON.stringify(
				process.env.GOOGLE_CLIENT_SECRET
			),
		}),
	],
	external: [
		"crypto",
		"buffer",
		"path",
		"os",
		"fs",
		"@valet/lib",
		"bs58",
		"@solana/web3.js",
		"@coral-xyz/anchor",
		"@valet/ota-client",
		"@coral-xyz/anchor/dist/cjs/nodewallet",
		"tweetnacl",
		"ed25519-hd-key",
		"bip39",
		"@supabase/supabase-js",
		"google-auth-library",
		"@valet/token",
		"eventemitter3",
	],
}
