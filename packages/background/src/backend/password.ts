import * as crypto from "../keyring/crypto";

export class PasswordManager {
	private static _password?: string;

	static setPassword(password: string) {
		if (!this._password) {
			this._password = password;
			return;
		}
	}

	static changePassword(currentPassword: string, newPassword: string) {
		if (this._password === currentPassword) {
			this._password = newPassword;
		}
	}

	static isCurrentPassword(password: string) {
		return this._password === password;
	}

	static async encrypt(plaintext: string) {
		if (!this._password) throw new Error("Password is not set");
		return await crypto.encrypt(plaintext, this._password);
	}

	static async decrypt(
		encryptedPayload: crypto.SecretPayload,
		password: string
	) {
		return await crypto.decrypt(encryptedPayload, password);
	}
}
