# Multi-Wallet Usage Guide

This app now uses StellarWalletsKit for multi-wallet support.

Supported wallets in current setup:
- Freighter
- Albedo
- xBull

## How connection works

1. User clicks Choose Wallet
2. StellarWalletsKit auth modal opens
3. User selects wallet and approves
4. App stores public key + selected wallet metadata

## Signing flow

The same wallet signs both:
- XLM payment transaction
- Soroban contract invocation transaction

## Important files

- src/utils/wallet.js
  - connectWallet
  - signTransaction
  - disconnectWallet
  - wallet error normalization

- src/components/WalletConnect.jsx
  - Compact navbar wallet UI
  - Full connect card UI

## Error types handled

- wallet_not_found
- wallet_rejected
- wallet_unknown

## Contract + wallet integration

When a tip is sent:
1. Payment tx is signed in connected wallet
2. Contract tx is signed in the same wallet
3. UI tracks status from pending to success/failed

## Notes

- Network is fixed to Stellar testnet for this project.
- If no wallet is installed, Albedo and xBull remain available as web options.
