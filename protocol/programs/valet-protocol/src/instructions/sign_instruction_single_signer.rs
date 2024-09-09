use crate::state::WalletAccount;
use anchor_lang::{
    prelude::*,
    solana_program::{instruction::Instruction, program::invoke_signed},
};

#[derive(Accounts)]
pub struct SignInstructionSingleSigner<'info> {
    #[account(
        has_one=wallet_delegate,
        seeds=[wallet_signer.key().as_ref()],
        bump=wallet_account.account_bump
    )]
    pub wallet_account: Account<'info, WalletAccount>,

    #[account(
        mut,
        seeds=[&wallet_account.hash],
        bump=wallet_account.signer_bump
    )]
    pub wallet_signer: SystemAccount<'info>,

    #[account(mut)]
    pub wallet_delegate: Signer<'info>,

    #[account()]
    pub system_program: Program<'info, System>,

    /// CHECK: program id of the instruction to be invoked
    #[account(executable)]
    pub instruction_program_id: UncheckedAccount<'info>,
}

pub fn sign_instruction_single_signer(
    ctx: Context<SignInstructionSingleSigner>,
    instruction_data: Vec<u8>,
) -> Result<()> {
    let wallet_account = &ctx.accounts.wallet_account;
    let wallet_signer_key = ctx.accounts.wallet_signer.key();

    let ix = Instruction {
        accounts: ctx
            .remaining_accounts
            .iter()
            .map(|account| {
                // Create AccountMeta for each account
                AccountMeta {
                    is_signer: if account.key() == wallet_signer_key {
                        true
                    } else {
                        account.is_signer
                    },
                    is_writable: account.is_writable,
                    pubkey: account.key(),
                }
            })
            .collect(),
        data: instruction_data,
        program_id: ctx.accounts.instruction_program_id.key(),
    };

    invoke_signed(
        &ix,
        ctx.remaining_accounts,
        &[&[wallet_account.hash.as_ref(), &[wallet_account.signer_bump]]],
    )?;

    Ok(())
}
