import { pbkdf2 } from "crypto"
import nacl from "tweetnacl"
import bs58 from "bs58"

export async function encrypt(
	plaintext: string,
	password: string
): Promise<SecretPayload> {
	const salt = nacl.randomBytes(16)
	const kdf = "pbkdf2"
	const iterations = 100000
	const digest = "sha256"
	const key = await deriveEncryptionKey(password, salt, iterations, digest)
	const nonce = nacl.randomBytes(nacl.secretbox.nonceLength)
	const ciphertext = nacl.secretbox(Buffer.from(plaintext), nonce, key)
	return {
		ciphertext: bs58.encode(ciphertext),
		nonce: bs58.encode(nonce),
		kdf,
		salt: bs58.encode(salt),
		iterations,
		digest,
	}
}

export async function decrypt(
	cipherObj: SecretPayload,
	password: string
): Promise<string> {
	const {
		ciphertext: encodedCiphertext,
		nonce: encodedNonce,
		salt: encodedSalt,
		iterations,
		digest,
	} = cipherObj
	const ciphertext = bs58.decode(encodedCiphertext)
	const nonce = bs58.decode(encodedNonce)
	const salt = bs58.decode(encodedSalt)
	const key = await deriveEncryptionKey(password, salt, iterations, digest)
	const plaintext = nacl.secretbox.open(ciphertext, nonce, key)
	if (!plaintext) {
		throw new Error("Incorrect password")
	}
	const decodedPlaintext = Buffer.from(plaintext).toString()
	return decodedPlaintext
}

async function deriveEncryptionKey(
	password: string,
	salt: Uint8Array,
	iterations: number,
	digest: string
): Promise<Buffer> {
	return new Promise((resolve, reject) =>
		pbkdf2(
			password,
			salt,
			iterations,
			nacl.secretbox.keyLength,
			digest,
			(err, key) => (err ? reject(err) : resolve(key))
		)
	)
}

// An encrypted secret wiht associated metadata required for decryption.
export type SecretPayload = {
	ciphertext: string;
	nonce: string;
	salt: string;
	kdf: string;
	iterations: number;
	digest: string;
};
