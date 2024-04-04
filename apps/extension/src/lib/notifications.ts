import {
	NOTIFICATION_KEYRING_STORE_CREATED,
	NOTIFICATION_KEYRING_STORE_LOCKED,
	NOTIFICATION_KEYRING_STORE_UNLOCKED,
	getLogger,
	type Notification,
	NOTIFICATION_SIGNIN_SUCCESSFUL,
	NOTIFICATION_SOLANA_SPL_TOKENS_DID_UPDATE,
	NOTIFICATION_ACTIVE_WALLET_UPDATED,
	NOTIFICATION_KEYRING_DERIVED_WALLET,
	NOTIFICATION_KEYRING_STORE_RESET,
	NOTIFICATION_APPROVED_ORIGINS_UPDATE,
	NOTIFICATION_SIGNOUT_SUCCESSFUL,
	NOTIFICATION_DELEGATE_WALLET_UPDATED,
} from "@valet/lib";
import { KeyringStoreState } from "@valet/background";
import { walletStore } from "./stores";

const logger = getLogger("notifications-provider");

export const notificationsHandler = async (notif: Notification) => {
	logger.debug(`received notification ${notif.name}`, notif);

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
			await handleSignoutSuccessful(notif);
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
		case NOTIFICATION_DELEGATE_WALLET_UPDATED:
			handleDelegateWalletUpdated(notif);
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
	walletStore.allWallets.init();
	walletStore.updateActiveWallet(notif.data.activeWallet);
	walletStore.state.set(KeyringStoreState.Unlocked);
};

const handleKeyringStoreLocked = () => {
	walletStore.state.set(KeyringStoreState.Locked);
};

const handleKeyringStoreUnlocked = async (notif: Notification) => {
	walletStore.allWallets.init();
	walletStore.updateActiveWallet(notif.data.activeWallet);
	walletStore.delegate.set(notif.data.delegateWallet)
	walletStore.state.set(KeyringStoreState.Unlocked);
};

const handleSigninSuccessful = async () => {
	walletStore.init();
};

const handleSignoutSuccessful = async (notif: Notification) => {
	walletStore.init();
};

const handleSolanaSplTokensDidUpdate = async (notif: Notification) => {
	walletStore.tokens.updateTokens(notif.data.customSplTokenAccounts);
};

const handleActiveWalletUpdated = async (notif: Notification) => {
	walletStore.updateActiveWallet(notif.data.activeWallet);
};

const handleDelegateWalletUpdated = async(notif: Notification) => {
	walletStore.delegate.set(notif.data.delegateWallet)
}

const handleReset = () => {
	walletStore.state.set(KeyringStoreState.NeedsOnboarding);
};

const handleApprovedOriginsUpdate = (notif: Notification) => {
	// approvedOriginStore.set(notif.data.approvedOrigins);
};

const handleKeyringDerivedWallet = async () => {
	// await initializeAndSetWalletStore();
};
