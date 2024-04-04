export const UI_RPC_METHOD_HD_KEYRING_CREATE = "hd-keyring-create"
export const UI_RPC_METHOD_KEYRING_CREATE = "keyring-create"
export const UI_RPC_METHOD_KEYRING_STORE_KEEP_ALIVE = "keyring-store-keep-alive"
export const UI_RPC_METHOD_KEYRING_RESET_MNEMONIC = "reset-mnemonic"
export const UI_RPC_METHOD_KEYRING_AUTOLOCK_UPDATE = "autolock-update"

export const NOTIFICATION_SIGNIN_SUCCESSFUL = "notification-signin-successful"
export const NOTIFICATION_SIGNOUT_SUCCESSFUL = "notification-signout-successful"

export const UI_RPC_METHOD_WALLET_DATA_ACTIVE_WALLET = "valet-wallet-active"
export const UI_RPC_METHOD_WALLET_DATA_ACTIVE_WALLET_UPDATE =
	"valet-wallet-active-update"

export const UI_RPC_METHOD_WALLET_DATA_DELEGATE_WALLET = "valet-delegate-wallet"
export const UI_RPC_METHOD_WALLET_DATA_DELEGATE_WALLET_UPDATE =
	"valet-delegate-wallet-update"
export const UI_RPC_METHOD_OTA_READ_PUBKEY = "valet-ota-read-pubkey"
export const UI_RPC_METHOD_OTA_IS_ID_TOKEN_VALID = "valet-ota-is-id-token-valid"
export const UI_RPC_METHOD_OTA_TRANSFER_DELEGATE_LOCAL =
	"valet-ota-transfer-delegate-local"
export const UI_RPC_METHOD_OTA_TRANSFER_DELEGATE_SERVER =
	"valet-ota-transfer-delegate-server"

// Hash for devnet cluster
export const RPC_DEVNET_GENESIS_HASH =
	"EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG"

// Hash for mainnet-beta cluster
export const RPC_MAINNET_BETA_GENESIS_HASH =
	"5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d"

export const RPC_DEVNET_ENDPOINT = "https://api.devnet.solana.com/"
export const RPC_LOCALNET_ENDPOINT = "http://127.0.0.1:8899"

export const NOTIFICATION_DELEGATE_WALLET_UPDATED =
	"valet-notification-keyring-active-wallet-updated"

export const SOLANA_RPC_METHOD_PREPARE_OTA_TX = "valet-solana-prepare-ota-tx"

//
// Messaging communication channel topics.
//
export const CHANNEL_POPUP_RPC = "valet-channel-popup-rpc"
export const CHANNEL_POPUP_RESPONSE = "valet-channel-popup-response"
export const CHANNEL_POPUP_NOTIFICATIONS = "valet-channel-popup-notifications"
export const CHANNEL_SOLANA_RPC_REQUEST = "valet-channel-solana-rpc-request"
export const CHANNEL_SOLANA_RPC_RESPONSE = "valet-channel-solana-rpc-response"

export const CHANNEL_SOLANA_NOTIFICATION = "valet-channel-solana-notification"
export const CHANNEL_SOLANA_CONNECTION_RPC_UI =
	"valet-channel-solana-connection-rpc-ui"
export const CHANNEL_SOLANA_CONNECTION_INJECTED_REQUEST =
	"valet-channel-solana-connection-injected-request"
export const CHANNEL_SOLANA_CONNECTION_INJECTED_RESPONSE =
	"valet-channel-solana-connection-injected-response"

//
// Trusted app API.
//
export const UI_RPC_METHOD_GET_USER_DATA = "valet-ui-rpc-method-get-user-data"
export const UI_RPC_METHOD_SIGN_IN = "valet-ui-rpc-method-sign-in"
export const UI_RPC_METHOD_SIGN_OUT = "valet-ui-rpc-method-sign-out"
export const UI_RPC_METHOD_GET_SESSION = "valet-ui-rpc-method-get-session"
export const UI_RPC_METHOD_GET_MNEMONIC_FROM_DB =
	"valet-ui-rpc-method-get-mnemonic-from-db"
export const UI_RPC_METHOD_IS_MNEMONIC_IN_DB =
	"valet-ui-rpc-method-is-mnemonic-in-db"
export const UI_RPC_METHOD_KEYRING_STORE_CREATE_NEW =
	"valet-ui-rpc-method-keyring-store-create-new"
export const UI_RPC_METHOD_KEYRING_STORE_CREATE_EXISTING =
	"valet-ui-rpc-method-keyring-store-create-existing"

export const UI_RPC_METHOD_APPROVED_ORIGINS_DELETE =
	"valet-ui-rpc-method-approved-origins-delete"
export const UI_RPC_METHOD_APPROVED_ORIGINS_READ =
	"valet-ui-rpc-method-approved-origins-read"
export const UI_RPC_METHOD_APPROVED_ORIGINS_UPDATE =
	"valet-ui-rpc-method-approved-origins-update"
export const UI_RPC_METHOD_KEYNAME_READ = "valet-ui-rpc-method-keyname-read"
export const UI_RPC_METHOD_KEYNAME_UPDATE = "valet-ui-rpc-method-keyname-update"
export const UI_RPC_METHOD_KEYRING_ACTIVE_WALLET_UPDATE =
	"valet-ui-rpc-method-keyring-active-wallet-update"
export const UI_RPC_METHOD_KEYRING_AUTO_LOCK_SETTINGS_READ =
	"valet-ui-rpc-method-auto-lock-settings-read"
export const UI_RPC_METHOD_KEYRING_AUTO_LOCK_SETTINGS_UPDATE =
	"valet-ui-rpc-method-auto-lock-settings-update"
export const UI_RPC_METHOD_KEYRING_READ_NEXT_DERIVATION_PATH =
	"valet-ui-rpc-method-keyring-read-next-derivation-path"
export const UI_RPC_METHOD_KEYRING_IMPORT_WALLET =
	"valet-ui-rpc-method-keyring-import-wallet"
export const UI_RPC_METHOD_KEYRING_SET_MNEMONIC =
	"valet-ui-rpc-method-keyring-set-mnemonic"
export const UI_RPC_METHOD_KEYRING_DERIVE_WALLET =
	"valet-ui-rpc-method-keyring-derive"
export const UI_RPC_METHOD_KEYRING_EXPORT_MNEMONIC =
	"valet-ui-rpc-method-export-mnemonic"
export const UI_RPC_METHOD_KEYRING_EXPORT_SECRET_KEY =
	"valet-ui-rpc-method-export-secret-key"
export const UI_RPC_METHOD_KEYRING_IMPORT_SECRET_KEY =
	"valet-ui-rpc-method-keyring-import-secret-key"
export const UI_RPC_METHOD_KEYRING_HAS_MNEMONIC =
	"valet-ui-rpc-method-keyring-has-mnemonic"
export const UI_RPC_METHOD_KEYRING_KEY_DELETE = "ui-rpc-method-keyring-delete"
export const UI_RPC_METHOD_KEYRING_RESET = "ui-rpc-method-keyring-reset"
export const UI_RPC_METHOD_KEYRING_STORE_CHECK_PASSWORD =
	"valet-ui-rpc-method-keyring-store-check-password"
export const UI_RPC_METHOD_KEYRING_STORE_CREATE =
	"valet-ui-rpc-method-keyring-store-create"
export const UI_RPC_METHOD_KEYRING_STORE_LOCK =
	"valet-ui-rpc-method-keyring-store-lock"
export const UI_RPC_METHOD_KEYRING_STORE_MNEMONIC_CREATE =
	"valet-ui-rpc-method-keyring-mnemonic-create"
export const UI_RPC_METHOD_KEYRING_STORE_MNEMONIC_SYNC =
	"valet-ui-rpc-method-keyring-mnemonic-sync"
export const UI_RPC_METHOD_KEYRING_STORE_READ_ALL_PUBKEYS =
	"valet-ui-rpc-method-keyring-read-all-pubkeys"
export const UI_RPC_METHOD_KEYRING_STORE_READ_ALL_PUBKEY_DATA =
	"valet-ui-rpc-method-keyring-read-all-pubkey-data"
export const UI_RPC_METHOD_KEYRING_STORE_STATE =
	"valet-ui-rpc-method-keyring-store-state"
export const UI_RPC_METHOD_KEYRING_STORE_UNLOCK =
	"valet-ui-rpc-method-keyring-store-unlock"
export const UI_RPC_METHOD_KEYRING_VALIDATE_MNEMONIC =
	"valet-ui-rpc-method-validate-mnemonic"
export const UI_RPC_METHOD_PASSWORD_UPDATE =
	"valet-ui-rpc-method-password-update"

export const UI_RPC_METHOD_PREVIEW_PUBKEYS =
	"valet-ui-rpc-method-keyring-preview-pubkeys"
export const UI_RPC_METHOD_SETTINGS_DARK_MODE_READ =
	"valet-ui-rpc-method-settings-dark-mode-read"
export const UI_RPC_METHOD_SETTINGS_DARK_MODE_UPDATE =
	"valet-ui-rpc-method-settings-dark-mode-update"

// Solana
export const UI_RPC_METHOD_SOLANA_COMMITMENT_READ =
	"valet-ui-rpc-method-solana-commitment-read"
export const UI_RPC_METHOD_SOLANA_COMMITMENT_UPDATE =
	"valet-ui-rpc-method-solana-commitment-update"
export const UI_RPC_METHOD_CONNECTION_URL_READ =
	"valet-ui-rpc-method-connection-url-read"
export const UI_RPC_METHOD_CONNECTION_URL_UPDATE =
	"valet-ui-rpc-method-connection-url-update"
export const UI_RPC_METHOD_EXPLORER_UPDATE =
	"valet-ui-rpc-method-explorer-update"
export const UI_RPC_METHOD_SOLANA_SIGN_ALL_TRANSACTIONS =
	"valet-ui-rpc-method-solana-sign-all-txs"
export const UI_RPC_METHOD_SOLANA_SIGN_AND_SEND_TRANSACTION =
	"valet-ui-rpc-method-solana-sign-and-send-tx"
export const UI_RPC_METHOD_SOLANA_SIGN_MESSAGE =
	"valet-ui-rpc-method-solana-sign-message"
export const UI_RPC_METHOD_SOLANA_SIGN_TRANSACTION =
	"valet-ui-rpc-method-solana-sign-tx"
export const UI_RPC_METHOD_SOLANA_SIMULATE =
	"valet-ui-rpc-method-solana-simulate"

export const UI_RPC_METHOD_SOLANA_PREPARE_OTA_TRANSACTION =
	"valet-ui-rpc-method-solana-prepare-ota-transaction"

//
// Notifications sent from the background script to observers.
//
export const NOTIFICATION_APPROVED_ORIGINS_UPDATE =
	"valet-notification-approved-origins-update"
export const NOTIFICATION_AUTO_LOCK_SETTINGS_UPDATED =
	"valet-notification-auto-lock-settings-updated"
export const NOTIFICATION_DARK_MODE_UPDATED =
	"valet-notification-dark-mode-updated"
export const NOTIFICATION_KEYNAME_UPDATE = "valet-notification-keyname-update"
export const NOTIFICATION_KEYRING_ACTIVE_BLOCKCHAIN_UPDATED =
	"valet-notification-keyring-active-blockchain-updated"
export const NOTIFICATION_KEYRING_CREATED = "valet-notification-keyring-created"
export const NOTIFICATION_KEYRING_IMPORTED_WALLET =
	"valet-notification-keyring-imported-wallet"
export const NOTIFICATION_KEYRING_DERIVED_WALLET =
	"valet-notification-keyring-derived-wallet"
export const NOTIFICATION_KEYRING_IMPORTED_SECRET_KEY =
	"valet-notification-keyring-imported-secret-key"
export const NOTIFICATION_KEYRING_KEY_DELETE =
	"valet-notification-keyring-key-delete"
export const NOTIFICATION_KEYRING_SET_MNEMONIC =
	"valet-notification-keyring-set-mnemonic"
export const NOTIFICATION_KEYRING_RESET_MNEMONIC =
	"valet-notification-keyring-reset-mnemonic"
export const NOTIFICATION_KEYRING_STORE_CREATED =
	"valet-notification-keyring-store-created"
export const NOTIFICATION_KEYRING_STORE_LOCKED =
	"valet-notification-keyring-store-locked"
export const NOTIFICATION_KEYRING_STORE_RESET =
	"valet-notification-keyring-store-reset"
export const NOTIFICATION_KEYRING_STORE_UNLOCKED =
	"valet-notification-keyring-store-unlocked"


// Solana specific notifications
export const NOTIFICATION_ACTIVE_WALLET_UPDATED =
	"valet-notification-keyring-active-wallet-updated"
export const NOTIFICATION_SOLANA_COMMITMENT_UPDATED =
	"valet-notification-solana-commitment-updated"
export const NOTIFICATION_SOLANA_CONNECTED =
	"valet-notification-solana-connected"
export const NOTIFICATION_CONNECTION_URL_UPDATED =
	"valet-notification-connection-url-updated"
export const NOTIFICATION_SOLANA_DISCONNECTED =
	"valet-notification-solana-disconnected"
export const NOTIFICATION_SOLANA_SPL_TOKENS_DID_UPDATE =
	"valet-notification-solana-spl-tokens-did-update"

//
// Solana web injected provider API.
//
export const SOLANA_RPC_METHOD_SIGN_IN = "valet-solana-sign-in"
export const SOLANA_RPC_METHOD_CONNECT = "valet-valet-solana-connect"
export const SOLANA_RPC_METHOD_DISCONNECT = "valet-solana-disconnect"
export const SOLANA_RPC_METHOD_SIGN_AND_SEND_TX =
	"valet-solana-sign-and-send-tx"
export const SOLANA_RPC_METHOD_SIGN_TX = "valet-solana-sign-tx"
export const SOLANA_RPC_METHOD_SIGN_ALL_TXS = "valet-solana-sign-all-txs"
export const SOLANA_RPC_METHOD_SIGN_MESSAGE = "valet-solana-sign-message"
export const SOLANA_RPC_METHOD_SIMULATE = "valet-solana-simulate"

// Solana connection api. These are the methods available for the background
// connection implementation (which the frontends use via message passing).
//
export const SOLANA_CONNECTION_RPC_GET_ACCOUNT_INFO =
	"valet-solana-get-account-info"
export const SOLANA_CONNECTION_RPC_GET_ACCOUNT_INFO_AND_CONTEXT =
	"valet-solana-get-account-info-and-context"
export const SOLANA_CONNECTION_RPC_GET_LATEST_BLOCKHASH =
	"valet-solana-get-latest-blockhash"
export const SOLANA_CONNECTION_RPC_GET_LATEST_BLOCKHASH_AND_CONTEXT =
	"valet-solana-get-latest-blockhash-and-context"
export const SOLANA_CONNECTION_RPC_GET_TOKEN_ACCOUNTS_BY_OWNER =
	"valet-solana-get-token-accounts-by-owner"
export const SOLANA_CONNECTION_RPC_SEND_RAW_TRANSACTION =
	"valet-solana-send-raw-transaction"
export const SOLANA_CONNECTION_RPC_CONFIRM_TRANSACTION =
	"valet-solana-confirm-transaction"
export const SOLANA_CONNECTION_RPC_GET_PARSED_TRANSACTIONS =
	"valet-solana-get-parsed-transactions"
export const SOLANA_CONNECTION_RPC_GET_PARSED_TRANSACTION =
	"valet-solana-get-parsed-transaction"
export const SOLANA_CONNECTION_GET_MULTIPLE_ACCOUNTS_INFO =
	"valet-solana-get-multiple-accounts-info"
export const SOLANA_CONNECTION_RPC_GET_CONFIRMED_SIGNATURES_FOR_ADDRESS_2 =
	"valet-solana-get-confirmed-signatures-for-address-2"
export const SOLANA_CONNECTION_RPC_CUSTOM_SPL_TOKEN_ACCOUNTS =
	"valet-solana-custom-spl-token-accounts"
export const SOLANA_CONNECTION_RPC_CUSTOM_SPL_METADATA_URI =
	"valet-solana-custom-spl-metadata-uri"
export const SOLANA_CONNECTION_RPC_GET_PROGRAM_ACCOUNTS =
	"valet-solana-get-program-accounts"
export const SOLANA_CONNECTION_RPC_GET_FEE_FOR_MESSAGE =
	"valet-solana-get-fee-for-message"
export const SOLANA_CONNECTION_RPC_GET_MINIMUM_BALANCE_FOR_RENT_EXEMPTION =
	"valet-solana-get-minimum-balance-for-rent-exemption"
export const SOLANA_CONNECTION_RPC_GET_TOKEN_ACCOUNT_BALANCE =
	"valet-get-token-account-balance"
export const SOLANA_CONNECTION_RPC_GET_BALANCE = "valet-solana-get-balance"
export const SOLANA_CONNECTION_RPC_GET_SLOT = "valet-solana-get-slot"
export const SOLANA_CONNECTION_RPC_GET_BLOCK_TIME =
	"valet-solana-get-block-time"
export const SOLANA_CONNECTION_RPC_GET_PARSED_TOKEN_ACCOUNTS_BY_OWNER =
	"valet-solana-get-parsed-token-accounts-by-owner"
export const SOLANA_CONNECTION_RPC_GET_TOKEN_LARGEST_ACCOUNTS =
	"valet-solana-get-token-largest-accounts"
export const SOLANA_CONNECTION_RPC_GET_ADDRESS_LOOKUP_TABLE =
	"valet-solana-get-address-lookup-table"
export const SOLANA_CONNECTION_RPC_GET_PARSED_ACCOUNT_INFO =
	"valet-solana-get-parsed-account-info"
export const SOLANA_CONNECTION_RPC_GET_PARSED_PROGRAM_ACCOUNTS =
	"valet-solana-get-parsed-program-accounts"

export const VALET_DOMAIN = "https://valetw.xyz"
export const OTA_SERVER_DOMAIN = "https://ota.valetw.xyz"

export const POST_MESSAGE_ORIGIN = "*"

export const EXTENSION_WIDTH = 360
export const EXTENSION_HEIGHT = 600

export const BACKEND_EVENT = "backend-event"

export const NATIVE_ACCOUNT_RENT_EXEMPTION_LAMPORTS = 890880 as const
export const TOKEN_ACCOUNT_RENT_EXEMPTION_LAMPORTS = 2039280 as const

export const UNKNOWN_ICON_SRC =
	"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12ZM10.9645 15.3015C10.9645 15.7984 11.3677 16.2015 11.8645 16.2015C12.3612 16.2015 12.7645 15.7984 12.7645 15.3015C12.7645 14.8047 12.3612 14.4015 11.8645 14.4015C11.3677 14.4015 10.9645 14.8047 10.9645 15.3015ZM13.3939 11.8791C13.9135 11.5085 14.2656 11.1748 14.4511 10.8777C14.8776 10.1948 14.8728 9.02088 14.0532 8.35291C12.9367 7.44383 10.8943 7.77224 9.6001 8.49763L10.2067 9.7155C10.9189 9.35193 11.553 9.17 12.1092 9.17C12.6546 9.17 13.1214 9.36453 13.1214 9.91004C13.1214 10.4891 12.6543 10.8231 12.1713 11.1684L12.171 11.1686L12.1645 11.173C11.9915 11.2996 11.8416 11.4235 11.7147 11.5442C11.5451 11.7059 11.4168 11.8621 11.3298 12.013C11.1013 12.4085 11.1014 12.736 11.1019 13.152V13.2015H12.5761L12.576 13.158C12.5755 12.6312 12.5753 12.4844 13.3939 11.8791ZM20.5 12C20.5 16.6944 16.6944 20.5 12 20.5C7.30558 20.5 3.5 16.6944 3.5 12C3.5 7.30558 7.30558 3.5 12 3.5C16.6944 3.5 20.5 7.30558 20.5 12ZM22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z' fill='%238F929E'/%3E%3C/svg%3E"

// Image displayed in the event of a broken NFT.
export const UNKNOWN_NFT_ICON_SRC =
	"data:image/png;base64,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"

// Load a fixed amount of public keys for various actions, e.g. import list,
// searching mnemonics
export const LOAD_PUBLIC_KEY_AMOUNT = 20

export const DEFAULT_PUBKEY_STR = "11111111111111111111111111111111"
