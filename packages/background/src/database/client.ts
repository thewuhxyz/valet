import { Session, SupabaseClient, createClient } from "@supabase/supabase-js"
import { Database } from "./schema"
import {
	BrowserRuntimeCommon,
	BrowserRuntimeExtension,
	TabListener,
	getLogger,
	BACKEND_EVENT,
	NOTIFICATION_SIGNIN_SUCCESSFUL,
	OTA_SERVER_DOMAIN,
} from "@valet/lib"
import { ValetUser, intoProvider } from "@valet/ota-client"
import EventEmitter from "eventemitter3"
import * as crypto from "../keyring/crypto"
import * as bs58 from "bs58"
import { OAuth2Client } from "google-auth-library"
import { PasswordManager } from "../backend/password"
import { OtaClient } from "./ota"

const logger = getLogger("valetDb@supabase")

export class ValetDB {
	private _supabase: SupabaseClient<Database>
	private _googleOauthClient: OAuth2Client
	private _otaClient: OtaClient
	private _session?: Session
	private _mnemonic?: string
	private _userData?: UserData
	private _idToken?: string

	// todo: use backend events to take actions e.g lock, unlock
	constructor(private events: EventEmitter) {
		this._supabase = createClient<Database>(
			process.env.SUPABASE_URL!,
			process.env.SUPABASE_ANON_KEY!
		)
		this._googleOauthClient = new OAuth2Client({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			redirectUri: chrome.identity.getRedirectURL(),
		})
		this._otaClient = new OtaClient(events)
	}

	private get userId(): string | undefined {
		if (!this._session) {
			return
		} else {
			return this._session.user.id
		}
	}

	async transferDelegateServer(
		from: string,
		to: string,
		password: string
	): Promise<[string, string]> {
		const otaPubkey = await this.publicKey()

		if (from === to) throw new Error("same keys were provided in the request")
		if (from !== otaPubkey && to !== otaPubkey)
			throw new Error(
				"Delegate transfer does not involve server. Try local transfer instead"
			)

		let direction: string, delegate: string
		if (from === otaPubkey) {
			direction = "from-server"
			delegate = to
		} else {
			direction = "to-server"
			delegate = from
		}

		if (!this._userData) throw new Error("user data is not defined")
		if (!this._idToken) throw new Error("No Id Token Present. Sign in again")

		const isIdTokenValid = await this.isIdTokenValid()
		if (!isIdTokenValid)
			throw new Error("Id Token is not Valid. Try signing in again")

		const res = await fetch(
			`${OTA_SERVER_DOMAIN}/extension/transfer-delegate`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					providerToken: this._idToken,
					hash: password,
					provider: this._userData.provider,
					delegate,
					direction,
				}),
			}
		).catch(() => undefined)

		if (!res) throw new Error("Error occured while sending request")

		const { data, error } = await res.json()

		if (error) throw new Error(error.message)

		return [delegate, data.transaction]
	}

	async transferDelegateLocal(from: string, to: string) {
		if (from === to) throw new Error("same keys were provided in the request")
		const otaPubkey = await this.publicKey()
		if (from === otaPubkey || to === otaPubkey)
			throw new Error(
				"OTA Server was selected. Try server delegate transfer instead"
			)
		return this._otaClient.transferDelegate(await this.valetUser(), from, to)
	}

	async prepareTransaction(transaction: string, isVersioned: boolean) {
		return await this._otaClient.prepareOtaTransaction(transaction, isVersioned)
	}

	async publicKey() {
		return this._otaClient.publicKey(await this.valetUser())
	}

	private async valetUser(): Promise<ValetUser> {
		const { provider, providerId } = await this.getUserData()
		const prov = intoProvider(provider)

		if (!prov) throw new Error("Not a valid provider")
		return {
			provider: prov,
			providerId,
		}
	}

	get isMnemomicInDb() {
		if (this._mnemonic) return true
		return false
	}

	async signIn() {
		await this._startSignIn()
	}

	async signOut() {
		await this._supabase.auth.signOut()
		await this._reset()
	}

	async unlock(password: string) {
		this._userData = await this.getUserData()
	}

	async lock() {
		await this.persist()
	}

	async setMnemonic(mnemonic: string): Promise<string> {
		const encryptedText = await this._encryptMnemonic(mnemonic)
		return await this._setMnemonicInDb(encryptedText)
	}

	async getMnemonic(password: string): Promise<string> {
		if (!this.userId) throw new Error("No active session")

		const encryptedMnemonic = await this._getMnemonicFromDb(this.userId)
		if (!encryptedMnemonic) throw new Error("No mnemonic set")

		return await this._decryptMnemonic(encryptedMnemonic, password)
	}

	async isIdTokenValid() {
		try {
			if (!this._idToken) return false
			const tokens = await this._googleOauthClient.verifyIdToken({
				idToken: this._idToken,
			})
			const payload = tokens.getPayload()
			if (!payload) {
				this._idToken = undefined
				return false
			}
			return true
		} catch (e) {
			logger.debug("error occured while checking isIdTokenValid:", e)
			throw new Error("error occured checking if id token is valid")
		}
	}

	async getUserData(): Promise<UserData> {
		if (this._userData) return this._userData
		const userData = await LocalStorageDb.get(KEY_USER_DATA_STORE)
		if (!userData) throw new Error("error getting user data")
		this._userData = userData
		if (!this._userData) throw new Error("user data is not defined")
		return this._userData
	}

	private async _persistUserData() {
		if (!this._userData) return
		await LocalStorageDb.set(KEY_USER_DATA_STORE, this._userData)
	}

	async persist() {
		await this._persistUserData()
	}

	private async _reset() {
		await LocalStorageDb.clear()
		this._userData = undefined
		this._session = undefined
		this._mnemonic = undefined
		this._idToken = undefined
	}

	private _setSession = async (idToken: string): Promise<string> => {
		try {
			const { data } = await this._supabase.auth.signInWithIdToken({
				provider: "google",
				token: idToken,
			})
			const session = data.session
			if (!session) throw new Error("no session from id token auth")
			this._mnemonic = await this._getMnemonicFromDb(session.user.id)
			this._session = session
			this._idToken = idToken
			const user = session.user
			this._userData = {
				email: user.user_metadata.email,
				name: user.user_metadata.name,
				avatar: user.user_metadata.avatar_url,
				provider: user.app_metadata.provider!,
				providerId: user.user_metadata.provider_id,
			}
			logger.debug("session:", session)
			return SUCCESS_RESPONSE
		} catch (e) {
			throw new Error("unable to set session")
		}
	}

	private _setMnemonicInDb = async (encyptedMnemonic: string) => {
		const { statusText, error } = await this._supabase
			.from("keydata")
			.insert({ mnemonic: encyptedMnemonic })
		if (error) {
			console.error("supabase error:", error.message)
			throw new Error(error.message)
		}
		this._mnemonic = encyptedMnemonic
		return statusText
	}

	private async _encryptMnemonic(mnemonic: string): Promise<string> {
		const payload = await PasswordManager.encrypt(mnemonic) // todo: use stronger encryption algo for db
		const encryptedMnemonic = bs58.encode(Buffer.from(JSON.stringify(payload)))
		return encryptedMnemonic
	}

	private async _decryptMnemonic(
		encryptedMnemonic: string,
		password: string
	): Promise<string> {
		const decodedMnemonicBuffer = bs58.decode(encryptedMnemonic)
		const encryptedPayload: crypto.SecretPayload = JSON.parse(
			Buffer.from(decodedMnemonicBuffer).toString()
		)
		logger.debug("decoded payload before decryption:", encryptedPayload)
		const mnemonic = await crypto.decrypt(encryptedPayload, password)
		return mnemonic
	}

	private _getMnemonicFromDb = async (userId: string) => {
		if (this._mnemonic) return this._mnemonic
		const { data, error } = await this._supabase
			.from("keydata")
			.select("mnemonic")
			.eq("user_id", userId)
			.maybeSingle()
		if (error) {
			console.error("supabase error:", error.message)
			throw new Error(error.message)
		}
		if (data && data.mnemonic) {
			this._mnemonic = data.mnemonic
		}
		return this._mnemonic
	}

	private _signInUrl = (): Promise<[string, string]> => {
		const redirectUrl = chrome.identity.getRedirectURL()
		return new Promise(async (resolve, reject) => {
			try {
				const { data, error } = await this._supabase.auth.signInWithOAuth({
					provider: "google",
					options: { redirectTo: redirectUrl },
				})

				if (error) {
					console.error("supabase error:", error.message)
					reject(error)
				} else {
					resolve([data.url, redirectUrl])
				}
			} catch (err) {
				reject(err)
			}
		})
	}

	private googleSignInUrl = (): string => {
		return this._googleOauthClient.generateAuthUrl({
			access_type: "offline",
			scope: "openid email profile",
		})
	}

	private _startSignIn = async () => {
		const googleSignInUrl = this.googleSignInUrl()
		const redirectUrl = chrome.identity.getRedirectURL()

		const signInRedirectUrlListener = async (
			tabId: number,
			changeInfo: chrome.tabs.TabChangeInfo,
			tab: chrome.tabs.Tab
		) => {
			if (changeInfo.url?.startsWith(redirectUrl)) {
				chrome.tabs.update({
					url: "https://example.com", // todo: change to valet loading page
				})
				try {
					await this._finishSignIn(changeInfo.url)
					this.events.emit(BACKEND_EVENT, {
						name: NOTIFICATION_SIGNIN_SUCCESSFUL,
					})
				} catch (e) {
					logger.error(e)
				}
				await LoginListener.remove(signInRedirectUrlListener)
			}
		}
		await LoginListener.add(googleSignInUrl, signInRedirectUrlListener)
	}

	private async _finishSignIn(url: string): Promise<string> {
		try {
			const code = new URL(url).searchParams.get("code")

			if (!code) throw new Error("Could not get code from callback")

			const { tokens } = await this._googleOauthClient.getToken(code)
			if (!tokens.id_token) throw new Error("no id token returned")

			await this._setSession(tokens.id_token)
			chrome.tabs.update({
				url: "chrome-extension://faenjjojpngbffdlomeomhmpojdkopbe/src/index.html",
			})
			return SUCCESS_RESPONSE
		} catch (e) {
			console.error("finish login error:", e)
			throw new Error("Failed to complete login")
		}
	}
}
const KEY_USER_DATA_STORE = "user-data-store"

export class LocalStorageDb {
	static async get(key: string): Promise<any> {
		return await BrowserRuntimeCommon.getLocalStorage(key)
	}

	static async set(key: string, value: any): Promise<void> {
		await BrowserRuntimeCommon.setLocalStorage(key, value)
	}

	static async remove(key: string): Promise<void> {
		await BrowserRuntimeCommon.removeLocalStorage(key)
	}

	static async clear(): Promise<void> {
		await BrowserRuntimeCommon.clearLocalStorage()
	}
}

class LoginListener {
	static async add(url: string, listener: TabListener) {
		BrowserRuntimeExtension.openTabWithUpdateListener({ url }, listener)
	}

	static async remove(listener: TabListener) {
		await BrowserRuntimeExtension.removeTabUpdateListener(listener)
	}
}

export interface SetSessionToken {
	access_token: string
	refresh_token: string
}

export interface UserData {
	name: string
	email: string
	avatar: string
	provider: string
	providerId: string
}

const SUCCESS_RESPONSE = "success"
