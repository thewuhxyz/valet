use std::str::FromStr;

use anchor_lang::prelude::*;

pub const SIGNER_SEEDS: &[u8] = b"signer";

#[account]
pub struct WalletAccount {
    pub hash: [u8; 32],           
    pub wallet_delegate: Pubkey,  
    pub creator: Pubkey,          
    pub account_bump: u8,
    pub signer_bump: u8,
    pub delegate_transferred: bool
}

impl WalletAccount {
    pub fn init(
        &mut self,
        hash: [u8; 32],
        creator: Pubkey,
        wallet_delegate: Pubkey,
        wallet_account_bump: u8,
        wallet_signer_bump: u8,
    ) {
        self.hash = hash;
        self.creator = creator;
        self.wallet_delegate = wallet_delegate;
        self.account_bump = wallet_account_bump;
        self.signer_bump = wallet_signer_bump;
        self.delegate_transferred = false;
    }

    pub fn transfer_delegate(&mut self, new_delegate: Pubkey) {
        self.wallet_delegate = new_delegate;
        self.delegate_transferred = true;
    }

    pub fn creator() -> Pubkey {
        Pubkey::from_str("H1oFKfS8UZXawmD3GFnGgPziJcdHKswmtC9VYSoaKnWZ").unwrap()
    }
}
