import {
	UI_RPC_METHOD_SIGN_IN,
	UI_RPC_METHOD_SIGN_OUT,
	UI_RPC_METHOD_KEYRING_STORE_STATE,
	UI_RPC_METHOD_KEYRING_STORE_MNEMONIC_CREATE,
	UI_RPC_METHOD_KEYRING_STORE_CREATE,
	getLogger,
	UI_RPC_METHOD_KEYRING_STORE_UNLOCK,
	UI_RPC_METHOD_KEYRING_STORE_CREATE_NEW,
	UI_RPC_METHOD_KEYRING_STORE_CREATE_EXISTING,
	SOLANA_CONNECTION_RPC_CUSTOM_SPL_TOKEN_ACCOUNTS,
	UI_RPC_METHOD_WALLET_DATA_ACTIVE_WALLET,
	UI_RPC_METHOD_KEYRING_STORE_READ_ALL_PUBKEYS,
	UI_RPC_METHOD_CONNECTION_URL_READ,
	SOLANA_CONNECTION_RPC_CUSTOM_SPL_METADATA_URI,
	UI_RPC_METHOD_GET_USER_DATA,
	UI_RPC_METHOD_IS_MNEMONIC_IN_DB,
	UI_RPC_METHOD_KEYRING_STORE_LOCK,
	UI_RPC_METHOD_SOLANA_SIGN_TRANSACTION,
	UI_RPC_METHOD_SOLANA_PREPARE_OTA_TRANSACTION,
	UI_RPC_METHOD_WALLET_DATA_DELEGATE_WALLET,
	UI_RPC_METHOD_WALLET_DATA_ACTIVE_WALLET_UPDATE,
	UI_RPC_METHOD_WALLET_DATA_DELEGATE_WALLET_UPDATE,
	UI_RPC_METHOD_OTA_READ_PUBKEY,
	UI_RPC_METHOD_OTA_TRANSFER_DELEGATE_LOCAL,
	UI_RPC_METHOD_OTA_TRANSFER_DELEGATE_SERVER,
} from "@valet/lib";
import {
	SolanaSplConnection,
	type CustomSplTokenAccountsResponseString,
	type SolanaTokenAccountWithKeyAndProgramIdString,
	type TokenMetadataString,
	type SplNftMetadataString,
} from "@valet/token";
import {
	getBackgroundClient,
	type KeyringStoreState,
	DerivationPath,
	type WalletPublicKey,
	type NamedPublicKey,
	type UserData,
	getBackgroundSolanaClient,
	getBackgroundResponseClient,
} from "@valet/background";

const logger = getLogger("background client in svelte:");

export class BackgroundRequest {
	static async getActiveWalletWithName(): Promise<NamedPublicKey> {
		let activePublicKey = await BackgroundRequest.getActiveWallet();
		let allPublicKeys = await BackgroundRequest.readAllPublicKeys();

		let result = allPublicKeys.hdPublicKeys.find(
			(pk) => pk.publicKey.toString() === activePublicKey
		);
		if (result) {
			return result;
		}
		result = allPublicKeys.importedPublicKeys.find(
			(pk) => pk.publicKey.toString() === activePublicKey
		);
		if (result) {
			return result;
		}

		throw new Error("Unable go get named active publickey");
	}

	static async signIn(): Promise<string> {
		const background = getBackgroundClient();
		return await background.request({
			method: UI_RPC_METHOD_SIGN_IN,
			params: [],
		});
	}

	static async signOut(): Promise<string> {
		const background = getBackgroundClient();
		return await background.request({
			method: UI_RPC_METHOD_SIGN_OUT,
			params: [],
		});
	}

	static async keyringStoreState(): Promise<KeyringStoreState> {
		const background = getBackgroundClient();
		return await background.request({
			method: UI_RPC_METHOD_KEYRING_STORE_STATE,
			params: [],
		});
	}

	static async isMnemonicInDb(): Promise<boolean> {
		const background = getBackgroundClient();
		return await background.request({
			method: UI_RPC_METHOD_IS_MNEMONIC_IN_DB,
			params: [],
		});
	}
	static async createMnemonic(): Promise<string> {
		const background = getBackgroundClient();
		return await background.request({
			method: UI_RPC_METHOD_KEYRING_STORE_MNEMONIC_CREATE,
			params: [],
		});
	}

	static async createKeyringStore(
		mnemonic: string,
		password: string
	): Promise<string> {
		const background = getBackgroundClient();
		const derivationPath: DerivationPath = "bip44-change";
		return await background.request({
			method: UI_RPC_METHOD_KEYRING_STORE_CREATE,
			params: [mnemonic, derivationPath, password],
		});
	}

	static async createKeyringStoreNew(
		mnemonic: string,
		password: string
	): Promise<string> {
		const background = getBackgroundClient();
		return await background.request({
			method: UI_RPC_METHOD_KEYRING_STORE_CREATE_NEW,
			params: [mnemonic, password],
		});
	}

	static async createKeyringStoreExisting(password: string): Promise<string> {
		const background = getBackgroundClient();
		return await background.request({
			method: UI_RPC_METHOD_KEYRING_STORE_CREATE_EXISTING,
			params: [password],
		});
	}

	static async unlock(password: string): Promise<string> {
		const background = getBackgroundClient();
		return await background.request({
			method: UI_RPC_METHOD_KEYRING_STORE_UNLOCK,
			params: [password],
		});
	}

	static async lock(): Promise<string> {
		const background = getBackgroundClient();
		return await background.request({
			method: UI_RPC_METHOD_KEYRING_STORE_LOCK,
			params: [],
		});
	}

	static async getCustomSplTokenAccounts(
		publicKey: string
	): Promise<CustomSplTokenAccountsResponseString> {
		const solanaBackground = getBackgroundSolanaClient();
		const resp = await solanaBackground.request({
			method: SOLANA_CONNECTION_RPC_CUSTOM_SPL_TOKEN_ACCOUNTS,
			params: [publicKey],
		});
		return SolanaSplConnection.customSplTokenAccountsFromJson(resp);
	}

	static async getCustomSplMetadataUri(
		tokens: Array<SolanaTokenAccountWithKeyAndProgramIdString>,
		tokenMetadata: Array<TokenMetadataString | null>
	): Promise<Array<[string, SplNftMetadataString]>> {
		const solanaBackground = getBackgroundSolanaClient();
		return await solanaBackground.request({
			method: SOLANA_CONNECTION_RPC_CUSTOM_SPL_METADATA_URI,
			params: [tokens, tokenMetadata],
		});
	}

	static async getOtaPubkey(): Promise<string> {
		const background = getBackgroundClient();
		return await background.request({
			method: UI_RPC_METHOD_OTA_READ_PUBKEY,
			params: [],
		});
	}

	static async getActiveWallet(): Promise<string> {
		const background = getBackgroundClient();
		return await background.request({
			method: UI_RPC_METHOD_WALLET_DATA_ACTIVE_WALLET,
			params: [],
		});
	}

	static async updateActiveWallet(newWallet: string): Promise<string> {
		const background = getBackgroundClient();
		return await background.request({
			method: UI_RPC_METHOD_WALLET_DATA_ACTIVE_WALLET_UPDATE,
			params: [newWallet],
		});
	}

	static async getDelegateWallet(): Promise<string> {
		const background = getBackgroundClient();
		return await background.request({
			method: UI_RPC_METHOD_WALLET_DATA_DELEGATE_WALLET,
			params: [],
		});
	}

	static async updateDelegateWallet(newWallet: string): Promise<string> {
		const background = getBackgroundClient();
		return await background.request({
			method: UI_RPC_METHOD_WALLET_DATA_DELEGATE_WALLET_UPDATE,
			params: [newWallet],
		});
	}

	static async readAllPublicKeys(): Promise<WalletPublicKey> {
		const background = getBackgroundClient();
		return await background.request({
			method: UI_RPC_METHOD_KEYRING_STORE_READ_ALL_PUBKEYS,
			params: [],
		});
	}

	static async getConnectionUrl(): Promise<string> {
		const background = getBackgroundClient();
		return await background.request({
			method: UI_RPC_METHOD_CONNECTION_URL_READ,
			params: [],
		});
	}

	static async getUserData(): Promise<UserData> {
		const background = getBackgroundClient();
		return await background.request({
			method: UI_RPC_METHOD_GET_USER_DATA,
			params: [],
		});
	}

	static async signTransaction(
		txStr: string,
		walletPublicKey: string
	): Promise<string> {
		const background = getBackgroundClient();
		return await background.request({
			method: UI_RPC_METHOD_SOLANA_SIGN_TRANSACTION,
			params: [txStr, walletPublicKey],
		});
	}

	static async prepareOtaTransaction(
		txStr: string,
		isVersioned: boolean
	): Promise<[string, string]> {
		const background = getBackgroundClient();
		return await background.request({
			method: UI_RPC_METHOD_SOLANA_PREPARE_OTA_TRANSACTION,
			params: [txStr, isVersioned],
		});
	}
	
	static async otaTransferDelegateLocal(from:string, to: string): Promise<string> {
		const background = getBackgroundClient();
		return await background.request({
			method: UI_RPC_METHOD_OTA_TRANSFER_DELEGATE_LOCAL,
			params: [from, to],
		});
	}
	
	static async otaTransferDelegateServer(from:string, to: string, password: string): Promise<string> {
		const background = getBackgroundClient();
		return await background.request({
			method: UI_RPC_METHOD_OTA_TRANSFER_DELEGATE_SERVER,
			params: [from, to, password],
		});
	}
}

export class UiResponse {
	static async approveOrigin(id: string, didApprove: boolean) {
		const uiResponseClient = getBackgroundResponseClient();
		return await uiResponseClient.response({ id, result: { didApprove } });
	}

	static async locked(id: string, didApprove: boolean) {
		const uiResponseClient = getBackgroundResponseClient();
		return await uiResponseClient.response({ id, result: { didApprove } });
	}

	static async approveMessage(id: string, didApprove: boolean) {
		const uiResponseClient = getBackgroundResponseClient();
		return await uiResponseClient.response({ id, result: { didApprove } });
	}

	static async approveTransaction(
		id: string,
		didApprove: boolean,
		transaction: string
	) {
		const uiResponseClient = getBackgroundResponseClient();
		return await uiResponseClient.response({
			id,
			result: { didApprove, transaction },
		});
	}
}
