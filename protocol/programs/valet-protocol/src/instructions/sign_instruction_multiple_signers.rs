use crate::{state::WalletAccount, ID};
use anchor_lang::{
    prelude::*,
    solana_program::{instruction::Instruction, program::invoke_signed},
};

#[derive(Accounts)]
pub struct SignInstructionMultipleSigners<'info> {
    #[account()]
    pub system_program: Program<'info, System>,

    /// CHECK: program id of the instruction to be invoked
    #[account(executable)]
    pub instruction_program_id: UncheckedAccount<'info>,
}

pub fn sign_instruction_multiple_signers<'info>(
    ctx: Context<'_, '_, 'info, 'info, SignInstructionMultipleSigners>,
    instruction_data: Vec<u8>,
    unique_signers: u8,
) -> Result<()> {
    let mut signers: Vec<Pubkey> = Vec::new();
    let mut signatures: Vec<Vec<Vec<u8>>> = Vec::new();

    let mut first_account_index: usize = 0;
    let mut last_account_index: usize = 0;

    for _ in 0..unique_signers {
        last_account_index = last_account_index + 3;

        let accounts = &ctx.remaining_accounts[first_account_index..last_account_index];

        let wallet_account: Account<WalletAccount> = Account::try_from(&accounts[0])?;
        let wallet_signer = &accounts[1];
        let wallet_delegate = &accounts[2];

        let wallet_signer_seeds = &[wallet_account.hash.as_ref(), &[wallet_account.signer_bump]];
        let wallet_signer_key = Pubkey::create_program_address(wallet_signer_seeds, &ID).unwrap();

        let wallet_account_seeds = &[wallet_signer.key.as_ref(), &[wallet_account.account_bump]];
        let wallet_account_key = Pubkey::create_program_address(wallet_account_seeds, &ID).unwrap();

        assert_eq!(
            wallet_account_key,
            wallet_account.key(),
            "wallet account doesn't match"
        );
        assert_eq!(
            wallet_signer_key,
            wallet_signer.key(),
            "wallet signer doesn't match"
        );
        assert_eq!(
            wallet_account.wallet_delegate,
            wallet_delegate.key(),
            "wallet delegate doesn't match"
        );

        assert_eq!(
            wallet_delegate.is_signer, true,
            "wallet_delegate is not a signer"
        );

        let hash_vec = wallet_account.hash.to_vec();
        let bump_vec = vec![wallet_account.signer_bump];

        let signature = vec![hash_vec, bump_vec];

        signers.push(wallet_signer.key());
        signatures.push(signature);

        first_account_index = last_account_index;
    }

    let remaining_accounts = &ctx.remaining_accounts[last_account_index..];

    let ix = Instruction {
        accounts: remaining_accounts
            .iter()
            .map(|account| {
                // Create AccountMeta for each account
                AccountMeta {
                    is_signer: if signers.contains(account.key) {
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

    let seeds_refs: Vec<Vec<&[u8]>> = signatures
        .iter()
        .map(|sig| sig.iter().map(|seeds| &seeds[..]).collect())
        .collect();

    let signatures_refs: Vec<&[&[u8]]> = seeds_refs.iter().map(|sig| &sig[..]).collect();

    invoke_signed(&ix, remaining_accounts, &signatures_refs[..])?;

    Ok(())
}
