import * as StellarSdk from "stellar-sdk";

// Reverting to DEV_MODE as requested to avoid dependency issues
const DEV_MODE = true;
// Using the previous test key
const DEV_PUBLIC_KEY =
  "GBMQJ3G5LDWODZKUUQWGGT6NIKMM7KL5NLHVIG53WLNLWB27Z4AKH3F4";

if (typeof window !== "undefined") {
  window.DEV_MODE_ACTIVE = DEV_MODE;
}

export async function isFreighterInstalled() {
  // Always return true in Dev Mode to simulate wallet presence
  if (DEV_MODE) return true;

  // Fallback to manual window checks if Dev Mode is disabled in future
  if (typeof window === "undefined") return false;
  if (window.freighterApi) return true;
  if (window.freighter) return true;

  // Retry logic for detection (manual)
  for (let i = 0; i < 10; i++) {
    if (window.freighterApi || window.freighter) return true;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return false;
}

export async function connectWallet() {
  if (DEV_MODE) {
    console.warn("🔧 DEV MODE: Using mock wallet connection");
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return DEV_PUBLIC_KEY;
  }

  // Manual Freighter connection logic (Fallback)
  const installed = await isFreighterInstalled();

  if (!installed) {
    throw new Error(
      "Freighter wallet not detected! Please install it from freighter.app",
    );
  }

  try {
    if (window.freighterApi) {
      return await window.freighterApi.getPublicKey();
    }
    if (window.freighter) {
      return await window.freighter.getPublicKey();
    }
    throw new Error("Freighter API not accessible");
  } catch (error) {
    if (error.message?.includes("User declined")) {
      throw new Error("Wallet connection was declined");
    }
    throw new Error("Failed to connect wallet: " + error.message);
  }
}

export async function signTransaction(xdr, networkPassphrase) {
  if (DEV_MODE) {
    console.warn(
      "🔧 DEV MODE: Returning mock signed transaction (not real blockchain transaction)",
    );
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate signing delay
    return xdr; // In mock mode, we just return the XDR as "signed"
  }

  if (!(await isFreighterInstalled())) {
    throw new Error("Freighter wallet is not installed");
  }

  try {
    if (window.freighterApi) {
      return await window.freighterApi.signTransaction(xdr, {
        networkPassphrase: networkPassphrase,
      });
    }
    if (window.freighter) {
      return await window.freighter.signTransaction(xdr, {
        network: networkPassphrase,
      });
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
  return true;
}
