import { Router } from "express"
import cors from "cors"
import { RedisCache, supabaseAdmin, redis } from "../../database"

const otaRouter: Router = Router()

otaRouter.use(
	cors({
		credentials: true,
		origin: async (origin, callback) => {
			let allowedOrigins = await RedisCache.allowedOrigins(redis)

			if (!allowedOrigins.includes(origin!)) {
				const { data } = await supabaseAdmin.from("projects").select("domain")

				if (!data) {
					callback(new Error("Error getting all domains from db"))
					return
				}

				allowedOrigins = data.map(({ domain }) => domain)
			}
			callback(null, allowedOrigins)
		},
	})
)

export { otaRouter }
