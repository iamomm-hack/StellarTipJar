/**
 * Stellar Network Integration
 * Handles balance fetching and transactions
 */

import * as StellarSdk from "stellar-sdk";

// Testnet configuration
export const HORIZON_URL = "https://horizon-testnet.stellar.org";
export const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;

const server = new StellarSdk.Horizon.Server(HORIZON_URL);

/**
 * Fetch XLM balance for a public key
 */
export async function getBalance(publicKey) {
  try {
    const account = await server.loadAccount(publicKey);

    // Find native XLM balance
    const xlmBalance = account.balances.find(
      (balance) => balance.asset_type === "native",
    );

    return xlmBalance ? parseFloat(xlmBalance.balance) : 0;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // Account not funded yet
      return 0;
    }
    throw new Error("Failed to fetch balance: " + error.message);
  }
}

/**
 * Build a payment transaction
 */
export async function buildPaymentTransaction(
  senderPublicKey,
  destinationAddress,
  amount,
) {
  try {
    // Load sender account
    const senderAccount = await server.loadAccount(senderPublicKey);

    // Build transaction
    const transaction = new StellarSdk.TransactionBuilder(senderAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: destinationAddress,
          asset: StellarSdk.Asset.native(),
          amount: amount.toString(),
        }),
      )
      .setTimeout(180)
      .addMemo(StellarSdk.Memo.text("Stellar Tip Jar ☕"))
      .build();

    return transaction.toXDR();
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error("Your account needs to be funded with testnet XLM first");
    }
    throw new Error("Failed to build transaction: " + error.message);
  }
}

/**
 * Submit a signed transaction
 */
export async function submitTransaction(signedXdr) {
  // Check if this is a mock transaction (DEV_MODE)
  // In DEV_MODE, wallet.js returns unsigned XDR, so we detect it and return fake hash
  const isMockTransaction = !signedXdr.includes("AAAA"); // Simple check for signed vs unsigned

  if (
    isMockTransaction ||
    (typeof window !== "undefined" && window.DEV_MODE_ACTIVE)
  ) {
    console.warn(
      "🔧 DEV MODE: Generating mock transaction hash (not submitted to blockchain)",
    );

    // Generate a fake but realistic-looking Stellar transaction hash
    const fakeHash = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16),
    ).join("");

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return fakeHash;
  }

  try {
    const transaction = StellarSdk.TransactionBuilder.fromXDR(
      signedXdr,
      NETWORK_PASSPHRASE,
    );

    const result = await server.submitTransaction(transaction);
    return result.hash;
  } catch (error) {
    if (error.response && error.response.data) {
      const extras = error.response.data.extras;
      if (extras && extras.result_codes) {
        throw new Error(
          "Transaction failed: " + JSON.stringify(extras.result_codes),
        );
      }
    }
    throw new Error("Failed to submit transaction: " + error.message);
  }
}

/**
 * Helper to shorten Stellar addresses
 */
export function shortenAddress(address) {
  if (!address) return "";
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

/**
 * Helper to copy to clipboard
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy:", error);
    return false;
  }
}

/**
 * Generate Stellar testnet explorer link
 */
export function getExplorerLink(hash) {
  return `https://stellar.expert/explorer/testnet/tx/${hash}`;
}
