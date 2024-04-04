import { Router } from "express"
import cors from "cors"

const extensionRouter: Router = Router()
extensionRouter.use(
	cors({ origin: ["https://faenjjojpngbffdlomeomhmpojdkopbe.chromiumapp.org"] })
)

export { extensionRouter }
