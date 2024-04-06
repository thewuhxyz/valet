import { CipherPayload, cipherPayloadSchema } from "@valet/ota-client"
import nacl from "tweetnacl"
import util from "tweetnacl-util"
import bcrypt from "bcryptjs"
import { SecretPayload, decrypt, encrypt } from "@valet/lib"

export const decryptDappPayload = (
	developerSecretKey: string,
	payload: string
) => {
	const combined = util.decodeBase64(payload)

	// Extract the nonce and encrypted data
	const nonce = combined.slice(0, nacl.secretbox.nonceLength)
	const ciphertext = combined.slice(nacl.secretbox.nonceLength)
	const decryptedMessage = nacl.secretbox.open(
		ciphertext,
		nonce,
		util.decodeBase64(developerSecretKey)
	)

	if (!decryptedMessage) return

	return JSON.parse(util.encodeUTF8(decryptedMessage)) as { [x: string]: any }
}

export const encryptCipherText = (
	encryptionKey: string,
	payload: CipherPayload
) => {
	const payloadString = JSON.stringify(payload)

	const nonceBuf = nacl.randomBytes(nacl.secretbox.nonceLength)

	const encryptedTextBuf = nacl.secretbox(
		util.decodeUTF8(payloadString),
		nonceBuf,
		util.decodeBase64(encryptionKey)
	)

	const nonce = util.encodeBase64(nonceBuf)
	const cipherText = util.encodeBase64(encryptedTextBuf)

	return { cipherText, nonce }
}

export const decryptCipherText = (
	cipherText: string,
	nonce: string,
	encryptionKey: string
) => {
	const text = nacl.secretbox.open(
		util.decodeBase64(cipherText),
		util.decodeBase64(nonce),
		util.decodeBase64(encryptionKey)
	)
	if (!text) return
	const cipherPayloadAny = JSON.parse(util.encodeUTF8(text))
	const { success } = cipherPayloadSchema.safeParse(cipherPayloadAny)
	if (!success) return
	return cipherPayloadSchema.parse(cipherPayloadAny)
}

export const generateSecret = () =>
	util.encodeBase64(nacl.randomBytes(nacl.secretbox.keyLength))

export class Password {
	static async hash(password: string, saltRounds: number = 10) {
		return await bcrypt.hash(password, saltRounds)
	}

	static async compare(password: string, hash: string) {
		return await bcrypt.compare(password, hash)
	}
}

export class Secret {
	static async encrypt(secret: string, password: string) {
		const cipherText = await encrypt(secret, password)
		return util.encodeBase64(util.decodeUTF8(JSON.stringify(cipherText)))
	}
	static async decrypt(text: string, password: string) {
		const cipherText = JSON.parse(
			util.encodeUTF8(util.decodeBase64(text))
		) as SecretPayload
		return await decrypt(cipherText, password)
	}
}
