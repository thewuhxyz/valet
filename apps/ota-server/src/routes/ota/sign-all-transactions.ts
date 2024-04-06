import {
	dappSignAllTransactionsDataSchema,
	serverJwtSchema,
	signAllTransactionsSchema,
	signTransactionSchema,
	intoProvider,
} from "@valet/ota-client"
import { OtaResponse } from "../../http/response"
import { decryptDappPayload, decryptCipherText } from "../../crypto"
import { getGoogleToken } from "../../provider"
import { otaServerClient } from "../../protocol"
import jwt from "jsonwebtoken"
import { otaRouter as router } from "./router"
import { getProject } from "./middleware"

const jwtSecret = process.env.JWT_SECRET!
const encryptionKey = process.env.VALET_ENCRYPTION_KEY!

router.post("/sign-all-transactions", async (req, res) => {
	try {
		let { success: signTransactionParseSuccess } =
			signTransactionSchema.safeParse(req.body)

		if (!signTransactionParseSuccess) {
			res.json(OtaResponse.error("payload doesn't contain all required params"))
			return
		}

		const { payload, nonce: userNonce } = signAllTransactionsSchema.parse(req.body)

		const serverTokenString: string = req.cookies["valet-token"]
		let serverTokenAnyPayload

		try {
			serverTokenAnyPayload = jwt.verify(serverTokenString, jwtSecret)
		} catch (e) {
			console.error("could not verify serverJwt. error:", e)
			res.json(
				OtaResponse.error(
					"Error processing jwt on server. User may not be signed in"
				)
			)
			return
		}

		const { success: serverJwtParseSuccess } = serverJwtSchema.safeParse(
			serverTokenAnyPayload
		)

		if (!serverJwtParseSuccess) {
			res.json(
				OtaResponse.error("Error parsing server jwt. User may not be logged in")
			)
			return
		}

		const { cipherText, origin } = serverJwtSchema.parse(serverTokenAnyPayload)

		if (req.headers["origin"] !== origin) {
			// todo
			// res.json(OtaResponse.error("Dapp origin doesn't match."))
			// return
		}

		const cipherPayload = decryptCipherText(
			cipherText,
			userNonce,
			encryptionKey
		)

		if (!cipherPayload) {
			res.json(
				OtaResponse.error(
					"user may not be signed in on server. Try connecting again"
				)
			)
			return
		}

		const { dappClientId, dappSecret, userDelegate } = cipherPayload

		if (req.headers["origin"] !== origin) {
			// todo
			// res.json(OtaResponse.error("Dapp origin doesn't match."))
			// return
		}

		const dappPayload = decryptDappPayload(dappSecret, payload)

		if (!dappPayload) {
			const projectData = await getProject(req, res)

			if (projectData?.secret === dappSecret) {
				res.json(OtaResponse.error("Unable to decrypt payload with secret"))
				return
			}

			res.clearCookie("valet-token")
			res.json(
				OtaResponse.error(
					"Dapp credentials may have changed. User may need to connect again"
				)
			)
			return
		}

		let { success: dappPayloadParseSuccess } =
			dappSignAllTransactionsDataSchema.safeParse(dappPayload)

		if (!dappPayloadParseSuccess) {
			res.json(OtaResponse.error("payload doesn't contain all required params"))
			return
		}

		const { provider, providerToken, transactions } =
			dappSignAllTransactionsDataSchema.parse(dappPayload)

		const validProvider = intoProvider(provider)

		if (!validProvider) {
			res.json(OtaResponse.error("Invalid Provider"))
			return
		}

		const providerInfo = await getGoogleToken(providerToken, dappClientId)
		if (!providerInfo) {
			const projectData = await getProject(req, res)

			if (projectData!.google === dappClientId) {
				res.json(
					OtaResponse.error(
						"Error processing id token, id token may not be valid"
					)
				)
				return
			}

			res.json(
				OtaResponse.error(
					"Dapp credentials may have changed. User may need to connect again"
				)
			)
			return
		}

		const signedTransactions = await otaServerClient.signAllTransactions(
			userDelegate,
			transactions
		)

		res.json(
			OtaResponse.signAllTransactions({
				signatures: signedTransactions,
			})
		)
	} catch (e) {
		console.error("error signing transaction on server. error:", e)
		res.json(OtaResponse.error("500: Internal Error"))
	}
})
