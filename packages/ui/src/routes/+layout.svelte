<script lang="ts">
	import "../app.pcss"
	import { Connection, PublicKey } from "@solana/web3.js"
	import { RPC_DEVNET_ENDPOINT } from "@valet/lib"
	import {
		SolanaSplConnection,
		customSplTokenAccounts,
		type SolanaTokenAccountWithKeyAndProgramIdString,
		type TokenMetadataString,
		fetchSplMetadataUri,
	} from "@valet/token"
	import TokenProvider from "$lib/components/valet-ui/TokenProvider.svelte"
	import AppBar from "$lib/components/valet-ui/home/AppBar.svelte"
	import { TokenSuperStore } from "$lib/stores/token.js"
	import { ActiveWallet } from "$lib/index.js"

	const connection = new Connection(RPC_DEVNET_ENDPOINT)

	const getCustomSplTokenAccounts = async (publicKey: string) => {
		const data = await customSplTokenAccounts(
			connection,
			new PublicKey(publicKey)
		)
		const json = SolanaSplConnection.customSplTokenAccountsToJson(data)
		// @ts-ignore
		// !  be sure to check if parses right. Have not got time to debug yet
		const bar = SolanaSplConnection.customSplTokenAccountsFromJson(json)
		return bar
	}

	const getCustomSplMetadataUri = async (
		tokens: Array<SolanaTokenAccountWithKeyAndProgramIdString>,
		tokenMetadata: Array<TokenMetadataString | null>
	) => {
		return await fetchSplMetadataUri(tokens, tokenMetadata)
	}

	const tokens = new TokenSuperStore({
		getCustomSplMetadataUri,
		getCustomSplTokenAccounts,
		connectionUrl: RPC_DEVNET_ENDPOINT,
	})

	const activeWallet = new ActiveWallet(tokens)

	// imitate active wallet store
	const pubkey = "6LJJSMQdYws2isQvP88ErGy8UhZ46saP2QonC1hJcZ8M"

	activeWallet.init(pubkey)

	setInterval(async () => {
		try {
			await activeWallet.refreshTokens()
		} catch (e) {
			console.error("something went wrong updating tokens:", e)
		}
	}, 30 * 1000)
</script>

<div class="w-full flex flex-col items-center min-h-screen">
	<AppBar />
	<TokenProvider {activeWallet}>
		<slot />
	</TokenProvider>
</div>
