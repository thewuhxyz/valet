import { OtaConnectRequest } from "@valet/ota-client"
import { OtaRequest } from "./types"
import { ProjectData, RedisCache, supabaseAdmin, redis } from "../../database"
import { OtaResponse } from "../../http/response"
import { NextFunction, Request, Response } from "express"

export const getProjectDetails = async (
	req: OtaRequest,
	res: Response,
	next: NextFunction
) => {
	const { projectId } = req.body as OtaConnectRequest
	if (!projectId) {
		next()
		return
	}

	const { data } = await supabaseAdmin
		.from("projects")
		.select("*")
		.eq("id", projectId)

	if (!data) {
		res.json(OtaResponse.error("Dapp is not registered yet."))
		return
	}
	const project = data[0]

	req.project = {
		id: projectId,
		secret: project.secret,
		domain: project.domain,
		name: project.name,
		googleId: project.google,
		discord: project.discord,
		twitterId: project.twitter,
	}
	next()
}

export const getProject = async (req: Request, res: Response) => {
	const { projectId } = req.body as OtaConnectRequest

	if (!projectId) {
		res.json(OtaResponse.error("Project ID was not included in the request."))
		return
	}

	const cachedProject = await RedisCache.getProject(redis, projectId)

	if (cachedProject) {
		RedisCache.addAllowedOrigin(redis, cachedProject.domain!)
		return cachedProject
	}

	const { data } = await supabaseAdmin
		.from("projects")
		.select("*")
		.eq("id", projectId)

	if (!data) {
		res.json(OtaResponse.error("Dapp is not registered yet."))
		return
	}

	await RedisCache.setProject(redis, { ...data[0] })
	await RedisCache.addAllowedOrigin(redis, data[0].domain)

	return data[0] as ProjectData
}
