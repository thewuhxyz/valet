import { OtaResponse } from "../../http/response"
import { getGoogleToken } from "../../provider"
import { ValetUser, intoProvider } from "@valet/ota-client"
import { otaServerClient } from "../../protocol"
import { extensionRouter as router } from "./router"
import { OtaDatabase } from "../../database"
import { Password, Secret } from "../../crypto"

const extensionGoogleId = process.env.VALET_EXTENSION_GOOGLE_ID!

router.post("/transfer-delegate", async (req, res) => {
	try {

		const { providerToken, hash: password, provider, delegate, direction } = req.body as {
			providerToken: string
			hash: string
			provider: string
			delegate: string
			direction: string
		}
	
		const validProvider = intoProvider(provider)
	
		if (!validProvider) {
			res.json(OtaResponse.error("Invalid Provider"))
			return
		}
	
		const providerInfo = await getGoogleToken(providerToken, extensionGoogleId)
		if (!providerInfo) {
			res.json(
				OtaResponse.error("Error processing id token, id token may not be valid")
			)
			return
		}
	
		const { providerId } = providerInfo
	
		const user: ValetUser = {
			provider: validProvider,
			providerId,
		}
	
		const userPayload = await OtaDatabase.adminGetUser(user)
	
		if (!userPayload) {
			res.json(OtaResponse.error("user not found in db"))
			return
		}
	
		const { delegate: encryptedDelegate, password: hash } = userPayload

		const isCorrectPassword = await Password.compare(password, hash)
		
		if (!isCorrectPassword) {
			res.json(OtaResponse.error("Incorrect Password"))
			return
		}
	
		const serverDelegate = await Secret.decrypt(encryptedDelegate, password).catch(e => {
			return undefined
		})

		if (!serverDelegate) {
			res.json(OtaResponse.error("Error decrypting secret on server"))
			return
		}
		
	
		const transaction = await otaServerClient.transferDelegate(
			user,
			delegate,
			serverDelegate,
			direction
		)
	
		res.json(OtaResponse.transferDelegate({ transaction }))
	} catch (e) {
		res.json(
			OtaResponse.error("500: Internal Error")
		)
	}
})
