use anchor_lang::prelude::*;

const COUNTER_SEEDS: &[u8] = b"counter";
declare_id!("H9nFQRTmB6t1xNrRnMAnrCtdRuMYFFYxFPvNTGRgP6Am");

#[program]
pub mod demo_program {
    use super::*;

    pub fn create_counter(ctx: Context<CreateCounter>) -> Result<()> {
        let counter = ctx.accounts.counter.key();
        let authority = ctx.accounts.authority.key();
        let bump = ctx.bumps.counter;

        ctx.accounts.counter.init(
            counter, 
            authority, 
            bump
        );
        Ok(())
    }

    pub fn increment_count(ctx: Context<IncrementCount>) -> Result<()> {
        ctx.accounts.counter.increment_count();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateCounter<'info> {
    #[account(
        init, 
        payer=authority, 
        space=8+std::mem::size_of::<Counter>(),
        seeds=[COUNTER_SEEDS,authority.key().as_ref()],
        bump, 
    )]
    pub counter: Account<'info, Counter>,
    
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(address = anchor_lang::system_program::ID)]
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct IncrementCount<'info> {
    #[account(
        mut, 
        has_one=authority,
        seeds=[COUNTER_SEEDS,authority.key().as_ref()],
        bump=counter.bump,
    )]
    pub counter: Account<'info, Counter>,

    #[account(mut)]
    pub authority: Signer<'info>,
}

#[account]
pub struct Counter {
    pub pubkey: Pubkey, // 32
    pub authority: Pubkey, // 32
    pub count: u64, // 8,
    pub bump: u8, // 1
}

impl Counter {
    pub fn init(
        &mut self, 
        pubkey: Pubkey, 
        authority: Pubkey, 
        bump: u8
    ) {
        self.pubkey = pubkey;
        self.authority = authority;
        self.bump = bump;
    }

    pub fn increment_count(&mut self) {
        self.count = self.count + 1;
    }
}