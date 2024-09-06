"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { createMemoInstruction } from "@solana/spl-memo";
import { Cluster, Transaction } from "@solana/web3.js";

export default function Home() {
	return (
		<main className="flex-1 flex flex-col items-center justify-center space-y-16">
			<h1 className="text-3xl font-bold">Sign Memo</h1>
			<MemoTransaction />
			<div className="flex items-center justify-center space-x-2">
				<p className="">Memo app. Courtesy of </p>
				<a
					target="_blank"
					href="https://twitter.com/_thewuh"
					className="hover:underline text-muted-foreground"
				>
					@_thewuh
				</a>
			</div>
		</main>
	);
}

function MemoTransaction() {
	const wallet = useWallet();
	const { connection } = useConnection();

	async function signMemoTransaction() {
		try {
			if (!wallet.publicKey || !wallet.signTransaction)
				throw "wallet not connected";

			const memoInstruction = createMemoInstruction("Confirm Signers.", [
				wallet.publicKey,
			]);

			const transaction = new Transaction();

			transaction.instructions = [memoInstruction];
			transaction.feePayer = wallet.publicKey;
			transaction.recentBlockhash = (
				await connection.getLatestBlockhash()
			).blockhash;

			// prepare OTA transaction

			const signedTransaction = await wallet.signTransaction(transaction);

			const txSig = await connection.sendRawTransaction(
				signedTransaction.serialize()
			);
			toast.success("Counter created successfully!", {
				action: <GoToExplorer tx={txSig} cluster="custom" />,
				className: "w-max",
			});
		} catch (e: any) {
			toast.error(`Error occured. ${e.message || e}`);
		}
	}

	return <Button onClick={signMemoTransaction}>Sign Memo</Button>;
}

function GoToExplorer({
	tx,
	cluster,
}: {
	tx: string;
	cluster: Cluster | "custom";
}) {
	const explorer = `https://explorer.solana.com/tx/${tx}?cluster=${cluster}`;
	return (
		<a href={explorer} className={cn(buttonVariants({ size: "sm" }))}>
			See Explorer
		</a>
	);
}
