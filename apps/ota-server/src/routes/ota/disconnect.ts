import { otaRouter as router } from "./router"
import { OtaResponse } from "../../http/response"
// import {VALET_USER_TOKEN} from "@valet/ota-client"

router.post("/disconnect", async (_req, res) => {
	try {
		res.clearCookie("valet-token")
		// res.clearCookie(VALET_USER_TOKEN)
		res.json(OtaResponse.disconnect())
	} catch {
		res.json(OtaResponse.error("500: Internal error"))
	}
})
