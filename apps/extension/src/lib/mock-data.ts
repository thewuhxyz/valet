export const tokens: TokensData[] = [
	{
		name: "Solana",
		symbol: "SOL",
		amount: 43.98,
		usd: 449.21,
	},
	{
		name: "Circle USDC",
		symbol: "USDC",
		amount: 600.43,
		usd: 600.21,
	},
	{
		name: "Tether USDT",
		symbol: "USDT",
		amount: 0.26,
		usd: 0.27,
	},
	{
		name: "Mango Token",
		symbol: "MNGO",
		amount: 3558.76,
		usd: 465.76,
	},
];

const newMap: Map<string, TokensData> = new Map();

tokens.map((i) => {
	return newMap.set(i.symbol.toLowerCase(), i);
});

export const tokenMap = newMap;

interface TokensData {
	name: string;
	symbol: string;
	amount: number;
	usd: number;
}