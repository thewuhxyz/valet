"use client";

import {
	ConnectionProvider,
	WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { Toaster } from "@/components/ui/sonner";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import dynamic from "next/dynamic";
import { clusterApiUrl } from "@solana/web3.js";

export function WalletContextProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const endpoint = clusterApiUrl("devnet");

	return (
		<ConnectionProvider endpoint={endpoint}>
			<WalletProvider
				wallets={
					[
						// todo: add Valet wallet adapter
					]
				}
				autoConnect
			>
				<WalletModalProvider>{children}</WalletModalProvider>
			</WalletProvider>
		</ConnectionProvider>
	);
}

export function UIProvider({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Toaster />
			{children}
		</>
	);
}

export function Providers({
	session,
	children,
}: {
	session: Session | null;
	children: React.ReactNode;
}) {
	return (
		<SessionProvider session={session}>
			<WalletContextProvider>
				<UIProvider>{children}</UIProvider>
			</WalletContextProvider>
		</SessionProvider>
	);
}

export const WalletButton = dynamic(
	async () =>
		(await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
	{ ssr: false }
);
