import {
	VALET_DEVNET_PROGRAM_ID,
	VALET_LOCALNET_PROGRAM_ID,
} from "@valet/protocol"
import crypto from "crypto"
import { ClusterWithLocalnet, Provider } from "./types"

export const getProgramIdByCluster = (cluster: ClusterWithLocalnet) => {
	switch (cluster) {
		case (cluster = "localnet"):
			return VALET_LOCALNET_PROGRAM_ID
		case (cluster = "devnet"):
			return VALET_DEVNET_PROGRAM_ID
		default:
			throw Error("No program for this cluster")
	}
}

export const solanaHash = (payload: string) => {
	return crypto.createHash("sha256").update(payload, "utf-8").digest("hex")
}

export const isValidProvider = (provider: string): provider is Provider => {
	return Object.values(Provider).includes(provider as Provider)
}

export const intoProvider = (provider: string): Provider | undefined => {
	if (!isValidProvider(provider)) return
	return provider
}
