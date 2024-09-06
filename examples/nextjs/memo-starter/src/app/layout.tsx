import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Providers, WalletButton } from "@/context"
import "./globals.css"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
	title: "Memo App",
	description: "Sign Memo",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<Providers>
					<main className="mx-auto max-w-6xl p-2 min-h-screen flex flex-col">
						<header className="mx-auto flex w-full max-w-3xl justify-between py-4 pb-16">
							<Link href="/">
								<p className="text-3xl cursor-default">
									Memo
								</p>
							</Link>
							<WalletButton />
						</header>
						{children}
					</main>
				</Providers>
			</body>
		</html>
	)
}
