import { otaRouter as router } from "./router"
import { OtaResponse } from "../../http/response"

router.post("/disconnect", async (_req, res) => {
	try {
		res.clearCookie("valet-token")
		res.json(OtaResponse.disconnect())
	} catch {
		res.json(OtaResponse.error("500: Internal error"))
	}
})
