use crate::state::WalletAccount;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::hash::hash;
use anchor_lang::system_program::{transfer, Transfer};

#[derive(Accounts)]
#[instruction(account_seeds: String)]
pub struct CreateWalletAccount<'info> {
    #[account(
        mut,
        address = WalletAccount::creator()
    )]
    pub creator: Signer<'info>,

    #[account(mut)]
    pub wallet_delegate: Signer<'info>,

    #[account(
        init,
        payer=creator,
        space=8 + std::mem::size_of::<WalletAccount>(),
        seeds=[wallet_signer.key().as_ref()],
        bump
    )]
    pub wallet_account: Account<'info, WalletAccount>,

    #[account(
        mut,
        seeds=[&hash(account_seeds.as_bytes()).to_bytes()],
        bump
    )]
    pub wallet_signer: SystemAccount<'info>,

    #[account(address = anchor_lang::system_program::ID)]
    pub system_program: Program<'info, System>,
}

pub fn create_wallet_account(
    ctx: Context<CreateWalletAccount>,
    account_seeds: String,
) -> Result<()> {
    transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            Transfer {
                from: ctx.accounts.creator.to_account_info(),
                to: ctx.accounts.wallet_signer.to_account_info(),
            },
        ),
        890880, // 890880 - rent exempt mimimum for system account with no data
    )?;

    transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            Transfer {
                from: ctx.accounts.creator.to_account_info(),
                to: ctx.accounts.wallet_delegate.to_account_info(),
            },
        ),
        890880, // 890880 - rent exempt mimimum for system account with no data
    )?;

    ctx.accounts.wallet_account.init(
        hash(account_seeds.as_bytes()).to_bytes(), // hash
        ctx.accounts.creator.key(),                // creator
        ctx.accounts.wallet_delegate.key(),        // wallet delegate
        ctx.bumps.wallet_account,                  // wallet account bump
        ctx.bumps.wallet_signer,                   // walet signer bump
    );
    Ok(())
}
