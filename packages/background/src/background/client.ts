import {
	CHANNEL_POPUP_RPC,
	CHANNEL_POPUP_RESPONSE,
	CHANNEL_POPUP_NOTIFICATIONS,
	CHANNEL_SOLANA_CONNECTION_RPC_UI,
	getLogger,
	ChannelAppUi,
	type BackgroundClient,
	UiResponder,
} from "@valet/lib"
import { Notification } from "../types"

const logger = getLogger("common/background/client")

let _backgroundClient: BackgroundClient | null = null
let _backgroundSolanaClient: BackgroundClient | null = null

let _uiResponseClient: UiResponder | null = null

export function setBackgroundClient(c: BackgroundClient) {
	_backgroundClient = c
}

export function setBackgroundSolanaClient(c: BackgroundClient) {
	_backgroundSolanaClient = c
}

export function setUiResponseClient(c: UiResponder) {
	_uiResponseClient = c
}

export function getBackgroundClient(): BackgroundClient {
	if (_backgroundClient === null) {
		throw new Error("_backgroundClient not initialized")
	}
	return _backgroundClient
}

export function getBackgroundSolanaClient(): BackgroundClient {
	if (_backgroundSolanaClient === null) {
		throw new Error("_backgroundClient not initialized")
	}
	return _backgroundSolanaClient
}

export function getBackgroundResponseClient(): UiResponder {
	if (_uiResponseClient === null) {
		throw new Error("_backgroundClient not initialized")
	}
	return _uiResponseClient
}

export function setupClient(
	notificationsHandler: (notif: Notification) => Promise<void>
) {
	logger.debug("setting up core background clients")

	//
	// Client to communicate from the UI to the background script.
	//
	setBackgroundClient(ChannelAppUi.client(CHANNEL_POPUP_RPC))

	setBackgroundSolanaClient(
		ChannelAppUi.client(CHANNEL_SOLANA_CONNECTION_RPC_UI)
	)

	//
	// Client to send responses from the UI to the background script.
	// Used when the background script asks the UI to do something, e.g.,
	// approve a transaction.
	//
	setUiResponseClient(ChannelAppUi.responder(CHANNEL_POPUP_RESPONSE))

	ChannelAppUi.notifications(CHANNEL_POPUP_NOTIFICATIONS).onNotification(
		notificationsHandler
	)
}
