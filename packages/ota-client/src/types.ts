import {
	DappTransactionData,
	OtaConnectRequest,
	OtaConnectResponse,
	OtaDisconnectRequest,
	OtaDisconnectResponse,
	OtaSignAllTransactionsRequest,
	OtaSignTransactionRequest,
} from "./zod"

////////////////////////////////////
// Ota Server Requests
/////////////////////////////////////
export type OtaServerRequest =
	| ConnectRequest
	| DisconnectRequest
	| SignTransactionRequest
	| SignAllTransactionsRequest

export type ConnectRequest = {
	action: OtaAction.Connect
	payload: OtaConnectRequest
}

export type DisconnectRequest = {
	action: OtaAction.Disconnect
	payload: OtaDisconnectRequest
}

export type SignTransactionRequest = {
	action: OtaAction.SignTransaction
	payload: OtaSignTransactionRequest
}

export type SignAllTransactionsRequest = {
	action: OtaAction.SignAllTransactions
	payload: OtaSignAllTransactionsRequest
}

export type OtaServerResponse = OtaConnectResponse | OtaDisconnectResponse

//////////////////////////////////////////
// Dapp Server Requests
///////////////////////////////////////////
export type DappServerRequest =
	| DappServerConnectRequest
	| DappServerDisconnectRequest
	| DappServerSignTransactionRequest
	| DappServerSignAllTransactionsRequest

export type DappServerConnectRequest = {
	action: OtaAction.Connect
	payload: DappServerConnectPayload
}

export type DappServerDisconnectRequest = {
	action: OtaAction.Disconnect
	payload: DappServerDisconnectPayload
}

export type DappServerSignTransactionRequest = {
	action: OtaAction.SignTransaction
	payload: DappServerSignTransactionPayload
}

export type DappServerSignAllTransactionsRequest = {
	action: OtaAction.SignAllTransactions
	payload: DappServerSignAllTransactionsPayload
}

export type DappServerConnectPayload = {}

export type DappServerDisconnectPayload = {}

export type DappServerSignTransactionPayload = {
	transaction: DappTransactionData
}

export type DappServerSignAllTransactionsPayload = {
	transactions: DappTransactionData[]
}

////////////////////////////////////////////
export enum OtaAction {
	Connect = "connect",
	Disconnect = "disconnect",
	SignTransaction = "sign-transaction",
	SignAllTransactions = "sign-all-transactions",
}

export const VALET_USER_TOKEN = "valet-user-token"
export const VALET_USER_AVATAR = "valet-user-avatar"
export const VALET_ID_TOKEN = "valet-id-token"
