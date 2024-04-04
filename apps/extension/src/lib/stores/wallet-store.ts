import { BackgroundRequest } from "$lib/background-client"
import { RPC_DEVNET_ENDPOINT, getLogger } from "@valet/lib"
import { type KeyringStoreState, type WalletPublicKey } from "@valet/background"
import { derived, writable } from "svelte/store"
import { UserStore } from "./user-store"
import { BackgroundWallet } from "$lib/wallet"
import { ActiveWallet, TokenSuperStore } from "@valet/ui"
import { toast } from "svelte-sonner"
import { Toast } from "$lib/components/valet-ui/toast"
import { clusterApiUrl } from "@solana/web3.js"

const logger = getLogger("state & wallet store:")

class KeyringState {
	private state = writable<KeyringStoreState | undefined>(undefined)
	set = this.state.set
	subscribe = this.state.subscribe

	constructor() {}

	async init() {
		try {
			const state = await BackgroundRequest.keyringStoreState()
			this.set(state)
		} catch (e: any) {
			toast(`❌ Error setting keyring state. &{}`)
		}
	}
}

class DelegateWallet {
	private delegate = writable<string | undefined>(undefined)
	set = this.delegate.set
	subscribe = this.delegate.subscribe

	constructor() {}

	async init() {
		try {
			const delegate = await BackgroundRequest.getDelegateWallet()
			this.set(delegate)
		} catch (e) {
			logger.debug("error setting delegate:", e)
		}
	}

	// maybe should update with notification with set??
	async updateDelegate(newDelegate: string) {
		try {
			await BackgroundRequest.updateDelegateWallet(newDelegate)
		} catch (e) {
			logger.debug("error updating delegate:", e)
		}
	}
}

class OtaWallet {
	private ota = writable<string | undefined>(undefined)
	set = this.ota.set
	subscribe = this.ota.subscribe

	constructor() {}

	async init() {
		try {
			const otaPubkey = await BackgroundRequest.getOtaPubkey()
			this.set(otaPubkey)
		} catch (e) {
			Toast.fail(e)
		}
	}

	isOta(activeWallet: ActiveWallet) {
		return derived([activeWallet, this.ota], ([activeWallet, otaPubkey]) => {
			return activeWallet === otaPubkey
		})
	}
}

class AllWallets {
	wallets = writable<WalletPublicKey | undefined>()
	set = this.wallets.set
	subscribe = this.wallets.subscribe

	constructor() {}

	async init() {
		try {
			this.set(await BackgroundRequest.readAllPublicKeys())
		} catch (e) {
			console.log("error getting pubkeys:", e)
			this.set(undefined)
		}
	}

	get allKeys() {
		return this.derived.allKeys
	}

	get allKeyNoOta() {
		return this.derived.allKeysNoOta
	}

	get derived() {
		const otaKeyToNameMap = derived(this, (walletStore) => {
			if (!walletStore) return
			const otaWalletMap = new Map<string, string>()
			walletStore.otaPublicKey.forEach((namedPubkey) => {
				otaWalletMap.set(namedPubkey.publicKey, namedPubkey.name)
			})
			return otaWalletMap
		})

		const hdKeysToNameMap = derived(this, (walletStore) => {
			if (!walletStore) return
			const hdWalletMap = new Map<string, string>()
			walletStore.hdPublicKeys.forEach((namedPubkey) => {
				hdWalletMap.set(namedPubkey.publicKey, namedPubkey.name)
			})
			return hdWalletMap
		})

		const importedKeysToNameMap = derived(this, (walletStore) => {
			if (!walletStore) return
			const importedKeysMap = new Map<string, string>()
			walletStore.importedPublicKeys.forEach((namedPubkey) => {
				importedKeysMap.set(namedPubkey.publicKey, namedPubkey.name)
			})
			return importedKeysMap
		})

		const allKeys = derived(
			[otaKeyToNameMap, hdKeysToNameMap, importedKeysToNameMap],
			([otaKeyToNameMap, hdKeysToNameMap, importedKeysToNameMap]) => {
				if (!hdKeysToNameMap && !importedKeysToNameMap) return
				let hdKeys: Map<string, string>,
					importedKeys: Map<string, string>,
					otaKeys: Map<string, string>
				hdKeys = hdKeysToNameMap ? hdKeysToNameMap : new Map()
				importedKeys = importedKeysToNameMap ? importedKeysToNameMap : new Map()
				otaKeys = otaKeyToNameMap ? otaKeyToNameMap : new Map()
				return new Map([...otaKeys, ...hdKeys, ...importedKeys])
			}
		)

		const allKeysNoOta = derived(
			[hdKeysToNameMap, importedKeysToNameMap],
			([hdKeysToNameMap, importedKeysToNameMap]) => {
				if (!hdKeysToNameMap && !importedKeysToNameMap) return
				let hdKeys: Map<string, string>,
					importedKeys: Map<string, string>,
					otaKeys: Map<string, string>
				hdKeys = hdKeysToNameMap ? hdKeysToNameMap : new Map()
				importedKeys = importedKeysToNameMap ? importedKeysToNameMap : new Map()
				return new Map([...hdKeys, ...importedKeys])
			}
		)
		return { allKeys, allKeysNoOta }
	}

	getActiveWalletWithName(activeWallet: ActiveWallet) {
		return derived(
			[activeWallet, this.derived.allKeys],
			([activeWallet, allKeys]) => {
				if (!activeWallet) return
				if (!allKeys) return
				const name = allKeys.get(activeWallet)
				if (!name) return [activeWallet, "..."] as [string, string]
				return [activeWallet, name] as [string, string]
			}
		)
	}
}

export class Wallet extends ActiveWallet {
	allWallets: AllWallets
	state: KeyringState
	user: UserStore
	delegate: DelegateWallet
	otaWallet: OtaWallet

	constructor() {
		super(
			new TokenSuperStore({
				getCustomSplTokenAccounts: BackgroundRequest.getCustomSplTokenAccounts,
				getCustomSplMetadataUri: BackgroundRequest.getCustomSplMetadataUri,
				// connectionUrl: clusterApiUrl("devnet"),
				connectionUrl: RPC_DEVNET_ENDPOINT,
			})
		)
		this.allWallets = new AllWallets()
		this.state = new KeyringState()
		this.user = new UserStore()
		this.delegate = new DelegateWallet()
		this.otaWallet = new OtaWallet()
	}

	get allKeys() {
		return this.allWallets.allKeys
	}

	get allKeysNoOta() {
		return this.allWallets.allKeyNoOta
	}

	get activeWalletWithName() {
		return this.allWallets.getActiveWalletWithName(this)
	}

	async init() {
		await Promise.all([
			this.user.init(),
			this.allWallets.init(),
			this.otaWallet.init(),
			this.delegate.init(),
			this.state.init(),
			this.initActiveWallet(),
		])
	}

	async initActiveWallet() {
		await super.init(await BackgroundRequest.getActiveWallet())
	}

	get isOta() {
		return this.otaWallet.isOta(this)
	}

	get wallet() {
		return derived([this.activeWallet, this.isOta], ([activeWallet, ota]) => {
			if (!activeWallet) return
			return new BackgroundWallet(activeWallet, ota)
		})
	}
}

export const walletStore = new Wallet()
