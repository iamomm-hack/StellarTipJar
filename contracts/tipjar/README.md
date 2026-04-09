# TipJar Soroban Contract

This contract is used by the frontend to satisfy Yellow Belt Level 2 requirements.

## Methods

- record_tip(tipper: Address, amount: i128) -> i128
- get_total_tips() -> i128
- get_tip_count() -> u64
- get_supporter_total(tipper: Address) -> i128

All amounts are expected in stroops (1 XLM = 10,000,000 stroops).

## Local Build

1. Install Rust and Stellar CLI.
2. From this folder run:

```bash
cargo build --target wasm32-unknown-unknown --release
stellar contract optimize --wasm target/wasm32-unknown-unknown/release/tipjar_contract.wasm
```

## Deploy on Testnet

```bash
stellar keys generate --global tipjar-admin
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/tipjar_contract.optimized.wasm \
  --source tipjar-admin \
  --network testnet
```

Copy the output contract id to VITE_TIP_CONTRACT_ID in your .env.

## Smoke Test

```bash
stellar contract invoke \
  --id <YOUR_CONTRACT_ID> \
  --source tipjar-admin \
  --network testnet \
  -- record_tip --tipper <PUBLIC_KEY> --amount 10000000
```

The transaction hash from this command can be used in your Level 2 README evidence section.
