<script lang="ts">
	import { Connection } from "@solana/web3.js"
	import type { Commitment, ConfirmOptions, ConnectionConfig } from "@solana/web3.js"
	import { AnchorProvider } from "@coral-xyz/anchor"
	import {
		walletStore,
		type WalletStore,
	} from "@svelte-on-solana/wallet-adapter-core"
	import { provider } from "$lib/stores"

	export let network: string,
		config: Commitment | ConnectionConfig | undefined = "processed"

	const connection = new Connection(network, config)

	function defineProgramAndProvider(walletStore: WalletStore): {
		connection: Connection
		network: string
		provider: AnchorProvider | undefined
	} {
		try {
			let { signTransaction, signAllTransactions, publicKey } = walletStore

			const wallet = {
				signTransaction: signTransaction!,
				signAllTransactions: signAllTransactions!,
				publicKey: publicKey!,
			}

			if (
				!wallet.publicKey ||
				!wallet.signTransaction ||
				!wallet.signAllTransactions
			) {
				provider.set(undefined)
				return {
					connection,
					network,
					provider: undefined,
				}
			}

			const anchorProvider = new AnchorProvider(connection, wallet, {
				preflightCommitment: "confirmed",
			} as ConfirmOptions)


			provider.set(anchorProvider)

			return {
				connection,
				provider: anchorProvider,
				network,
			}
		} catch (e) {
			console.error("error at AnchorProvider Component:", e)
			return {
				connection,
				network,
				provider: undefined,
			}
		}
	}

	$: $walletStore &&
		// $walletStore.publicKey &&
		defineProgramAndProvider($walletStore)
</script>

<slot />
