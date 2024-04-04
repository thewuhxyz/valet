import { getLogger } from "@valet/lib"
import { derived, get, writable } from "svelte/store"
import { fetchRecentSolanaTransactionDetails } from "$lib/helpers.js"
import type { TokenSuperStore } from "./token.js"

const logger = getLogger("state & wallet store:")

export class ActiveWallet {
	activeWallet = writable<string | undefined>()
	set = this.activeWallet.set
	subscribe = this.activeWallet.subscribe

	constructor(public tokens: TokenSuperStore) {}

	async init(activeWallet?: string) {
		this.set(activeWallet)
		this.tokens.init(get(this))
	}

	updateActiveWallet(activeWallet?: string) {
		this.set(activeWallet)
		this.refreshTokens()
	}

	async refreshTokens() {
		await this.tokens.refreshTokens(get(this.activeWallet))
	}

	get transfer() {
		return this.tokens.transfer
	}

	get balances() {
		return this.tokens.balances
	}

	get solBalance() {
		return derived(
			[this.activeWallet, this.balances],
			([activeWallet, balances]) => {
				if (!balances || !activeWallet) return
				return balances.get(activeWallet)
			}
		)
	}

	get recentTransactions() {
		return derived(this.activeWallet, async (activeWallet) => {
			if (!activeWallet) return
			const recentTransactions =
				await fetchRecentSolanaTransactionDetails(activeWallet)
			const recentSignatures = recentTransactions.map((tx) => {
				return tx.signature
			})
			return recentSignatures
		})
	}
}
