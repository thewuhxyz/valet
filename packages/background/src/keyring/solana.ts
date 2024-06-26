import { validateMnemonic, generateMnemonic, mnemonicToSeedSync } from "bip39";
import { Keypair, PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import { deriveKeypair, deriveKeypairs } from "./crypto";
import * as bs58 from "bs58";
import {
	Keyring,
	KeyringFactory,
	KeyringJson,
	HdKeyring,
	HdKeyringFactory,
	HdKeyringJson,
	DerivationPath,
} from "./types";

export class SolanaKeyringFactory implements KeyringFactory {
	public fromJson(payload: KeyringJson): SolanaKeyring {
		const keypairs = payload.keypairs.map((secret: string) =>
			Keypair.fromSecretKey(Buffer.from(secret, "hex"))
		);
		return new SolanaKeyring(keypairs);
	}

	public fromSecretKeys(secretKeys: Array<string>): SolanaKeyring {
		const keypairs = secretKeys.map((secret: string) =>
			Keypair.fromSecretKey(Buffer.from(secret, "hex"))
		);
		return new SolanaKeyring(keypairs);
	}
}

class SolanaKeyring implements Keyring {
	constructor(readonly keypairs: Array<Keypair>) {}

	public publicKeys(): Array<string> {
		return this.keypairs.map((kp) => kp.publicKey.toString());
	}

	// `address` is the key on the keyring to use for signing.
	public async signTransaction(tx: Buffer, address: string): Promise<string> {
		const pubkey = new PublicKey(address);
		const kp = this.keypairs.find((kp) => kp.publicKey.equals(pubkey));
		if (!kp) {
			throw new Error(`unable to find ${address.toString()}`);
		}
		return bs58.encode(nacl.sign.detached(new Uint8Array(tx), kp.secretKey));
	}

	public async signMessage(tx: Buffer, address: string): Promise<string> {
		// TODO: this shouldn't blindly sign. We should check some
		//       type of unique prefix that asserts this isn't a
		//       real transaction.
		return this.signTransaction(tx, address);
	}

	public exportSecretKey(address: string): string | null {
		const pubkey = new PublicKey(address);
		const kp = this.keypairs.find((kp) => kp.publicKey.equals(pubkey));
		if (!kp) {
			return null;
		}
		return bs58.encode(kp.secretKey);
	}

	public importSecretKey(secretKey: string): string {
		const kp = Keypair.fromSecretKey(Buffer.from(secretKey, "hex"));
		this.keypairs.push(kp);
		return kp.publicKey.toString();
	}

	public toJson(): any {
		return {
			keypairs: this.keypairs.map((kp) =>
				Buffer.from(kp.secretKey).toString("hex")
			),
		};
	}
}

export class SolanaHdKeyringFactory implements HdKeyringFactory {
	public fromMnemonic(
		mnemonic: string,
		derivationPath?: DerivationPath
	): HdKeyring {
		if (!derivationPath) {
			derivationPath = DerivationPath.Bip44Change;
		}
		if (!validateMnemonic(mnemonic)) {
			throw new Error("Invalid seed words");
		}
		const seed = mnemonicToSeedSync(mnemonic);
		const numberOfAccounts = 1;
		const keypairs = deriveKeypairs(seed, derivationPath, numberOfAccounts);
		return new SolanaHdKeyring({
			mnemonic,
			seed,
			numberOfAccounts,
			keypairs,
			derivationPath,
		});
	}

	public generate(): HdKeyring {
		const mnemonic = generateMnemonic(256);
		const seed = mnemonicToSeedSync(mnemonic);
		const numberOfAccounts = 1;
		const derivationPath = DerivationPath.Bip44;
		const keypairs = deriveKeypairs(seed, derivationPath, numberOfAccounts);

		return new SolanaHdKeyring({
			mnemonic,
			seed,
			numberOfAccounts,
			derivationPath,
			keypairs,
		});
	}

	public fromJson(obj: HdKeyringJson): HdKeyring {
		const { mnemonic, seed: seedStr, numberOfAccounts, derivationPath } = obj;
		const seed = Buffer.from(seedStr, "hex");
		const keypairs = deriveKeypairs(seed, derivationPath, numberOfAccounts);

		const kr = new SolanaHdKeyring({
			mnemonic,
			seed,
			numberOfAccounts,
			derivationPath,
			keypairs,
		});

		return kr;
	}
}

class SolanaHdKeyring extends SolanaKeyring implements HdKeyring {
	readonly mnemonic: string;
	private seed: Buffer;
	private numberOfAccounts: number;
	private derivationPath: DerivationPath;

	constructor({
		mnemonic,
		seed,
		numberOfAccounts,
		keypairs,
		derivationPath,
	}: {
		mnemonic: string;
		seed: Buffer;
		numberOfAccounts: number;
		keypairs: Array<Keypair>;
		derivationPath: DerivationPath;
	}) {
		super(keypairs);
		this.mnemonic = mnemonic;
		this.seed = seed;
		this.numberOfAccounts = numberOfAccounts;
		this.derivationPath = derivationPath;
	}

	public deriveNext(): [string, number] {
		const kp = deriveKeypair(
			this.seed.toString("hex"),
			this.numberOfAccounts,
			this.derivationPath
		);
		this.keypairs.push(kp);
		this.numberOfAccounts += 1;
		return [kp.publicKey.toString(), this.numberOfAccounts - 1];
	}

	public getPublicKey(accountIndex: number): string {
		// This might not be true once we implement account deletion.
		// One solution is to simply make that a UI detail.
		if (this.keypairs.length !== this.numberOfAccounts) {
			throw new Error("invariant violation");
		}
		if (accountIndex >= this.keypairs.length) {
			throw new Error(
				`cannot get public key for account index: ${accountIndex}`
			);
		}
		const kp = this.keypairs[accountIndex];
		return kp.publicKey.toString();
	}

	public toJson(): HdKeyringJson {
		return {
			mnemonic: this.mnemonic,
			seed: this.seed.toString("hex"),
			numberOfAccounts: this.numberOfAccounts,
			derivationPath: this.derivationPath,
		};
	}
}

// export class SolanaWalletKey {
// 	keypair: Keypair;
// 	mnemonic: string;
// 	seed: Buffer;

// 	publicKey = (): string => {
// 		return this.keypair.publicKey.toString();
// 	};

// 	signTransaction = async (tx: Buffer): Promise<string> => {
// 		return bs58.encode(
// 			nacl.sign.detached(new Uint8Array(tx), this.keypair.secretKey)
// 		);
// 	};

// 	signMessage = async (tx: Buffer): Promise<string> => {
// 		return this.signTransaction(tx);
// 	};

// 	exportSecretKey = (): string | null  => {
// 		return bs58.encode(this.keypair.secretKey);
// 	}

// 	generate = (): Keypair => {
// 		this.mnemonic = SolanaWalletKey.generateMnemonic();
// 		this.seed = mnemonicToSeedSync(this.mnemonic);
// 		// this.keypair = deriveKeypair(this.seed);

// 		return this.keypair;
// 	}

// 	static generateMnemonic = (): string => {
// 		return generateMnemonic();
// 	}

// 	fromMnemonic = (mnemonic: string, secret?: string): Keypair => {
// 		if (!validateMnemonic(mnemonic)) {
// 			throw new Error("Invalid seed words");
// 		}
// 		this.mnemonic = mnemonic;
// 		this.seed = mnemonicToSeedSync(this.mnemonic, secret);
// 		// this.keypair = deriveKeypair(this.seed);
// 		return this.keypair;
// 	}

// 	toJson = () => {
// 		return Buffer.from(this.keypair.secretKey).toString("hex");
// 	}

// 	fromJson = (keyString: string) => {
// 		return Keypair.fromSecretKey(Buffer.from(keyString, "hex"));
// 	}
// }
