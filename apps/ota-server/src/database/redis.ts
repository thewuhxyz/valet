import Redis from "ioredis"
import { ProjectData } from "./client"

const redisUrl = process.env.VALET_REDIS_URL

export const redis = redisUrl ? new Redis(redisUrl) : new Redis()

export class RedisCache {
	static async allowedOrigins(redis: Redis) {
		return await redis.smembers(ALLOWED_ORIGIN, (err, origins) => {
			if (err) {
				console.error("Error retrieving allowed origins from Redis:", err)
				return
			}
		})
	}

	static async addAllowedOrigin(redis: Redis, domain: string) {
		return await redis.sadd(ALLOWED_ORIGIN, domain)
	}

	static async removeAllowedOrigin(redis: Redis, domain: string) {
		return await redis.srem(domain)
	}

	static async getProject(redis: Redis, projectId: string) {
		const cachedData = await redis.get(projectId, (err, project) => {
			if (err) {
				console.error("Error retrieving project from Redis:", err)
				return
			}
		})

		if (!cachedData) return
		return JSON.parse(cachedData) as ProjectData
	}

	static async setProject(redis: Redis, project: ProjectData) {
		const projectId = project.id!
		return await redis.set(projectId, JSON.stringify(project))
	}
	static async removeProject(redis: Redis, projectId: string) {
		return await redis.del(projectId)
	}
}

const ALLOWED_ORIGIN = "ota-allowed-origin"
