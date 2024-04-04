import * as anchor from "@coral-xyz/anchor"
import { Program } from "@coral-xyz/anchor"
import { PublicKey } from "@solana/web3.js"
import { DemoProgram } from "../src/idl"

anchor.setProvider(anchor.AnchorProvider.env())
export const demo = anchor.workspace.DemoProgram as Program<DemoProgram>

export const getCounterPda = (authority: PublicKey) => {
	return PublicKey.findProgramAddressSync(
		[Buffer.from("counter"), authority.toBuffer()],
		demo.programId
	)[0]
}

export const fetchCounterAccount = async (key: PublicKey) => {
	return await demo.account.counter.fetch(key)
}

export const createCounterIx = async ({
	counter,
	authority,
}: {
	counter: PublicKey
	authority: PublicKey
}) => {
	return await demo.methods
		.createCounter()
		.accountsStrict({
			authority,
			counter,
			systemProgram: anchor.web3.SystemProgram.programId,
		})
		.instruction()
}

export const createCounterTx = async ({
	counter,
	authority,
}: {
	counter: PublicKey
	authority: PublicKey
}) => {
	return await demo.methods
		.createCounter()
		.accountsStrict({
			authority,
			counter,
			systemProgram: anchor.web3.SystemProgram.programId,
		})
		.transaction()
}

export const incrementCountIx = async ({
	counter,
	authority,
}: {
	counter: PublicKey
	authority: PublicKey
}) => {
	return await demo.methods
		.incrementCount()
		.accountsStrict({
			authority,
			counter,
		})
		.instruction()
}

export const incrementCountTx = async ({
	counter,
	authority,
}: {
	counter: PublicKey
	authority: PublicKey
}) => {
	return await demo.methods
		.incrementCount()
		.accountsStrict({
			authority,
			counter,
		})
		.transaction()
}
