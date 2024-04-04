import { CookieSerializeOptions } from "cookie"
import { Provider } from "../protocol"
import { Wallet } from "@coral-xyz/anchor"

export interface OtaClientConfig {
	wallet: Wallet
	cookie: CookieMethods
	clearCookieOnDisconect?: boolean
}

export type CookieOptions = Partial<CookieSerializeOptions>

export type CookieMethods = {
	get?: (
		key: string
	) => Promise<string | null | undefined> | string | null | undefined
	set?: (
		key: string,
		value: string,
		options: CookieOptions
	) => Promise<void> | void
	remove?: (key: string, options: CookieOptions) => Promise<void> | void
}

export interface ProviderItem {
	provider: Provider
	providerToken: string
}

export type DappServerResponse = {
	data: {
		projectId: string
		payload: string
	} | null
	error: {
		message: string
	} | null
}
