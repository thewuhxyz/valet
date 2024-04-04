pub mod instructions;
pub mod state;
pub use anchor_lang::prelude::*;

use instructions::*;
use state::*;

declare_id!("Ez6kSdsqyLLTKGa9rcUBtfUshmvPWgKtNsQTiXkGFk5s");

#[program]
pub mod valet_protocol {
    use super::*;

    pub fn create_wallet_account(
        ctx: Context<CreateWalletAccount>,
        account_seeds: String,
    ) -> Result<()> {
        instructions::create_wallet_account(ctx, account_seeds)
    }

    pub fn sign_instruction_single_signer(
        ctx: Context<SignInstructionSingleSigner>,
        instruction_data: Vec<u8>,
    ) -> Result<()> {
        instructions::sign_instruction_single_signer(ctx, instruction_data)
    }

    pub fn sign_instruction_multiple_signers<'info>(
        ctx: Context<'_, '_, 'info, 'info, SignInstructionMultipleSigners>,
        instruction_data: Vec<u8>,
        unique_signers: u8,
    ) -> Result<()> {
        instructions::sign_instruction_multiple_signers(ctx, instruction_data, unique_signers)
    }

    pub fn transfer_delegate(
        ctx: Context<TransferDelegate>,
    ) -> Result<()> {
        instructions::transfer_delegate(ctx)
    }
}
