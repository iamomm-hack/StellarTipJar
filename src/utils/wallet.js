/**
 * Freighter Wallet Integration
 * Handles wallet connection and signing
 */

// Development mode - set to true for testing without Freighter
const DEV_MODE = true; // ⚠️ TEMPORARILY ENABLED - debugging Freighter detection
const DEV_PUBLIC_KEY =
  "GBMQJ3G5LDWODZKUUQWGGT6NIKMM7KL5NLHVIG53WLNLWB27Z4AKH3F4";

// Expose DEV_MODE to window for detection in stellar.js
if (typeof window !== "undefined") {
  window.DEV_MODE_ACTIVE = DEV_MODE;
}

export async function isFreighterInstalled() {
  if (DEV_MODE) return true;

  if (typeof window === "undefined") return false;

  // Method 1: Check window.freighterApi
  if (window.freighterApi) return true;

  // Method 2: Check for Freighter in window (alternative detection)
  if (window.freighter) return true;

  // Method 3: Wait for extension to load (max 5 seconds)
  for (let i = 0; i < 50; i++) {
    if (window.freighterApi || window.freighter) return true;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return false;
}

export async function connectWallet() {
  // Development mode bypass
  if (DEV_MODE) {
    console.warn("🔧 DEV MODE: Using mock wallet connection");
    return DEV_PUBLIC_KEY;
  }

  const installed = await isFreighterInstalled();

  if (!installed) {
    const errorMsg = `Freighter wallet not detected!

Troubleshooting:
1. Install from: https://freighter.app
2. Enable extension in browser settings
3. Refresh this page completely
4. Try a different browser (Chrome/Brave/Edge)

Still not working? Set DEV_MODE = true in wallet.js for testing`;

    throw new Error(errorMsg);
  }

  try {
    // Try primary API
    if (window.freighterApi) {
      const publicKey = await window.freighterApi.getPublicKey();
      return publicKey;
    }

    // Try alternative API
    if (window.freighter) {
      const publicKey = await window.freighter.getPublicKey();
      return publicKey;
    }

    throw new Error("Freighter API not accessible");
  } catch (error) {
    if (error.message?.includes("User declined access")) {
      throw new Error("Wallet connection was declined");
    }
    throw new Error("Failed to connect wallet: " + error.message);
  }
}

export async function signTransaction(xdr, networkPassphrase) {
  // Development mode - return mock signed transaction
  if (DEV_MODE) {
    console.warn(
      "🔧 DEV MODE: Returning mock signed transaction (not real blockchain transaction)",
    );

    // Simulate signing delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return the XDR as-is (in real mode, Freighter signs it)
    // This allows the app flow to continue for UI testing
    return xdr;
  }

  if (!(await isFreighterInstalled())) {
    throw new Error("Freighter wallet is not installed");
  }

  try {
    // Try primary API
    if (window.freighterApi) {
      const signedXdr = await window.freighterApi.signTransaction(xdr, {
        networkPassphrase: networkPassphrase,
      });
      return signedXdr;
    }

    // Try alternative API
    if (window.freighter) {
      const signedXdr = await window.freighter.signTransaction(xdr, {
        network: networkPassphrase,
      });
      return signedXdr;
    }

    throw new Error("Freighter API not accessible");
  } catch (error) {
    if (error.message?.includes("User declined")) {
      throw new Error("Transaction was declined");
    }
    throw new Error("Failed to sign transaction: " + error.message);
  }
}

export function disconnectWallet() {
  // Freighter doesn't have explicit disconnect, just clear local state
  return true;
}
