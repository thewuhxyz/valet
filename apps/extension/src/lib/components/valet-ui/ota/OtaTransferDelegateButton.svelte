<script lang="ts">
	import { BackgroundRequest } from "$lib/background-client"
	import Button from "$lib/components/ui/button/button.svelte"
	import { walletStore } from "$lib/stores"
	import { toast } from "svelte-sonner"

	export let from: string
	export let to: string
	export let password: string

	$: ({ otaWallet } = walletStore)
	$: transferring = false

	const transferDelegate = async () => {
		transferring = true
		try {
			if (!$otaWallet) throw new Error("Ota Wallet is not defined")

			if (from === to) throw new Error("Both selected wallet may be the same")

			let tx: string
			if (from === $otaWallet || to === $otaWallet) {
				tx = await BackgroundRequest.otaTransferDelegateServer(from, to, password)
			} else tx = await BackgroundRequest.otaTransferDelegateLocal(from, to)

			toast(`✅ Delegate Transfer Successful: ${tx}`)
		} catch (e) {
			console.error("error transferring delegate", e)
			toast(`❌ Delegate Transfer Failed: ${(e as any).message || e}`)
		} finally {
			transferring = false
		}
	}
</script>

<Button class="cta-btn w-full" on:click={transferDelegate}
	>{transferring ? "Transferring..." : " Transfer Delegate"}</Button
>
