import { Session, SupabaseClient, createClient } from "@supabase/supabase-js";
import { Database } from "./schema";
import {
	BrowserRuntimeCommon,
	BrowserRuntimeExtension,
	TabListener,
} from "../browser";
import { parseUrlHash } from "../helpers";
import EventEmitter from "eventemitter3";
import { BACKEND_EVENT, NOTIFICATION_SIGNIN_SUCCESSFUL } from "../constants";
import * as crypto from "../keyring/crypto";
import * as bs58 from "bs58";
import { SUCCESS_RESPONSE } from "../backend/core";

const SUPABASE_URL = ""; // ! HARD CODED SUPABASE_URL
const SUPABASE_ANON_KEY = ""; // ! HARD CODED SUPABASE_ANON_KEY

export class ValetDB {
	private _supabase: SupabaseClient<Database>;
	private _session: Session | undefined;
	private _mnemonic: string | undefined;

	constructor(private events: EventEmitter) {
		this._supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
	}

	private get userId(): string | undefined {
		if (!this._session) {
			return;
		} else {
			return this._session.user.id;
		}
	}

	// gets user data from the session if any
	private get userData(): ValetUser | undefined {
		const session = this._session;
		if (!session) return;
		const user = session.user;
		return {
			email: user.user_metadata.email,
			name: user.user_metadata.name,
			avatar: user.user_metadata.avatar_url,
		};
	}

	get isMnemomicInDb() {
		if (this._mnemonic) return true;
		return false;
	}

	// tries to get user data from session first, if not, get persisted user data
	async getUserData(): Promise<ValetUser> {
		if (this.userData) return this.userData;
		return await LocalStorageDb.get(KEY_USER_DATA_STORE);
	}

	async signIn() {
		await this._startSignIn();
	}

	async signOut() {
		await this._supabase.auth.signOut();
		await this._reset();
	}

	async setMnemonic(mnemonic: string, password: string): Promise<string> {
		const encryptedText = await this._encryptMnemonic(mnemonic, password);
		return await this._setMnemonicInDb(encryptedText);
	}

	async getMnemonic(password: string): Promise<string> {
		if (!this.userId) throw new Error("No active session");

		const encryptedMnemonic = await this._getMnemonicFromDb(this.userId);
		if (!encryptedMnemonic) throw new Error("No mnemonic set");

		return await this._decryptMnemonic(encryptedMnemonic, password);
	}

	async persist() {
		await this._setUserData();
	}

	private async _reset() {
		await LocalStorageDb.clear();
		this._session = undefined;
		this._mnemonic = undefined;
	}

	private async _setUserData(): Promise<string> {
		const userData = this.userData;
		if (!userData) throw Error("No user data");
		await LocalStorageDb.set(KEY_USER_DATA_STORE, userData);
		return SUCCESS_RESPONSE;
	}

	private _setSession = (sessionToken: SetSessionToken): Promise<string> => {
		return new Promise(async (resolve, reject) => {
			try {
				const { data, error } =
					await this._supabase.auth.setSession(sessionToken);
				if (error) {
					reject(new Error("Error occured while setting session"));
				}
				const session = data.session;
				if (session) {
					try {
						this._mnemonic = await this._getMnemonicFromDb(session.user.id);
						this._session = session;
						resolve(SUCCESS_RESPONSE);
					} catch (e) {
						reject(e);
					}
				}
				reject("No valid session");
			} catch (err) {
				reject(err);
			}
		});
	};

	private _setMnemonicInDb = async (encyptedMnemonic: string) => {
		const { statusText, error } = await this._supabase
			.from("keydata")
			.insert({ mnemonic: encyptedMnemonic });
		if (error) {
			throw new Error(error.message);
		}
		this._mnemonic = encyptedMnemonic;
		return statusText;
	};

	private async _encryptMnemonic(
		mnemonic: string,
		password: string
	): Promise<string> {
		const payload = await crypto.encrypt(mnemonic, password);
		const encryptedMnemonic = bs58.encode(Buffer.from(JSON.stringify(payload)));
		return encryptedMnemonic;
	}

	private async _decryptMnemonic(
		encryptedMnemonic: string,
		password: string
	): Promise<string> {
		const decodedMnemonicBuffer = bs58.decode(encryptedMnemonic);
		const encryptedPayload: crypto.SecretPayload = JSON.parse(
			Buffer.from(decodedMnemonicBuffer).toString()
		);
		const mnemonic = await crypto.decrypt(encryptedPayload, password);
		return mnemonic;
	}

	private _getMnemonicFromDb = async (userId: string) => {
		if (this._mnemonic) return this._mnemonic;
		const { data, error } = await this._supabase
			.from("keydata")
			.select("mnemonic")
			.eq("user_id", userId)
			.maybeSingle();
		if (error) {
			throw new Error(error.message);
		}
		if (data && data.mnemonic) {
			this._mnemonic = data.mnemonic;
		}
		return this._mnemonic;
	};

	private _signInUrl = (): Promise<[string, string]> => {
		const redirectUrl = chrome.identity.getRedirectURL();
		return new Promise(async (resolve, reject) => {
			try {
				const { data, error } = await this._supabase.auth.signInWithOAuth({
					provider: "google",
					options: { redirectTo: redirectUrl },
				});

				if (error) {
					console.error("supabase error:", error.message);
					reject(error);
				} else {
					resolve([data.url, redirectUrl]);
				}
			} catch (err) {
				reject(err);
			}
		});
	};

	private _startSignIn = async () => {
		const [signInUrl, redirectUrl] = await this._signInUrl();
		const signInRedirectUrlListener = async (
			tabId: number,
			changeInfo: chrome.tabs.TabChangeInfo,
			tab: chrome.tabs.Tab
		) => {
			if (changeInfo.url?.startsWith(redirectUrl)) {
				try {
					await this._finishSignIn(changeInfo.url);
					this.events.emit(BACKEND_EVENT, {
						name: NOTIFICATION_SIGNIN_SUCCESSFUL,
					});
				} catch (e) {}
				await LoginListener.remove(signInRedirectUrlListener);
			}
		};
		// add signin listener
		await LoginListener.add(signInUrl, signInRedirectUrlListener);
	};

	private _finishSignIn(url: string): Promise<string> {
		return new Promise(async (resolve, reject) => {
			const hashMap = parseUrlHash(url);
			const access_token = hashMap.get("access_token");
			const refresh_token = hashMap.get("refresh_token");

			if (access_token && refresh_token) {
				try {
					await this._setSession({
						access_token,
						refresh_token,
					});
					chrome.tabs.update({
						url: "https://example.com", // todo: should correct this to show the proper url
					});
					resolve(SUCCESS_RESPONSE);
				} catch (e) {
					reject(e);
				}
			} else {
				reject(new Error(`no session tokens found in URL hash`));
			}
		});
	}
}
const KEY_USER_DATA_STORE = "user-data-store";

export class LocalStorageDb {
	static async get(key: string): Promise<any> {
		return await BrowserRuntimeCommon.getLocalStorage(key);
	}

	static async set(key: string, value: any): Promise<void> {
		await BrowserRuntimeCommon.setLocalStorage(key, value);
	}

	static async clear(): Promise<void> {
		await BrowserRuntimeCommon.clearLocalStorage();
	}
}

class LoginListener {
	static async add(url: string, listener: TabListener) {
		BrowserRuntimeExtension.openTabWithUpdateListener({ url }, listener);
	}

	static async remove(listener: TabListener) {
		await BrowserRuntimeExtension.removeTabUpdateListener(listener);
	}
}

export interface SetSessionToken {
	access_token: string;
	refresh_token: string;
}

export interface ValetUser {
	name: string;
	email: string;
	avatar: string;
}
