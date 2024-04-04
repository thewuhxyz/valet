<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte"
	import { walletStore } from "@svelte-on-solana/wallet-adapter-core"
	import { connection } from "$lib/demo-protocol"
	import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
	import { demoProgram } from "$lib/stores"
	import Connect from "$lib/components/app/Connect.svelte"
	import { toast } from "svelte-sonner"

	let balance: string | number = "0.00"
	$: count = "0"

	$: $walletStore.adapter?.on("disconnect", () => (count = "0"))

	const getBalance = async () => {
		try {
			if ($walletStore.publicKey) {
				const walletBalance = await connection.getBalance(
					new PublicKey($walletStore.publicKey)
				)
				balance = walletBalance / LAMPORTS_PER_SOL
				return
			}
			balance = "Wallet Not Connected"
		} catch (e) {
			balance = "Error getting balance"
		}
	}

	const getCount = async () => {
		if (!$demoProgram || !$walletStore) return
		try {
			count = await $demoProgram.count($walletStore)
		} catch (e) {
			count = "0"
		}
	}

	const createCounter = async () => {
		try {
			if (!$demoProgram || !$walletStore) {
				throw new Error("Progarm or Wallet not loaded")
			}
			const txSig = await $demoProgram.createCounter($walletStore)
			toast(
				`✅ Transaction successful - https://explorer.solana.com/tx/${txSig}?cluster=devnet`
			)
			await getBalance().catch()
			await getCount().catch()
		} catch (e: any) {
			toast(`❌ ${e.message || e}`)
		}
	}

	const incrementCount = async () => {
		try {
			if (!$demoProgram || !$walletStore) {
				throw new Error("Progarm or Wallet not loaded")
			}
			const txSig = await $demoProgram.incrementCount($walletStore)
			toast(
				`✅ Transaction successful - https://explorer.solana.com/tx/${txSig}?cluster=devnet`
			)
			await getBalance().catch()
			await getCount().catch()
		} catch (e: any) {
			toast(`❌ ${e.message || e}`)
		}
	}

	const incrementCount3x = async () => {
		try {
			if (!$demoProgram || !$walletStore) {
				throw new Error("Progarm or Wallet not loaded")
			}
			const txSig = await $demoProgram.incrementCount3x($walletStore)
			toast(
				`✅ Transaction successful - https://explorer.solana.com/tx/${txSig}?cluster=devnet`
			)
			await getBalance().catch()
			await getCount().catch()
		} catch (e: any) {
			toast(`❌ ${e.message || e}`)
		}
	}

	const incrementCount5x = async () => {
		try {
			if (!$demoProgram || !$walletStore) {
				throw new Error("Progarm or Wallet not loaded")
			}
			const [txSig, tx2Sig] = await $demoProgram.incrementCount5x($walletStore)
			toast(
				`✅ Transaction successful - https://explorer.solana.com/tx/${txSig}?cluster=devnet`
			)
			toast(
				`✅ Transaction successful - https://explorer.solana.com/tx/${tx2Sig}?cluster=devnet`
			)
			await getBalance().catch()
			await getCount().catch()
		} catch (e: any) {
			toast(`❌ ${e.message || e}`)
		}
	}
</script>

<div class="mt-16 flex flex-col items-center space-y-8 justify-center">
	<div class="text-right italic w-[360px]">
		<img
			src="/valet-hero-logo-white.svg"
			alt="valet-hero-logo-white"
			width="360"
		/>
		<p class="text-lg pr-4">Demo app</p>
	</div>

	<h1 class="text-center text-lg">Demo app to show the power of Valet</h1>

	<div class="flex flex-col hidde items-center justify-center text-center p-4">
		<div class="p-4 border">
			<div class="p-2 min-w-32">
				<h1>Counter</h1>
				<h1 class="text-6xl">{count}</h1>
			</div>
			{#if $walletStore?.connected}
				<div class="space-x-2 p-2">
					<Button on:click={incrementCount}>Increment 1x</Button>
					<Button on:click={incrementCount3x}>Increment 3x</Button>
					<Button on:click={incrementCount5x}>Increment 5x</Button>
				</div>
				<div class="space-x-2 p-2">
					<Button on:click={createCounter}>Create Counter</Button>
					<Button on:click={getBalance}>Get Balance: {balance}</Button>
					<Button on:click={getCount}>Refresh Count</Button>
				</div>
			{/if}
		</div>
	</div>

	<div class="flex items-center justify-center my-2 space-x-2">
		<Connect />
	</div>
</div>
