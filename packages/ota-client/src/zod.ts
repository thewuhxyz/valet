import z from "zod"

//////////////////////////////////////
// Base Request and Response Schema
//////////////////////////////////////

// Base Error
const baseErrorSchema = z.object({
	error: z.object({ message: z.string() }).nullable(),
})

export type OtaBaseError = z.infer<typeof baseResponseSchema>

// Base Data
const baseDataSchema = z.object({
	data: z.object({}).nullable(),
})

// Base response
const baseResponseSchema = baseErrorSchema.merge(baseDataSchema)

export type OtaBaseResponse = z.infer<typeof baseResponseSchema>

///////////////////////////////////////////
// Connect Request and Response Schema
////////////////////////////////////////////
export const connectRequestSchema = z.object({
	password: z.string(),
	projectId: z.string(),
	payload: z.string(),
})

export type OtaConnectRequest = z.infer<typeof connectRequestSchema>

export const signTransactionSchema = z.object({
	projectId: z.string(),
	payload: z.string(),
	// nonce: z.string(),
})

export type OtaSignAllTransactionsRequest = z.infer<
	typeof signTransactionSchema
>

export const signAllTransactionsSchema = z.object({
	projectId: z.string(),
	payload: z.string(),
	// nonce: z.string(),
})

export type OtaSignTransactionRequest = z.infer<typeof signTransactionSchema>

export const disconnectRequestDataSchema = z.object({})
export type OtaDisconnectRequest = z.infer<typeof disconnectRequestDataSchema>

/////////////////////////////////////////////////////

//////////////////////////////////////////////////////

export const dappBaseDataSchema = z.object({
	provider: z.string(),
	providerToken: z.string(),
})

export const dappConnectDataSchema = dappBaseDataSchema.extend({})

export type DappConnectData = z.infer<typeof dappConnectDataSchema>

export const connectResponseDataSchema = z.object({
	image: z.string().nullable(),
})
export type OtaConnectResponseData = z.infer<typeof connectResponseDataSchema>

export const connectResponseSchema = baseResponseSchema.merge(
	z.object({ data: connectResponseDataSchema.nullable() })
)

export type OtaConnectResponse = z.infer<typeof connectResponseSchema>

///////////////////////////////////////////
// Disconnect Request and Response Schema
////////////////////////////////////////////
export const disconnectResponseSchema = baseResponseSchema.merge(
	z.object({ data: z.null() })
)

export type OtaDisconnectResponse = z.infer<typeof disconnectResponseSchema>

/////////////////////////////////////////////////
// Sign Transaction Request and Response Schema
/////////////////////////////////////////////////

export const transactionSchema = z.object({
		txString: z.string(),
		isVersioned: z.boolean(),
	})

export type DappTransactionData = z.infer<typeof transactionSchema>

export const dappSignTransactionDataSchema = dappBaseDataSchema.extend({
	transaction: transactionSchema
})

export type DappSignTransactionData = z.infer<
	typeof dappSignTransactionDataSchema
>

export const signTransactionResponseDataSchema = z.object({
	signature: z.string(),
})

export type OtaSignTransactionResponseData = z.infer<
	typeof signTransactionResponseDataSchema
>

export const signTransactionResponseSchema = baseResponseSchema.merge(
	z.object({ data: signTransactionResponseDataSchema.nullable() })
)

export type OtaSignTransactionResponse = z.infer<
	typeof signTransactionResponseSchema
>
////////////////////////////////////////////////////////
// Sign All Transactions Request and Response Schema
////////////////////////////////////////////////////////

export const dappSignAllTransactionsDataSchema = dappBaseDataSchema.extend({
	transactions: z.array(transactionSchema),
})

export type DappSignAllTransactionData = z.infer<
	typeof dappSignAllTransactionsDataSchema
>

export const signAllTransactionsResponseDataSchema = z.object({
	signatures: z.array(z.string()),
})

export type OtaSignAllTransactionsResponseData = z.infer<
	typeof signAllTransactionsResponseDataSchema
>

export const signAllTransactionsResponseSchema = baseResponseSchema.merge(
	z.object({ data: signAllTransactionsResponseDataSchema.nullable() })
)

export type OtaSignAllTransactionsResponse = z.infer<
	typeof signAllTransactionsResponseSchema
>
//////////////////////////////////////////
// JWT Schema
//////////////////////////////////////////
export const userJwtSchema = z.object({
	publicKey: z.string(),
	accountKey: z.string(),
	image: z.string().nullable(),
	nonce: z.string(), // nonce?
	name: z.string().nullable(),
	iat: z.number(),
	exp: z.number(),
}) // client-side jwt

export type UserJwt = z.infer<typeof userJwtSchema>

export const serverJwtSchema = z.object({
	publicKey: z.string(),
	accountKey: z.string(),
	image: z.string().nullable(),
	provider: z.string(),
	cipherText: z.string(),
	origin: z.string(),
	iat: z.number(),
	exp: z.number(),
}) // server-side jwt

export type ServerJwt = z.infer<typeof serverJwtSchema>

export const cipherPayloadSchema = z.object({
	userDelegate: z.string(),
	dappSecret: z.string(),
	dappClientId: z.string(),
})

export type CipherPayload = z.infer<typeof cipherPayloadSchema>