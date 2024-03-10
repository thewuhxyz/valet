import { BackgroundRequest } from "$lib/background-client";
import { type KeyringStoreState, type WalletPublicKey } from "@valet/lib";
import { derived, writable } from "svelte/store";
import { initTokensAndMetadata } from "./token";
import { fetchRecentSolanaTransactionDetails } from "$lib/helpers";

export const keyringStoreState = writable<KeyringStoreState>();
export const walletStore = writable<WalletPublicKey | undefined>();
export const activeWalletStore = writable<string | undefined>();
export const approvedOriginStore = writable<string[]>();

const hdKeysToNameMap = derived(walletStore, (walletStore) => {
	if (!walletStore) return;
	const hdWalletMap = new Map<string, string>();
	walletStore.hdPublicKeys.forEach((namedPubkey) => {
		hdWalletMap.set(namedPubkey.publicKey, namedPubkey.name);
	});
	return hdWalletMap;
});

const importedKeysToNameMap = derived(walletStore, (walletStore) => {
	if (!walletStore) return;
	const importedKeysMap = new Map<string, string>();
	walletStore.hdPublicKeys.forEach((namedPubkey) => {
		importedKeysMap.set(namedPubkey.publicKey, namedPubkey.name);
	});
	return importedKeysMap;
});

export const allKeys = derived(
	[hdKeysToNameMap, importedKeysToNameMap],
	([hdKeysToNameMap, importedKeysToNameMap]) => {
		if (!hdKeysToNameMap && !importedKeysToNameMap) return;
		let hdKeys: Map<string, string>, importedKeys: Map<string, string>;
		hdKeys = hdKeysToNameMap ? hdKeysToNameMap : new Map();
		importedKeys = importedKeysToNameMap ? importedKeysToNameMap : new Map();
		return new Map([...hdKeys, ...importedKeys]);
	}
);

export const activeWalletWithName = derived(
	[activeWalletStore, allKeys],
	([activeWallet, allKeys]) => {
		if (!activeWallet) return;
		if (!allKeys) return;
		const name = allKeys.get(activeWallet);
		if (!name) return [activeWallet, "Unnamed Wallet"] as [string, string];
		return [activeWallet, name] as [string, string];
	}
);

export const recentTxSignatures = derived(
	activeWalletStore,
	async (activeWallet) => {
		if (!activeWallet) return;
		// no need for try-catch: error already handled
		const recentTransactions =
			await fetchRecentSolanaTransactionDetails(activeWallet);
		const recentSignatures = recentTransactions.map((tx) => {
			return tx.signature;
		});
		return recentSignatures;
	}
);

export const initializeAndSetKeyringStoreState = async () => {
	const state = await BackgroundRequest.keyringStoreState();
	keyringStoreState.set(state);
};

export const initializeAndSetWalletStore = async () => {
	try {
		const publicKeys = await BackgroundRequest.readAllPublicKeys();
		walletStore.set(publicKeys);
	} catch (e) {
		walletStore.set(undefined);
	}
};

export const initializeAndSetActiveWalletStore = async () => {
	try {
		const activeWallet = await BackgroundRequest.getActiveWallet();

		if (!activeWallet) {
			activeWalletStore.set(undefined);
			return;
		}
		await setActiveWalletAndRefreshTokens(activeWallet);
	} catch (e) {
		activeWalletStore.set(undefined);
	}
};

export const setActiveWalletAndRefreshTokens = async (activeWallet: string) => {
	activeWalletStore.set(activeWallet);
	try {
		await initTokensAndMetadata(activeWallet);
	} catch (e) {
		console.error("error occured initing tokens");
	}
};
