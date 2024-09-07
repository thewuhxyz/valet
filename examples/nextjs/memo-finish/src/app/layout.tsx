import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers, WalletButton } from "@/context";
import "./globals.css";
import { getSession } from "@/lib/authOptions";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Memo App",
	description: "Sign Memo",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await getSession();
	return (
		<html lang="en">
			<body className={inter.className}>
				<Providers session={session}>
					<main className="mx-auto max-w-6xl p-2 min-h-screen flex flex-col">
						<header className="mx-auto flex w-full max-w-3xl justify-between py-4 pb-16">
							<p className="text-3xl cursor-default">Memo</p>
							<WalletButton />
						</header>
						{children}
					</main>
				</Providers>
			</body>
		</html>
	);
}
