import {
	NOTIFICATION_KEYRING_STORE_CREATED,
	NOTIFICATION_KEYRING_STORE_LOCKED,
	NOTIFICATION_KEYRING_STORE_UNLOCKED,
	type Notification,
	KeyringStoreState,
	NOTIFICATION_SIGNIN_SUCCESSFUL,
	NOTIFICATION_SOLANA_SPL_TOKENS_DID_UPDATE,
	NOTIFICATION_ACTIVE_WALLET_UPDATED,
	NOTIFICATION_KEYRING_DERIVED_WALLET,
	NOTIFICATION_KEYRING_STORE_RESET,
	NOTIFICATION_APPROVED_ORIGINS_UPDATE,
	NOTIFICATION_SIGNOUT_SUCCESSFUL,
	getLogger,
} from "@valet/lib";
import {
	approvedOriginStore,
	initializeAndSetWalletStore,
	keyringStoreState,
	setActiveWalletAndRefreshTokens,
} from "./stores/state-store";
import { initializeAndSetUserStore, userStore } from "./stores/user-store";
import {
	initializeAndSetMnemonicStore,
	mnemonicStore,
} from "./stores/mnemonic-store";
import { updateTokensAndMetadata } from "./stores/token";

const logger = getLogger("extension");

export const notificationsHandler = async (notif: Notification) => {
	logger.debug(`received notification: ${notif.name}`, notif);
	switch (notif.name) {
		case NOTIFICATION_KEYRING_STORE_CREATED:
			await handleKeyringStoreCreated(notif);
			break;
		case NOTIFICATION_KEYRING_STORE_LOCKED:
			handleKeyringStoreLocked();
			break;
		case NOTIFICATION_KEYRING_STORE_UNLOCKED:
			await handleKeyringStoreUnlocked(notif);
		case NOTIFICATION_SIGNIN_SUCCESSFUL:
			await handleSigninSuccessful();
			break;
		case NOTIFICATION_SIGNOUT_SUCCESSFUL:
			await handleSignoutSuccessful();
			break;
		case NOTIFICATION_SOLANA_SPL_TOKENS_DID_UPDATE:
			await handleSolanaSplTokensDidUpdate(notif);
			break;
		case NOTIFICATION_KEYRING_DERIVED_WALLET:
			handleKeyringDerivedWallet();
			break;
		case NOTIFICATION_ACTIVE_WALLET_UPDATED:
			handleActiveWalletUpdated(notif);
			break;
		case NOTIFICATION_KEYRING_STORE_RESET:
			handleReset();
			break;
		case NOTIFICATION_APPROVED_ORIGINS_UPDATE:
			handleApprovedOriginsUpdate(notif);
			break;
		default:
			break;
	}
};

const handleKeyringStoreCreated = async (notif: Notification) => {
	await setActiveWalletAndRefreshTokens(notif.data.activeWallet);
	await initializeAndSetWalletStore();
	keyringStoreState.set(KeyringStoreState.Unlocked);
};

const handleKeyringStoreLocked = () => {
	keyringStoreState.set(KeyringStoreState.Locked);
};

const handleKeyringStoreUnlocked = async (notif: Notification) => {
	await setActiveWalletAndRefreshTokens(notif.data.activeWallet);
	await initializeAndSetWalletStore();
	keyringStoreState.set(KeyringStoreState.Unlocked);
};
const handleSigninSuccessful = async () => {
	await initializeAndSetUserStore();
	await initializeAndSetMnemonicStore();
};

const handleSignoutSuccessful = async () => {
	userStore.set(undefined);
	mnemonicStore.set(undefined);
	keyringStoreState.set(KeyringStoreState.NeedsOnboarding);
};

const handleSolanaSplTokensDidUpdate = async (notif: Notification) => {
	await updateTokensAndMetadata(notif.data.customSplTokenAccounts);
};

const handleActiveWalletUpdated = async (notif: Notification) => {
	await setActiveWalletAndRefreshTokens(notif.data.activeWallet);
};

const handleReset = () => {
	keyringStoreState.set(KeyringStoreState.NeedsOnboarding);
};

const handleApprovedOriginsUpdate = (notif: Notification) => {
	approvedOriginStore.set(notif.data.approvedOrigins);
};

const handleKeyringDerivedWallet = async () => {
	await initializeAndSetWalletStore();
};
