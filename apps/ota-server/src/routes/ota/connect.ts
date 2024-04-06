import {
	ServerJwt,
	UserJwt,
	connectRequestSchema,
	dappConnectDataSchema,
	Provider,
	ValetUser,
	intoProvider,
} from "@valet/ota-client"
import { OtaResponse } from "../../http/response"
import {
	Password,
	Secret,
	decryptDappPayload,
	encryptCipherText,
} from "../../crypto"
import { getGoogleToken } from "../../provider"
import { otaServerClient } from "../../protocol"
import jwt from "jsonwebtoken"
import { otaRouter as router } from "./router"
import { imageUrlToBase64 } from "@valet/lib"
import { OtaDatabase, supabaseAdmin } from "../../database"
import { OtaServerClient } from "../../protocol/client"
import { getProject } from "./middleware"

const jwtSecret = process.env.JWT_SECRET!
const encryptionKey = process.env.VALET_ENCRYPTION_KEY!
const prod = process.env.VALET_ENV === "production"

router.post("/connect", async (req, res) => {
	try {
		let { success: connectParseSuccess } = connectRequestSchema.safeParse(
			req.body
		)

		if (!connectParseSuccess) {
			res.json(OtaResponse.error("payload doesn't contain all required params"))
			return
		}

		const { payload, password } = connectRequestSchema.parse(req.body)

		const project = await getProject(req, res)

		if (!project) {
			OtaResponse.error("could not get project info from db")
			return
		}

		const { domain, secret, google } = project

		if (req.headers["origin"] !== domain) {
			// todo
			// res.json(OtaResponse.error("Dapp origin doesn't match."))
			// return
		}

		const dappPayload = decryptDappPayload(secret!, payload)

		let { success: dappPayloadParseSuccess } =
			dappConnectDataSchema.safeParse(dappPayload)

		if (!dappPayloadParseSuccess) {
			res.json(OtaResponse.error("payload doesn't contain all required params"))
			return
		}

		const { provider, providerToken } = dappConnectDataSchema.parse(dappPayload)

		const validProvider = intoProvider(provider)

		if (!validProvider || !google) {
			res.json(OtaResponse.error("Invalid Provider"))
			return
		}

		const providerInfo = await getGoogleToken(providerToken, google)
		if (!providerInfo) {
			res.json(
				OtaResponse.error(
					"Error processing id token, id token may not be valid"
				)
			)
			return
		}

		//////////////////////////////////////////////////////////

		const { providerId, image, name } = providerInfo

		const user: ValetUser = {
			provider: validProvider,
			providerId,
		}

		let delegate: string

		const userDbPayload = await OtaDatabase.getUser(supabaseAdmin, user)

		if (!userDbPayload) {
			const userSecretKey = await createUser(user, password)

			if (!userSecretKey) {
				res.json(OtaResponse.error("Error creating user in db"))
				return
			}

			delegate = userSecretKey
		} else {
			const { delegate: encryptedDelegate, password: hash } = userDbPayload

			const correctPassword = await Password.compare(password, hash).catch(
				() => false
			)
			if (!correctPassword) {
				res.json(OtaResponse.error("Incorrect password"))
				return
			}
			const decryptedDelegate = await Secret.decrypt(
				encryptedDelegate,
				password
			).catch(() => null)

			if (!decryptedDelegate) {
				res.json(OtaResponse.error("Could not decrypt user secret"))
				return
			}
			delegate = decryptedDelegate
		}

		await otaServerClient.createAccountIfNotCreated(user, delegate)

		const { cipherText, nonce } = encryptCipherText(encryptionKey, {
			dappClientId: google,
			dappSecret: secret!,
			userDelegate: delegate,
		})

		const { accountKey, publicKey } = otaServerClient.userKeys(user)

		const processedImage = image ? await imageUrlToBase64(image) : null

		const serverTokenPayload = {
			provider: Provider.Google.toString(),
			origin: domain, // todo: rename `domain`
			accountKey,
			publicKey,
			cipherText,
			image: image || null,
		} as ServerJwt

		const serverToken = jwt.sign(serverTokenPayload, jwtSecret, {
			expiresIn: "1h",
		})

		const userTokenPayload = {
			accountKey,
			image: null, // may exceed cookie size limit. move to local storage
			publicKey,
			name: name || null,
			nonce,
		} as UserJwt

		const userToken = jwt.sign(userTokenPayload, jwtSecret, {
			expiresIn: "1h",
		})

		res.cookie("valet-token", serverToken, {
			path: "/",
			httpOnly: true,
			secure: prod,
			sameSite: !prod ? "lax" : "none",
			expires: new Date(Date.now() + 3600000),
			maxAge: 3600000,
		})

		res.cookie("valet-user-token", userToken, {
			path: "/",
			httpOnly: false,
			secure: prod,
			sameSite: !prod ? "lax" : "none",
			expires: new Date(Date.now() + 3600000),
			maxAge: 3600000,
		})

		res.json(
			OtaResponse.connect({
				image: processedImage,
			})
		)
	} catch {
		res.json(OtaResponse.error("500: Internal error"))
	}
})

async function createUser(user: ValetUser, password: string) {
	const { secretKey } = OtaServerClient.generateNewSecret()

	const passwordHash = await Password.hash(password)

	const encryptedSecret = await Secret.encrypt(secretKey, password)

	const { error } = await OtaDatabase.createUser(supabaseAdmin, {
		delegate: encryptedSecret,
		password: passwordHash,
		provider: user.provider,
		provider_id: user.providerId,
	})

	if (error) return null

	return secretKey
}

function calculateByteSize(str: string) {
	const byteArray = new TextEncoder().encode(str)
	const byteSize = byteArray.length
	return byteSize
}
