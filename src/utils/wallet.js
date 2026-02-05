import albedo from "@albedo-link/intent";

/**
 * Albedo Wallet Integration
 * Web-based wallet - works perfectly on localhost!
 */

const DEV_MODE = false;
const DEV_PUBLIC_KEY =
  "GBMQJ3G5LDWODZKUUQWGGT6NIKMM7KL5NLHVIG53WLNLWB27Z4AKH3F4";

if (typeof window !== "undefined") {
  window.DEV_MODE_ACTIVE = DEV_MODE;
  window.WALLET_TYPE = "albedo";
}

/**
 * Connect to Albedo wallet
 * Opens web popup for user approval
 */
export async function connectWallet() {
  if (DEV_MODE) {
    console.warn("🔧 DEV MODE: Using mock wallet connection");
    await new Promise((resolve) => setTimeout(resolve, 300));
    return DEV_PUBLIC_KEY;
  }

  try {
    console.log("📞 Connecting to Albedo wallet...");
    const result = await albedo.publicKey({
      require_existing: false,
    });
    console.log("✅ Albedo connected! Public Key:", result.pubkey);
    return result.pubkey;
  } catch (error) {
    if (error.message?.includes("canceled")) {
      throw new Error("Wallet connection was canceled");
    }
    throw new Error("Failed to connect Albedo wallet: " + error.message);
  }
}

/**
 * Disconnect wallet (just clears local state)
 */
export function disconnectWallet() {
  console.log("🔌 Wallet disconnected");
  // Albedo is stateless, nothing to do
}

/**
 * Sign transaction with Albedo
 * @param {string} xdr - Transaction XDR
 * @param {string} networkPassphrase - Network passphrase
 * @returns {Promise<string>} Signed transaction XDR
 */
export async function signTransaction(xdr, networkPassphrase) {
  if (DEV_MODE) {
    console.warn(
      "🔧 DEV MODE: Returning mock signed transaction (not real blockchain transaction)",
    );
    await new Promise((resolve) => setTimeout(resolve, 800));
    return xdr; // In mock mode, return XDR as "signed"
  }

  try {
    console.log("📝 Requesting Albedo signature...");

    // Determine network from passphrase
    const network = networkPassphrase.includes("Test") ? "testnet" : "public";

    const result = await albedo.tx({
      xdr: xdr,
      network: network,
      submit: false, // We'll submit ourselves
    });

    console.log("✅ Transaction signed by Albedo");
    return result.signed_envelope_xdr;
  } catch (error) {
    if (error.message?.includes("canceled")) {
      throw new Error("Transaction was declined");
    }
    throw new Error("Failed to sign transaction: " + error.message);
  }
}

/**
 * Check if wallet is available
 * Albedo is always available (web-based)
 */
export async function isWalletAvailable() {
  return true; // Albedo is always available
}
