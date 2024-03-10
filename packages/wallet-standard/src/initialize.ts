import { registerWallet } from './register.js';
import { ValetWallet } from './wallet.js';
import type { ProviderSolanaInjection } from '@valet/provider';

export function initialize(valet: ProviderSolanaInjection): void {
    registerWallet(new ValetWallet(valet));
}
