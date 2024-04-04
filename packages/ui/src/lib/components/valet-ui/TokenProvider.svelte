<script lang="ts">
	import { setActiveWallet } from "$lib/stores/context.js"
	import type { ActiveWallet } from "$lib/index.js"
	import { Toaster } from "$lib/components/ui/sonner/index.js"

	export let activeWallet: ActiveWallet
	setActiveWallet(activeWallet)

	$: ({ getBalances } = activeWallet.tokens)
	$getBalances
</script>

<Toaster />
<slot />
