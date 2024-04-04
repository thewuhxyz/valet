import { Request } from "express"

export interface OtaRequest extends Request {
	project?: {
		name: string
		id: string
		secret: string
		domain: string
		googleId: string | null
		twitterId: string | null
		discord: string | null
	}
}
