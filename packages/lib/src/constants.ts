import { clusterApiUrl } from "@solana/web3.js";

export const UI_RPC_METHOD_HD_KEYRING_CREATE = "hd-keyring-create";
export const UI_RPC_METHOD_KEYRING_CREATE = "keyring-create";
export const UI_RPC_METHOD_KEYRING_STORE_KEEP_ALIVE =
	"keyring-store-keep-alive";
export const UI_RPC_METHOD_KEYRING_RESET_MNEMONIC = "reset-mnemonic";
export const UI_RPC_METHOD_KEYRING_AUTOLOCK_UPDATE = "autolock-update";

export const NOTIFICATION_SIGNIN_SUCCESSFUL = "notification-signin-successful"
export const NOTIFICATION_SIGNOUT_SUCCESSFUL = "notification-signout-successful"

export const UI_RPC_METHOD_WALLET_DATA_ACTIVE_WALLET = "valet-wallet-active";
export const UI_RPC_METHOD_WALLET_DATA_ACTIVE_WALLET_UPDATE =
	"valet-wallet-active-update";

export const RPC_MAINNET_BETA_ENDPOINT =
	clusterApiUrl("mainnet-beta");
export const RPC_DEVNET_ENDPOINT = clusterApiUrl("devnet");
export const RPC_LOCALNET_ENDPOINT = "http://127.0.0.1:8899";

//
// Messaging communication channel topics.
//
export const CHANNEL_POPUP_RPC = "valet-channel-popup-rpc";
export const CHANNEL_POPUP_RESPONSE = "valet-channel-popup-response";
export const CHANNEL_POPUP_NOTIFICATIONS = "valet-channel-popup-notifications";
export const CHANNEL_SOLANA_RPC_REQUEST = "valet-channel-solana-rpc-request";
export const CHANNEL_SOLANA_RPC_RESPONSE = "valet-channel-solana-rpc-response";
export const CHANNEL_SOLANA_NOTIFICATION = "valet-channel-solana-notification";
export const CHANNEL_SOLANA_CONNECTION_RPC_UI =
	"valet-channel-solana-connection-rpc-ui";
export const CHANNEL_SOLANA_CONNECTION_INJECTED_REQUEST =
	"valet-channel-solana-connection-injected-request";
export const CHANNEL_SOLANA_CONNECTION_INJECTED_RESPONSE =
	"valet-channel-solana-connection-injected-response";
//
// Trusted app API.
//
export const UI_RPC_METHOD_GET_USER_DATA = "valet-ui-rpc-method-get-user-data";
export const UI_RPC_METHOD_SIGN_IN = "valet-ui-rpc-method-sign-in";
export const UI_RPC_METHOD_SIGN_OUT = "valet-ui-rpc-method-sign-out";
export const UI_RPC_METHOD_GET_SESSION = "valet-ui-rpc-method-get-session";
export const UI_RPC_METHOD_GET_MNEMONIC_FROM_DB =
	"valet-ui-rpc-method-get-mnemonic-from-db";
export const UI_RPC_METHOD_IS_MNEMONIC_IN_DB =
	"valet-ui-rpc-method-is-mnemonic-in-db";
export const UI_RPC_METHOD_KEYRING_STORE_CREATE_NEW =
	"valet-ui-rpc-method-keyring-store-create-new";
export const UI_RPC_METHOD_KEYRING_STORE_CREATE_EXISTING =
	"valet-ui-rpc-method-keyring-store-create-existing";

export const UI_RPC_METHOD_APPROVED_ORIGINS_DELETE =
	"valet-ui-rpc-method-approved-origins-delete";
export const UI_RPC_METHOD_APPROVED_ORIGINS_READ =
	"valet-ui-rpc-method-approved-origins-read";
export const UI_RPC_METHOD_APPROVED_ORIGINS_UPDATE =
	"valet-ui-rpc-method-approved-origins-update";
export const UI_RPC_METHOD_BLOCKCHAINS_ENABLED_READ =
	"valet-ui-rpc-method-blockchains-enabled-read";
export const UI_RPC_METHOD_BLOCKCHAINS_ENABLED_ADD =
	"valet-ui-rpc-method-blockchains-enabled-add";
export const UI_RPC_METHOD_BLOCKCHAINS_ENABLED_DELETE =
	"valet-ui-rpc-method-blockchains-enabled-delete";
export const UI_RPC_METHOD_BLOCKCHAIN_KEYRINGS_ADD =
	"valet-ui-rpc-method-blockchain-keyrings-add";
export const UI_RPC_METHOD_KEYNAME_READ = "valet-ui-rpc-method-keyname-read";
export const UI_RPC_METHOD_KEYNAME_UPDATE = "valet-ui-rpc-method-keyname-update";
export const UI_RPC_METHOD_KEYRING_ACTIVE_WALLET_UPDATE =
	"valet-ui-rpc-method-keyring-active-wallet-update";
export const UI_RPC_METHOD_KEYRING_AUTO_LOCK_SETTINGS_READ =
	"valet-ui-rpc-method-auto-lock-settings-read";
export const UI_RPC_METHOD_KEYRING_AUTO_LOCK_SETTINGS_UPDATE =
	"valet-ui-rpc-method-auto-lock-settings-update";
export const UI_RPC_METHOD_KEYRING_READ_NEXT_DERIVATION_PATH =
	"valet-ui-rpc-method-keyring-read-next-derivation-path";
export const UI_RPC_METHOD_KEYRING_IMPORT_WALLET =
	"valet-ui-rpc-method-keyring-import-wallet";
export const UI_RPC_METHOD_KEYRING_SET_MNEMONIC =
	"valet-ui-rpc-method-keyring-set-mnemonic";
export const UI_RPC_METHOD_KEYRING_DERIVE_WALLET =
	"valet-ui-rpc-method-keyring-derive";
export const UI_RPC_METHOD_KEYRING_EXPORT_MNEMONIC =
	"valet-ui-rpc-method-export-mnemonic";
export const UI_RPC_METHOD_KEYRING_EXPORT_SECRET_KEY =
	"valet-ui-rpc-method-export-secret-key";
export const UI_RPC_METHOD_KEYRING_IMPORT_SECRET_KEY =
	"valet-ui-rpc-method-keyring-import-secret-key";
export const UI_RPC_METHOD_KEYRING_HAS_MNEMONIC =
	"valet-ui-rpc-method-keyring-has-mnemonic";
export const UI_RPC_METHOD_KEYRING_KEY_DELETE = "ui-rpc-method-keyring-delete";
export const UI_RPC_METHOD_KEYRING_RESET = "ui-rpc-method-keyring-reset";
export const UI_RPC_METHOD_KEYRING_STORE_CHECK_PASSWORD =
	"valet-ui-rpc-method-keyring-store-check-password";
export const UI_RPC_METHOD_KEYRING_STORE_CREATE =
	"valet-ui-rpc-method-keyring-store-create";
export const UI_RPC_METHOD_KEYRING_STORE_LOCK =
	"valet-ui-rpc-method-keyring-store-lock";
export const UI_RPC_METHOD_KEYRING_STORE_MNEMONIC_CREATE =
	"valet-ui-rpc-method-keyring-mnemonic-create";
export const UI_RPC_METHOD_KEYRING_STORE_MNEMONIC_SYNC =
	"valet-ui-rpc-method-keyring-mnemonic-sync";
export const UI_RPC_METHOD_KEYRING_STORE_READ_ALL_PUBKEYS =
	"valet-ui-rpc-method-keyring-read-all-pubkeys";
export const UI_RPC_METHOD_KEYRING_STORE_READ_ALL_PUBKEY_DATA =
	"valet-ui-rpc-method-keyring-read-all-pubkey-data";
export const UI_RPC_METHOD_KEYRING_STORE_STATE =
	"valet-ui-rpc-method-keyring-store-state";
export const UI_RPC_METHOD_KEYRING_STORE_UNLOCK =
	"valet-ui-rpc-method-keyring-store-unlock";
export const UI_RPC_METHOD_KEYRING_VALIDATE_MNEMONIC =
	"valet-ui-rpc-method-validate-mnemonic";
export const UI_RPC_METHOD_PASSWORD_UPDATE = "valet-ui-rpc-method-password-update";

export const UI_RPC_METHOD_PREVIEW_PUBKEYS =
	"valet-ui-rpc-method-keyring-preview-pubkeys";
export const UI_RPC_METHOD_SETTINGS_DARK_MODE_READ =
	"valet-ui-rpc-method-settings-dark-mode-read";
export const UI_RPC_METHOD_SETTINGS_DARK_MODE_UPDATE =
	"valet-ui-rpc-method-settings-dark-mode-update";
export const UI_RPC_METHOD_SETTINGS_DEVELOPER_MODE_READ =
	"valet-ui-rpc-method-settings-developer-mode-read";
export const UI_RPC_METHOD_SETTINGS_DEVELOPER_MODE_UPDATE =
	"ui-rpc-method-settings-developer-mode-update";

// Solana
export const UI_RPC_METHOD_SOLANA_COMMITMENT_READ =
	"valet-ui-rpc-method-solana-commitment-read";
export const UI_RPC_METHOD_SOLANA_COMMITMENT_UPDATE =
	"valet-ui-rpc-method-solana-commitment-update";
export const UI_RPC_METHOD_CONNECTION_URL_READ =
	"valet-ui-rpc-method-connection-url-read";
export const UI_RPC_METHOD_CONNECTION_URL_UPDATE =
	"valet-ui-rpc-method-connection-url-update";
export const UI_RPC_METHOD_EXPLORER_UPDATE = "valet-ui-rpc-method-explorer-update";
export const UI_RPC_METHOD_SOLANA_SIGN_ALL_TRANSACTIONS =
	"valet-ui-rpc-method-solana-sign-all-txs";
export const UI_RPC_METHOD_SOLANA_SIGN_AND_SEND_TRANSACTION =
	"valet-ui-rpc-method-solana-sign-and-send-tx";
export const UI_RPC_METHOD_SOLANA_SIGN_MESSAGE =
	"valet-ui-rpc-method-solana-sign-message";
export const UI_RPC_METHOD_SOLANA_SIGN_TRANSACTION =
	"valet-ui-rpc-method-solana-sign-tx";
export const UI_RPC_METHOD_SOLANA_SIMULATE = "valet-ui-rpc-method-solana-simulate";
//
// Notifications sent from the background script to observers.
//

export const NOTIFICATION_KEY_IS_COLD_UPDATE =
	"valet-notification-key-is-cold-update";
export const NOTIFICATION_APPROVED_ORIGINS_UPDATE =
	"valet-notification-approved-origins-update";
export const NOTIFICATION_AUTO_LOCK_SETTINGS_UPDATED =
	"valet-notification-auto-lock-settings-updated";
export const NOTIFICATION_BLOCKCHAIN_KEYRING_CREATED =
	"valet-notification-blockchain-keyring-created";
export const NOTIFICATION_BLOCKCHAIN_KEYRING_DELETED =
	"valet-notification-blockchain-keyring-deleted";
export const NOTIFICATION_AGGREGATE_WALLETS_UPDATED =
	"valet-notification-aggregate-wallets-updated";
export const NOTIFICATION_DARK_MODE_UPDATED = "valet-notification-dark-mode-updated";
export const NOTIFICATION_DEVELOPER_MODE_UPDATED =
	"valet-notification-developer-mode-updated";
export const NOTIFICATION_KEYNAME_UPDATE = "valet-notification-keyname-update";
export const NOTIFICATION_KEYRING_ACTIVE_BLOCKCHAIN_UPDATED =
	"valet-notification-keyring-active-blockchain-updated";
export const NOTIFICATION_KEYRING_CREATED = "valet-notification-keyring-created";
export const NOTIFICATION_KEYRING_IMPORTED_WALLET =
	"valet-notification-keyring-imported-wallet";
export const NOTIFICATION_KEYRING_DERIVED_WALLET =
	"valet-notification-keyring-derived-wallet";
export const NOTIFICATION_KEYRING_IMPORTED_SECRET_KEY =
	"valet-notification-keyring-imported-secret-key";
export const NOTIFICATION_KEYRING_KEY_DELETE =
	"valet-notification-keyring-key-delete";
export const NOTIFICATION_KEYRING_SET_MNEMONIC =
	"valet-notification-keyring-set-mnemonic";
export const NOTIFICATION_KEYRING_RESET_MNEMONIC =
	"valet-notification-keyring-reset-mnemonic";
export const NOTIFICATION_KEYRING_STORE_CREATED =
	"valet-notification-keyring-store-created";
export const NOTIFICATION_KEYRING_STORE_LOCKED =
	"valet-notification-keyring-store-locked";
export const NOTIFICATION_KEYRING_STORE_RESET =
	"valet-notification-keyring-store-reset";
export const NOTIFICATION_KEYRING_STORE_UNLOCKED =
	"valet-notification-keyring-store-unlocked";
export const NOTIFICATION_ACTIVE_BLOCKCHAIN_UPDATED =
	"valet-notification-keyring-active-blockchain-updated";

// Solana specific notifications
export const NOTIFICATION_ACTIVE_WALLET_UPDATED =
	"valet-notification-keyring-active-wallet-updated";
export const NOTIFICATION_SOLANA_COMMITMENT_UPDATED =
	"valet-notification-solana-commitment-updated";
export const NOTIFICATION_SOLANA_CONNECTED = "valet-notification-solana-connected";
export const NOTIFICATION_CONNECTION_URL_UPDATED =
	"valet-notification-connection-url-updated";
export const NOTIFICATION_SOLANA_DISCONNECTED =
	"valet-notification-solana-disconnected";
export const NOTIFICATION_EXPLORER_UPDATED = "valet-notification-explorer-updated";
export const NOTIFICATION_SOLANA_SPL_TOKENS_DID_UPDATE =
	"valet-notification-solana-spl-tokens-did-update";
//
// Solana web injected provider API.
//
export const SOLANA_RPC_METHOD_SIGN_IN = "valet-solana-sign-in";
export const SOLANA_RPC_METHOD_CONNECT = "valet-valet-solana-connect";
// export const SOLANA_RPC_METHOD_CONNECT = "solana-connect";
export const SOLANA_RPC_METHOD_DISCONNECT = "valet-solana-disconnect";
export const SOLANA_RPC_METHOD_SIGN_AND_SEND_TX = "valet-solana-sign-and-send-tx";
export const SOLANA_RPC_METHOD_SIGN_TX = "valet-solana-sign-tx";
export const SOLANA_RPC_METHOD_SIGN_ALL_TXS = "valet-solana-sign-all-txs";
export const SOLANA_RPC_METHOD_SIGN_MESSAGE = "valet-solana-sign-message";
export const SOLANA_RPC_METHOD_SIMULATE = "valet-solana-simulate";
//
// Solana connection api. These are the methods available for the background
// connection implementation (which the frontends use via message passing).
//
export const SOLANA_CONNECTION_RPC_GET_ACCOUNT_INFO = "valet-solana-get-account-info";
export const SOLANA_CONNECTION_RPC_GET_ACCOUNT_INFO_AND_CONTEXT =
	"valet-solana-get-account-info-and-context";
export const SOLANA_CONNECTION_RPC_GET_LATEST_BLOCKHASH =
	"valet-solana-get-latest-blockhash";
export const SOLANA_CONNECTION_RPC_GET_LATEST_BLOCKHASH_AND_CONTEXT =
	"valet-solana-get-latest-blockhash-and-context";
export const SOLANA_CONNECTION_RPC_GET_TOKEN_ACCOUNTS_BY_OWNER =
	"valet-solana-get-token-accounts-by-owner";
export const SOLANA_CONNECTION_RPC_SEND_RAW_TRANSACTION =
	"valet-solana-send-raw-transaction";
export const SOLANA_CONNECTION_RPC_CONFIRM_TRANSACTION =
	"valet-solana-confirm-transaction";
export const SOLANA_CONNECTION_RPC_GET_PARSED_TRANSACTIONS =
	"valet-solana-get-parsed-transactions";
export const SOLANA_CONNECTION_RPC_GET_PARSED_TRANSACTION =
	"valet-solana-get-parsed-transaction";
export const SOLANA_CONNECTION_GET_MULTIPLE_ACCOUNTS_INFO =
	"valet-solana-get-multiple-accounts-info";
export const SOLANA_CONNECTION_RPC_GET_CONFIRMED_SIGNATURES_FOR_ADDRESS_2 =
	"valet-solana-get-confirmed-signatures-for-address-2";
export const SOLANA_CONNECTION_RPC_CUSTOM_SPL_TOKEN_ACCOUNTS =
	"valet-solana-custom-spl-token-accounts";
export const SOLANA_CONNECTION_RPC_CUSTOM_SPL_METADATA_URI =
	"valet-solana-custom-spl-metadata-uri";
export const SOLANA_CONNECTION_RPC_GET_PROGRAM_ACCOUNTS =
	"valet-solana-get-program-accounts";
export const SOLANA_CONNECTION_RPC_GET_FEE_FOR_MESSAGE =
	"valet-solana-get-fee-for-message";
export const SOLANA_CONNECTION_RPC_GET_MINIMUM_BALANCE_FOR_RENT_EXEMPTION =
	"valet-solana-get-minimum-balance-for-rent-exemption";
export const SOLANA_CONNECTION_RPC_GET_TOKEN_ACCOUNT_BALANCE =
	"valet-get-token-account-balance";
export const SOLANA_CONNECTION_RPC_GET_BALANCE = "valet-solana-get-balance";
export const SOLANA_CONNECTION_RPC_GET_SLOT = "valet-solana-get-slot";
export const SOLANA_CONNECTION_RPC_GET_BLOCK_TIME = "valet-solana-get-block-time";
export const SOLANA_CONNECTION_RPC_GET_PARSED_TOKEN_ACCOUNTS_BY_OWNER =
	"valet-solana-get-parsed-token-accounts-by-owner";
export const SOLANA_CONNECTION_RPC_GET_TOKEN_LARGEST_ACCOUNTS =
	"valet-solana-get-token-largest-accounts";
export const SOLANA_CONNECTION_RPC_GET_ADDRESS_LOOKUP_TABLE =
	"valet-solana-get-address-lookup-table";
export const SOLANA_CONNECTION_RPC_GET_PARSED_ACCOUNT_INFO =
	"valet-solana-get-parsed-account-info";
export const SOLANA_CONNECTION_RPC_GET_PARSED_PROGRAM_ACCOUNTS =
	"valet-solana-get-parsed-program-accounts";

export const BACKGROUND_SERVICE_WORKER_READY = "valet-service-worker-ready";

export const POST_MESSAGE_ORIGIN = "*";

export const EXTENSION_WIDTH = 360;
export const EXTENSION_HEIGHT = 600;

export const BACKEND_EVENT = "backend-event";

export const NATIVE_ACCOUNT_RENT_EXEMPTION_LAMPORTS = 890880 as const;
export const TOKEN_ACCOUNT_RENT_EXEMPTION_LAMPORTS = 2039280 as const;
