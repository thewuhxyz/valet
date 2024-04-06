import {
	DappConnectData,
	DappSignAllTransactionData,
	DappSignTransactionData,
} from "../zod"
import {
	CookieMethods,
	CookieOptions,
	DappServerResponse,
	OtaClientConfig,
	ProviderItem,
} from "./types"
import nacl from "tweetnacl"
import util from "tweetnacl-util"
import {
	DappServerRequest,
	DappServerSignAllTransactionsPayload,
	DappServerSignTransactionPayload,
	OtaAction,
} from "../types"
import { Provider } from "../protocol"
import { Wallet } from "@coral-xyz/anchor"
import { deserializeOriginalTransaction } from "@valet/lib"
import bs58 from "bs58"

export class OtaDappServer {
	cookieMethods: CookieMethods
	wallet: Wallet
	constructor(
		public projectId: string,
		private projectSecret: string,
		public otaConfig: OtaClientConfig
	) {
		this.cookieMethods = otaConfig.cookie
		this.wallet = otaConfig.wallet
	}

	setCookieMethod(cookieMethods: CookieMethods) {
		this.cookieMethods = cookieMethods
	}

	async getCookie(key: string): Promise<string | undefined> {
		const getCookie = this.cookieMethods.get?.(key)
		if (getCookie instanceof Promise) {
			try {
				const cookie = await getCookie
				if (!cookie) return
				return cookie
			} catch (error) {
				console.error("Error getting cookie:", error)
				return
			}
		} else {
			const cookie = getCookie
			if (!cookie) return
			return getCookie
		}
	}

	async setCookie(key: string, value: string, options: any): Promise<void> {
		try {
			await this.cookieMethods.set?.(key, value, options)
		} catch (error) {
			console.error("Error setting cookie:", error)
			return
		}
	}

	async removeCookie(key: string, options: any): Promise<void> {
		try {
			await this.cookieMethods.remove?.(key, options)
		} catch (error) {
			console.error("Error removing cookie:", error)
			return
		}
	}

	async setProviderAndToken(
		provider: Provider,
		providerToken: string,
		options: CookieOptions
	): Promise<void> {
		const value = JSON.stringify({ provider, providerToken })
		await this.setCookie("valet-id-token", value, options)
	}

	async getProviderAndToken(): Promise<ProviderItem | undefined> {
		try {
			const providerItemString = await this.getCookie("valet-id-token")
			if (!providerItemString) return
			return JSON.parse(providerItemString)
		} catch {
			return undefined
		}
	}

	async removeProviderAndToken() {
		try {
			await this.removeCookie("valet-id-token", {})
		} catch {}
	}

	async dappRequest({
		action,
		payload,
	}: DappServerRequest): Promise<DappServerResponse> {
		switch (action) {
			case OtaAction.Connect:
				return await this.connect()

			case OtaAction.Disconnect:
				return await this.disconnect()

			case OtaAction.SignTransaction:
				return await this.signTransaction(payload)

			case OtaAction.SignAllTransactions:
				return await this.signAllTransactions(payload)

			default:
				return {
					data: null,
					error: {
						message: "something went wrong while getting response from dapp",
					},
				}
		}
	}

	async isSignedIn() {
		const providerItem = await this.getProviderAndToken()
		if (providerItem) {
			return {
				data: {
					isSignedIn: true,
					signInUrl: null,
				},
				error: null,
			}
		}
	}

	async connect(): Promise<DappServerResponse> {
		try {
			const providerItem = await this.getProviderAndToken()
			if (!providerItem)
				return {
					data: null,
					error: {
						message: `
							User not signed in to dapp yet. 
							Sign in with your favorite social 
							provider and come back to connect 🙂.
						`,
					},
				}

			const { payload } = this.encryptPayload(providerItem)

			return {
				data: {
					projectId: this.projectId,
					payload,
				},
				error: null,
			}
		} catch (e) {
			return {
				data: null,
				error: {
					message: `error connecting from dapp server. ${e}`,
				},
			}
		}
	}

	async disconnect(): Promise<DappServerResponse> {
		if (this.otaConfig.clearCookieOnDisconect) {
			await this.removeProviderAndToken()
		}
		return {
			data: null,
			error: null,
		}
	}

	async signTransaction({
		transaction,
	}: DappServerSignTransactionPayload): Promise<DappServerResponse> {
		try {
			const providerItem = await this.getProviderAndToken()
			if (!providerItem)
				throw new Error("could not get provider token from cookie")

			let { txString, isVersioned } = transaction

			const tx = deserializeOriginalTransaction(txString, isVersioned)

			const signedTx = await this.wallet.signTransaction(tx)

			txString = bs58.encode(signedTx.serialize({ requireAllSignatures: false }))

			const { payload } = this.encryptPayload({
				...providerItem,
				transaction: { txString, isVersioned },
			})

			return {
				data: {
					projectId: this.projectId,
					payload,
				},
				error: null,
			}
		} catch (e) {
			return {
				data: null,
				error: {
					message: `error connecting from dapp server. ${e}`,
				},
			}
		}
	}

	async signAllTransactions({
		transactions,
	}: DappServerSignAllTransactionsPayload): Promise<DappServerResponse> {
		try {
			const providerItem = await this.getProviderAndToken()
			if (!providerItem)
				throw new Error("could not get provider token from cookie")

			const allTransactions = await Promise.all(
				transactions.map(async (transaction) => {
					let { txString, isVersioned } = transaction

					const tx = deserializeOriginalTransaction(txString, isVersioned)

					const signedTx = await this.wallet.signTransaction(tx)

					txString = bs58.encode(signedTx.serialize({ requireAllSignatures: false }))

					return { txString, isVersioned }
				})
			)

			const { payload } = this.encryptPayload({
				...providerItem,
				transactions: allTransactions,
			})

			return {
				data: {
					projectId: this.projectId,
					payload,
				},
				error: null,
			}
		} catch (e) {
			return {
				data: null,
				error: {
					message: `error connecting from dapp server. ${e}`,
				},
			}
		}
	}

	encryptPayload(payload: DappPayload) {
		const payloadString = JSON.stringify(payload)

		const nonce = nacl.randomBytes(nacl.secretbox.nonceLength)

		const encryptedPayload = nacl.secretbox(
			util.decodeUTF8(payloadString),
			nonce,
			util.decodeBase64(this.projectSecret)
		)

		const combined = new Uint8Array(nonce.length + encryptedPayload.length)

		combined.set(nonce)
		combined.set(encryptedPayload, nonce.length)

		return {
			payload: util.encodeBase64(combined),
		}
	}
}

export type DappPayload =
	| DappConnectData
	| DappSignTransactionData
	| DappSignAllTransactionData
