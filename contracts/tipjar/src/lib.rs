#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env};

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    TotalTips,
    TipCount,
    SupporterTotal(Address),
}

#[contract]
pub struct TipJarContract;

#[contractimpl]
impl TipJarContract {
    pub fn record_tip(env: Env, tipper: Address, amount: i128) -> i128 {
        tipper.require_auth();

        if amount <= 0 {
            panic!("amount must be positive");
        }

        let mut total_tips = env
            .storage()
            .instance()
            .get::<_, i128>(&DataKey::TotalTips)
            .unwrap_or(0);

        total_tips += amount;
        env.storage().instance().set(&DataKey::TotalTips, &total_tips);

        let mut tip_count = env
            .storage()
            .instance()
            .get::<_, u64>(&DataKey::TipCount)
            .unwrap_or(0);

        tip_count += 1;
        env.storage().instance().set(&DataKey::TipCount, &tip_count);

        let supporter_key = DataKey::SupporterTotal(tipper.clone());
        let mut supporter_total = env
            .storage()
            .instance()
            .get::<_, i128>(&supporter_key)
            .unwrap_or(0);

        supporter_total += amount;
        env.storage().instance().set(&supporter_key, &supporter_total);

        env.events()
            .publish((symbol_short!("tip"), tipper), (amount, total_tips, tip_count));

        total_tips
    }

    pub fn get_total_tips(env: Env) -> i128 {
        env.storage()
            .instance()
            .get::<_, i128>(&DataKey::TotalTips)
            .unwrap_or(0)
    }

    pub fn get_tip_count(env: Env) -> u64 {
        env.storage()
            .instance()
            .get::<_, u64>(&DataKey::TipCount)
            .unwrap_or(0)
    }

    pub fn get_supporter_total(env: Env, tipper: Address) -> i128 {
        env.storage()
            .instance()
            .get::<_, i128>(&DataKey::SupporterTotal(tipper))
            .unwrap_or(0)
    }
}
