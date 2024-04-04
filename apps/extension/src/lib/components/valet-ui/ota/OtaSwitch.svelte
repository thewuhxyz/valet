<script lang="ts">
	import { BackgroundRequest } from "$lib/background-client"
	import Switch from "$lib/components/ui/switch/switch.svelte"
	import { walletStore } from "$lib/stores"
	import { toast } from "svelte-sonner"

	let className: string = ""
	export { className as class }

	$: ({ isOta, otaWallet, delegate } = walletStore)

	let ota: boolean | undefined = undefined
	let loading: boolean = false

	// if it is undefined, it needs to be initialized
	$: ota === undefined && refresh()

	$: changeOta(ota)

	function refresh() {
		ota = $isOta
	}

	async function changeOta(ota: boolean | undefined) {
		try {
			loading = true
			if (ota === true) {
				$otaWallet
					? await BackgroundRequest.updateActiveWallet($otaWallet)
					: refresh()
			} else if (ota === false) {
				$delegate && (await BackgroundRequest.updateActiveWallet($delegate))
			}
		} catch (e: any) {
			toast(`❌ Error switching ota: ${e.message ?? e}`)
			refresh()
		} finally {
			loading = false
		}
	}
</script>

<Switch
	class={`${className}`}
	disabled={loading || ota === undefined}
	bind:checked={ota}
/>
