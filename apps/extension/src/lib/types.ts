import type { PublicKey } from "@solana/web3.js";
import type { SolanaTokenAccount } from "@valet/lib";
import type BN from "bn.js";

export type NewUserFormData = {
	password: string;
	confirm: string;
	mnemonic: string;
	secret: string;
	hint: string;
};

export type SendTokenFormData = {
	recipient: string;
	// token: string;
	amount: number
};

export interface User {
	username: string;
	email: string;
}

export interface TokenAccountWithKey extends TokenAccount {
	key: PublicKey
}

export interface TokenAccount {
	amount: BN;
	closeAuthority: PublicKey | null;
	delegate: PublicKey;
	delegatedAmount: number | null;
	isNative: number | null;
	mint: PublicKey;
	owner: PublicKey
	// authority: PublicKey;
	// state: number;
}


export interface TokenData {
	name: string;
	decimals: number;
	ticker: string;
	logo: string;
	address: string;
	// Mint is Solana only so is optional
	mint: string;
	priceMint: string;
}

export interface TokenDataWithBalance extends TokenData {
	nativeBalance: BN;
	displayBalance: string;
}

export interface TokenDataWithPrice extends TokenDataWithBalance {
	usdBalance: number;
	recentPercentChange: number | undefined;
	recentUsdBalanceChange: number;
	priceData: any;
}

export type TokenDisplay = Pick<
	TokenDataWithPrice,
	| "name"
	| "ticker"
	| "logo"
	| "displayBalance"
	| "nativeBalance"
	| "usdBalance"
	| "recentUsdBalanceChange"
	| "priceData"
>;

export interface TokenMetadata {
	name: string;
	image: string;
	symbol: string;
}

type AccountData = {
	accounts: string;
	nativeBalanceChange: number;
	tokenBalanceChanges: Array<any>;
	innerInstructions: Array<any>;
};

type Instruction = {
	accounts: Array<any>;
	data: string;
	programId: string;
	innerInstructions: Array<any>;
};

type TokenTransfer = {
	fromTokenAccount: string;
	fromUserAccount: string;
	mint: string;
	toTokenAccount: string;
	toUserAccount: string;
	tokenAmount: number;
	tokenStandard: string;
};

export type HeliusParsedTransaction = {
	accountData: Array<AccountData>;
	blockchain: string;
	description: string;
	events: any;
	fee: number;
	feePayer: string;
	instructions: Array<Instruction>;
	nativeTransfers: Array<any>;
	signature: string;
	slot: number;
	source: string;
	timestamp: number;
	tokenTransfers: Array<TokenTransfer>;
	transactionError: string | null;
	type: string;
};
