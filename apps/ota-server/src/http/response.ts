import {
	OtaBaseResponse,
	OtaConnectResponse,
	OtaConnectResponseData,
	OtaSignAllTransactionsResponse,
	OtaSignAllTransactionsResponseData,
	OtaSignTransactionResponse,
	OtaSignTransactionResponseData,
} from "@valet/ota-client";

export class OtaResponse {
	static error(message: string): OtaBaseResponse {
		return {
			data: null,
			error: { message },
		} satisfies OtaBaseResponse;
	}
	static connect({ image, userToken }: OtaConnectResponseData): OtaConnectResponse {
		return {
			data: { image, userToken },
			error: null,
		} satisfies OtaBaseResponse;
	}
	static disconnect(): OtaConnectResponse {
		return {
			data: null,
			error: null,
		} satisfies OtaBaseResponse;
	}
	static signTransaction({
		signature,
	}: OtaSignTransactionResponseData): OtaSignTransactionResponse {
		return {
			data: { signature },
			error: null,
		} satisfies OtaBaseResponse;
	}
	static signAllTransactions({
		signatures,
	}: OtaSignAllTransactionsResponseData): OtaSignAllTransactionsResponse {
		return {
			data: { signatures },
			error: null,
		} satisfies OtaBaseResponse;
	}

	static transferDelegate({
		transaction,
	}: {
		transaction: string;
	}): OtaBaseResponse {
		return {
			data: { transaction },
			error: null
		};
	}
}
