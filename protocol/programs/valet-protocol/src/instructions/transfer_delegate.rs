use anchor_lang::prelude::*;

use crate::WalletAccount;

#[derive(Accounts)]
pub struct TransferDelegate<'info> {
    #[account(
        mut, 
        has_one=wallet_delegate,
        seeds=[wallet_signer.key().as_ref()], 
        bump=wallet_account.account_bump
    )]
    pub wallet_account: Account<'info, WalletAccount>,
    
    #[account(
        seeds=[&wallet_account.hash],
        bump=wallet_account.signer_bump
    )]
    pub wallet_signer: SystemAccount<'info>,

    #[account(mut)]
    pub new_wallet_delegate: Signer<'info>,

    #[account(mut)]
    pub wallet_delegate: Signer<'info>,

    #[account(address = anchor_lang::system_program::ID)]
    pub system_program: Program<'info, System>,
}

pub fn transfer_delegate(ctx: Context<TransferDelegate>) -> Result<()> {
    ctx.accounts
        .wallet_account
        .transfer_delegate(ctx.accounts.new_wallet_delegate.key());
    Ok(())
}
