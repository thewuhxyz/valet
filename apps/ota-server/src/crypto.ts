import { CipherPayload, cipherPayloadSchema } from "@valet/ota-client"
import { randomBytes, secretbox } from "tweetnacl"
import {
	decodeBase64,
	decodeUTF8,
	encodeBase64,
	encodeUTF8,
} from "tweetnacl-util"
import bcrypt from "bcryptjs"
import { SecretPayload, decrypt, encrypt } from "@valet/lib"

export const decryptDappPayload = (
	developerSecretKey: string,
	payload: string
) => {
	const combined = decodeBase64(payload)

	// Extract the nonce and encrypted data
	const nonce = combined.slice(0, secretbox.nonceLength)
	const ciphertext = combined.slice(secretbox.nonceLength)
	const decryptedMessage = secretbox.open(
		ciphertext,
		nonce,
		decodeBase64(developerSecretKey)
	)

	if (!decryptedMessage) return

	return JSON.parse(encodeUTF8(decryptedMessage)) as { [x: string]: any }
}

export const encryptCipherText = (
	encryptionKey: string,
	payload: CipherPayload
) => {
	const payloadString = JSON.stringify(payload)

	const nonceBuf = randomBytes(secretbox.nonceLength)

	const encryptedTextBuf = secretbox(
		decodeUTF8(payloadString),
		nonceBuf,
		decodeBase64(encryptionKey)
	)

	const nonce = encodeBase64(nonceBuf)
	const cipherText = encodeBase64(encryptedTextBuf)

	return { cipherText, nonce }
}

export const decryptCipherText = (
	cipherText: string,
	nonce: string,
	encryptionKey: string
) => {
	const text = secretbox.open(
		decodeBase64(cipherText),
		decodeBase64(nonce),
		decodeBase64(encryptionKey)
	)

	if (!text) return
	const cipherPayloadAny = JSON.parse(encodeUTF8(text))
	const { success } = cipherPayloadSchema.safeParse(cipherPayloadAny)
	if (!success) return
	return cipherPayloadSchema.parse(cipherPayloadAny)
}

export const generateSecret = () =>
	encodeBase64(randomBytes(secretbox.keyLength))

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
		const some = await Password.hash(password, 5)
		const foo = await encrypt(secret, password)
		const buf = encodeBase64(decodeUTF8(JSON.stringify(foo)))
		return buf
	}
	static async decrypt(base64: string, password: string) {
		const ha = await Password.hash(password, 5)
		const some = JSON.parse(encodeUTF8(decodeBase64(base64))) as SecretPayload
		const foo = await decrypt(some, password)
		return foo
	}
}

