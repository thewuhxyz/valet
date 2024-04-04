import { assert } from "chai"
import { Protocol, User } from "./mock-client"
import { Connection, Keypair } from "@solana/web3.js"
import { AnchorProvider, Wallet } from "@coral-xyz/anchor"
import { authority } from "./mock-keypairs"
import { sleep } from "./helpers"
import {
	createCounterTx,
	fetchCounterAccount,
	getCounterPda,
	incrementCountTx,
} from "./demo-program"

describe("valet-protocol", () => {
	const id = Keypair.generate().publicKey.toBase58().slice(0, 10)
	const user = new User(id)

	const connection = new Connection("http://localhost:8899", {
		commitment: "processed",
	})
	const delegateKeypair = Keypair.fromSecretKey(new Uint8Array(authority))
	const delegate = new Wallet(delegateKeypair)
	const provider = new AnchorProvider(connection, delegate, {
		skipPreflight: true,
		commitment: "processed",
	})

	const protocol = new Protocol(provider)

	it("user account is initialized!", async () => {
		const { walletSignerBalance, delegateBalance } =
			await protocol.getUserBalances(user)
		
      console.log("delegate Balance:", delegateBalance)

		if (!walletSignerBalance) {
			await protocol.createWalletAccount(user)
      await protocol.transferSol(user, 0.01)
      await sleep(5)
		}


		const account = await protocol.getWalletAccount(user)

		const { walletDelegate } = protocol.getUserAddresses(user)

		assert.equal(account.walletDelegate.toBase58(), walletDelegate.toBase58())

		const { walletSignerBalance: walletBalance } =
			await protocol.getUserBalances(user)

		console.log("wallet balance:", walletBalance)
	})

	it("creates a counter", async () => {
		const { walletSigner, walletAccount } =
			protocol.getUserAddresses(user)
		console.log("walletSigner:", walletSigner.toBase58())
		console.log("walletAccount:", walletAccount.toBase58())
		const counterPda = getCounterPda(walletSigner)

		let counterBalance = await connection.getBalance(counterPda)
		console.log("counter balance:", counterBalance)

		let { walletSignerBalance } = await protocol.getUserBalances(user)
		console.log("account signer balance:", walletSignerBalance)

		if (!counterBalance) {
			await protocol.signTransaction(
				user,
				await createCounterTx({
					authority: walletSigner,
					counter: counterPda,
				})
			)

			await sleep(5)

			const { walletSignerBalance: newWalletSignerBalance } =
				await protocol.getUserBalances(user)

			const txCost = walletSignerBalance - newWalletSignerBalance
			console.log("Cost to create counter account:", txCost)
		}

		const counter = await fetchCounterAccount(counterPda)

		console.log("counter:", {
			...counter,
			authority: counter.authority.toBase58(),
			pubkey: counter.pubkey.toBase58(),
		})

		assert.equal(counter.authority.toBase58(), walletSigner.toBase58())
		assert.equal(counter.pubkey.toBase58(), counterPda.toBase58())
	})

	it("signs single instruction: increments count", async () => {
		const { walletSigner } = protocol.getUserAddresses(user)

		const counterPda = getCounterPda(walletSigner)

		let counterBalance = await connection.getBalance(counterPda)
		console.log("counter balance:", counterBalance)

		if (!counterBalance) throw Error("counter not initialized")

		const tx = await protocol.signTransaction(
			user,
			await incrementCountTx({
				authority: walletSigner,
				counter: counterPda,
			})
		)

		await sleep(5)

		const counter = await fetchCounterAccount(counterPda)

		console.log("counter:", {
			...counter,
			authority: counter.authority.toBase58(),
			pubkey: counter.pubkey.toBase58(),
		})
	})
})
