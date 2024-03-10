import {
	initializeAndSetActiveWalletStore,
	initializeAndSetKeyringStoreState,
	initializeAndSetWalletStore,
} from "$lib/stores/state-store";
import { notificationsHandler } from "$lib/notifications";
import "./app.pcss";
import App from "./App.svelte";
import { setupClient } from "@valet/lib";
import { initializeAndSetUserStore } from "$lib/stores/user-store";
import { initializeAndSetMnemonicStore } from "$lib/stores/mnemonic-store";
import { tokenRegistry } from "$lib/stores/token";

(async () => {
	setupClient(notificationsHandler);
	await tokenRegistry.setTokenRegistry();
	await initializeAndSetKeyringStoreState();
	await initializeAndSetUserStore();
	await initializeAndSetMnemonicStore();
	await initializeAndSetActiveWalletStore();
	await initializeAndSetWalletStore();
})();

const app = new App({
	target: document.getElementById("app")!,
});

export default app;
