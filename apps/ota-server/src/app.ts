import express, { Express } from "express"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import { otaRouter, extensionRouter } from "./routes"

export const app: Express = express()

app.set("port", process.env.PORT || 3000)

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/ota", otaRouter)
app.use("/extension", extensionRouter)


