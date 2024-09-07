<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import { walletStore } from "@svelte-on-solana/wallet-adapter-core";
	import { clusterApiUrl, Connection, PublicKey, Transaction } from "@solana/web3.js";
	import Connect from "$lib/components/app/Connect.svelte";
	import { toast } from "svelte-sonner";
	import { PUBLIC_DAPP_WALLET_PUBLICKEY } from "$env/static/public";
	import { OtaTransaction } from "@valet/ota";
	import { AnchorProvider, type Wallet } from "@coral-xyz/anchor";
	import { createMemoInstruction } from "@solana/spl-memo";

	$: count = "0";

	$: $walletStore.adapter?.on("disconnect", () => (count = "0"));

	$: wallet = {
		publicKey: $walletStore.publicKey,
		signTransaction: $walletStore.signTransaction,
		signAllTransactions: $walletStore.signAllTransactions,
	} as Wallet;

	async function signMemoInstruction() {
		try {
			if (!wallet) throw "wallet not connected";

			const memoInstruction = createMemoInstruction("Confirm Signers.", [
				wallet.publicKey,
			]);

			const connection = new Connection(clusterApiUrl("devnet"), "processed")

			const anchorProvider = new AnchorProvider(connection, wallet, {});

			const transaction = new Transaction();

			transaction.instructions = [memoInstruction];
			transaction.feePayer = wallet.publicKey;
			transaction.recentBlockhash = (
				await connection.getLatestBlockhash()
			).blockhash;

			// prepare OTA transaction
			const preparedTransaction = await OtaTransaction.prepare(
				anchorProvider,
				transaction,
				{
					feePayerIfDelegateNotTransfered: new PublicKey(
						PUBLIC_DAPP_WALLET_PUBLICKEY
					),
				}
			);

			const preparedInstructions = preparedTransaction.instructions.map(
				(ix) => {
					return ix.keys.map((meta) => ({
						...meta,
						pubkey: meta.pubkey.toBase58(),
					}));
				}
			);

			console.log("inx keys:", preparedInstructions);

			console.log("prep fee payer:", preparedTransaction.feePayer?.toBase58());

			const signedTransaction =
				await wallet.signTransaction(preparedTransaction);

			const txSig = await connection.sendRawTransaction(
				signedTransaction.serialize()
			);

			toast.success("Transaction successful!", {
				action: {
					label: "See Explorer",
					onClick: () => {
						window.location.href = `https://explorer.solana.com/tx/${txSig}?cluster=devnet`;
					},
				},
			});
		} catch (e: any) {
			toast.error(`Error occured. ${e.message || e}`);
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
		<p class="text-lg pr-4">Memo app</p>
	</div>

	<h1 class="text-center text-lg">Sign Memo Instruction</h1>

	<div class="flex flex-col hidde items-center justify-center text-center p-4">
		<div class="p-4 border">
			<div class="p-2 min-w-32">
				<h1>Counter</h1>
				<h1 class="text-6xl">{count}</h1>
			</div>
			{#if $walletStore?.connected}
				<div class="space-x-2 p-2">
					<Button on:click={signMemoInstruction}>Sign Memo</Button>
				</div>
			{/if}
		</div>
	</div>

	<div class="flex items-center justify-center my-2 space-x-2">
		<Connect />
	</div>
</div>
