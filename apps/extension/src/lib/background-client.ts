import {
	UI_RPC_METHOD_SIGN_IN,
	UI_RPC_METHOD_SIGN_OUT,
	getBackgroundClient,
	type KeyringStoreState,
	UI_RPC_METHOD_KEYRING_STORE_STATE,
	UI_RPC_METHOD_KEYRING_STORE_MNEMONIC_CREATE,
	UI_RPC_METHOD_KEYRING_STORE_CREATE,
	DerivationPath,
	UI_RPC_METHOD_KEYRING_STORE_UNLOCK,
	UI_RPC_METHOD_KEYRING_STORE_CREATE_NEW,
	UI_RPC_METHOD_KEYRING_STORE_CREATE_EXISTING,
	SOLANA_CONNECTION_RPC_CUSTOM_SPL_TOKEN_ACCOUNTS,
	SolanaSplConnection,
	type CustomSplTokenAccountsResponseString,
	UI_RPC_METHOD_WALLET_DATA_ACTIVE_WALLET,
	type WalletPublicKey,
	UI_RPC_METHOD_KEYRING_STORE_READ_ALL_PUBKEYS,
	UI_RPC_METHOD_CONNECTION_URL_READ,
	type NamedPublicKey,
	type SolanaTokenAccountWithKeyAndProgramIdString,
	type TokenMetadataString,
	type SplNftMetadataString,
	SOLANA_CONNECTION_RPC_CUSTOM_SPL_METADATA_URI,
	type ValetUser,
	UI_RPC_METHOD_GET_USER_DATA,
	UI_RPC_METHOD_IS_MNEMONIC_IN_DB,
	UI_RPC_METHOD_KEYRING_STORE_LOCK,
	getBackgroundSolanaClient,
	getBackgroundResponseClient,
} from "@valet/lib";

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

	static async getActiveWallet(): Promise<string> {
		const background = getBackgroundClient();
		return await background.request({
			method: UI_RPC_METHOD_WALLET_DATA_ACTIVE_WALLET,
			params: [],
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

	static async getUserData(): Promise<ValetUser> {
		const background = getBackgroundClient();
		return await background.request({
			method: UI_RPC_METHOD_GET_USER_DATA,
			params: [],
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
