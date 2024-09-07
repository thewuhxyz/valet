"use client";

import {
	useAnchorWallet,
	useConnection,
	useWallet,
} from "@solana/wallet-adapter-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { createMemoInstruction } from "@solana/spl-memo";
import { Cluster, PublicKey, Transaction } from "@solana/web3.js";
import { signIn, signOut, useSession } from "next-auth/react";
import { OtaTransaction } from "@valet/ota";
import { AnchorProvider } from "@coral-xyz/anchor";

export default function Home() {
	const { data: session, status } = useSession();
	const wallet = useWallet();

	const auth = () => {
		if (status == "unauthenticated") {
			signIn("google");
		} else if (status === "authenticated") {
			// ✅ sign out of wallet
			signOut().then(() => fetch("/ota/signout"));
		}
	};

	return (
		<main className="flex-1 flex flex-col items-center justify-center space-y-16">
			<h1 className="text-3xl font-bold">Sign Memo</h1>
			{wallet.publicKey && <SignMemo />}
			<div className="text-center space-y-2">
				<p className="text-muted-foreground">
					{session?.user?.name
						? `logged in as: ${session.user.name}.`
						: "Not logged in."}
				</p>
				<Button onClick={auth}>
					{status === "unauthenticated"
						? "Sign in with Google"
						: status === "authenticated"
							? "Sign out"
							: "Loading"}
				</Button>
			</div>
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

function SignMemo() {
	const wallet = useAnchorWallet();
	const { connection } = useConnection();
	const dappPublicKey = new PublicKey(
		process.env.NEXT_PUBLIC_DAPP_WALLET_PUBLICKEY!
	);

	async function signMemoInstruction() {
		try {
			if (!wallet) throw "wallet not connected";

			const memoInstruction = createMemoInstruction("Confirm Signers.", [
				wallet.publicKey,
			]);

			const transaction = new Transaction();

			transaction.instructions = [memoInstruction];
			transaction.feePayer = wallet.publicKey;
			transaction.recentBlockhash = (
				await connection.getLatestBlockhash()
			).blockhash;

			// ✅ prepare OTA transaction
			const anchorProvider = new AnchorProvider(connection, wallet, {});

			const preparedTransaction = await OtaTransaction.prepare(
				anchorProvider,
				transaction,
				{ feePayerIfDelegateNotTransfered: dappPublicKey }
			);

			const signedTransaction =
				await wallet.signTransaction(preparedTransaction);

			const txSig = await connection.sendRawTransaction(
				signedTransaction.serialize()
			);
			toast.success("Transaction successful!", {
				action: <GoToExplorer tx={txSig} cluster="devnet" />,
				className: "w-max",
			});
		} catch (e: any) {
			toast.error(`Error occured. ${e.message || e}`);
		}
	}

	return <Button onClick={signMemoInstruction}>Sign Memo</Button>;
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
