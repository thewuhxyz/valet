<script lang="ts">
	import { buttonVariants } from "$lib/components/ui/button/index.js"
	import { getActiveWallet, truncate } from "$lib/index.js"
	import { PublicKey } from "@solana/web3.js"
	import {
		SOL_NATIVE_MINT,
		Solana,
		TOKEN_PROGRAM_ID,
		type SolanaWallet,
		type WalletContext,
	} from "@valet/token"
	import { toast } from "svelte-sonner"

	let className = ""

	export { className as class }
	export let wallet: SolanaWallet | undefined = undefined
	export let recipient: string
	export let amount: string
	export let tokenAddress: string
	export let type: HTMLButtonElement["type"] = "button"

	$: ({ balances, tokens } = getActiveWallet())
	$: token = $balances && $balances.get(tokenAddress)
	$: ({ tokenInterface, tokenRegistry, mintMap, getBalances, otaPrepareTransaction } = tokens)
	$: connection = $tokenInterface.provider.connection
	$: sending = false
	$: transferToken = async () => {
		sending = true
		if (!wallet || !token) {
			sending = false
			throw new Error("Invalid wallet or token")
		}
		try {
			const txSig = await transfer(recipient, parseFloat(amount), wallet)
			sending = false
			toast(`
			✅ Sent ${amount} ${token ? token.ticker : "tokens"} to ${truncate(recipient)}. 
			\nTransaction signature: https://explorer.solana.com/tx/${txSig}?cluster=devnet
			`)
			await $getBalances
		} catch (e) {
			
			toast(`❌ Failed To complete transaction: ${(e as any).message || e}`)
			sending = false
		}
	}

	async function transfer(
		destinationAddress: string,
		amount: number,
		wallet: SolanaWallet
	) {
		if (!token) throw new Error("token not defined")

		if (!$mintMap) throw new Error("Token mint map is undefined")

		const mintInfo = $mintMap.get(token.mint)

		const solanaCtx: WalletContext = {
			connection: connection,
			commitment: connection.commitment!,
			registry: $tokenRegistry,
			tokenInterface: $tokenInterface,
			otaPrepareTransaction
		}

		if (token.mint === SOL_NATIVE_MINT.toString()) {
			return await Solana.transferSol(
				solanaCtx,
				{
					source: wallet.publicKey,
					destination: new PublicKey(destinationAddress),
					amount: amount,
				},
				wallet
			)
		}

		return await Solana.transferToken(
			solanaCtx,
			{
				destination: new PublicKey(destinationAddress),

				mint: new PublicKey(token.mint),
				programId: new PublicKey(
					mintInfo ? mintInfo.programId : TOKEN_PROGRAM_ID
				),
				amount: amount,
				decimals: token.decimals,
			},
			wallet
		)
	}
</script>

<button
	class={`${buttonVariants()} cta-btn ${wallet ? "" : "disabled"} ${className}`}
	disabled={!wallet}
	on:click={transferToken}
	{type}
>
	{#if sending}
		Sending Transaction...
	{:else}
		Send {amount}
		{token ? token.ticker : ""}
		{`${recipient ? `to ${truncate(recipient)}` : ""}`}
	{/if}
</button>
