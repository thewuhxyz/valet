import { initialize } from "@valet/wallet-standard";
import { ProviderSolanaInjection } from "@valet/provider";
import { getLogger } from "@valet/lib";

const logger = getLogger("provider-injection");

// Entry.
function main() {
	logger.debug("starting injected script");
	initSolana();
	logger.debug("provider ready");
}

function initSolana() {
	const solana = new ProviderSolanaInjection();

	try {
		Object.defineProperty(window, "valet", { value: solana });
	} catch (e) {
		console.warn(
			"Valet couldn't override `window.valet`. Disable other Solana wallets to use Valet."
		);
	}

	initialize(solana);
}

main();
