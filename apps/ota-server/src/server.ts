import * as dotenv from "dotenv"

const serve = async () => {
	dotenv.config({ path: "../.env" })

	const { app } = await import("./app")

	const port = app.get("port")

	app.listen(port, () => {
		console.log(`Listening on port ${port}`)
	})
}

serve()
