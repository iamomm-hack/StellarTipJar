import { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit/sdk";
import { defaultModules } from "@creit.tech/stellar-wallets-kit/modules/utils";
import { Networks } from "@creit.tech/stellar-wallets-kit/types";

const SUPPORTED_WALLETS = new Set(["freighter", "albedo", "xbull"]);

const WalletErrorType = {
  WALLET_NOT_FOUND: "wallet_not_found",
  WALLET_REJECTED: "wallet_rejected",
  UNKNOWN: "wallet_unknown",
};

let isKitInitialized = false;
let connectedWalletMeta = {
  walletId: "",
  walletName: "",
};

function initWalletKit() {
  if (isKitInitialized || typeof window === "undefined") return;

  StellarWalletsKit.init({
    modules: defaultModules({
      filterBy: (module) => SUPPORTED_WALLETS.has(module.productId),
    }),
    network: Networks.TESTNET,
    authModal: {
      showInstallLabel: true,
      hideUnsupportedWallets: false,
    },
  });

  isKitInitialized = true;
}

function isRejectedError(message) {
  return /declined|rejected|denied|canceled|cancelled|closed the modal/i.test(
    message,
  );
}

function isWalletNotFoundError(message) {
  return /not connected|not installed|not found|no wallet|no module|install/i.test(
    message,
  );
}

function normalizeWalletError(error, fallbackMessage) {
  const message = error?.message || fallbackMessage;
  const normalized = new Error(message);

  if (isRejectedError(message)) {
    normalized.type = WalletErrorType.WALLET_REJECTED;
  } else if (isWalletNotFoundError(message)) {
    normalized.type = WalletErrorType.WALLET_NOT_FOUND;
  } else {
    normalized.type = WalletErrorType.UNKNOWN;
  }

  normalized.code = error?.code;
  normalized.ext = error?.ext;
  normalized.originalError = error;

  return normalized;
}

function setWalletWindowState(walletId, walletName) {
  if (typeof window === "undefined") return;

  window.DEV_MODE_ACTIVE = false;
  window.WALLET_TYPE = walletId || "";
  window.WALLET_NAME = walletName || "";
}

/**
 * Connect using StellarWalletsKit auth modal.
 * Supports multiple wallets (Freighter, Albedo, xBull).
 */
export async function connectWallet() {
  initWalletKit();

  try {
    const { address } = await StellarWalletsKit.authModal();
    const selected = StellarWalletsKit.selectedModule;

    connectedWalletMeta = {
      walletId: selected.productId,
      walletName: selected.productName,
    };

    setWalletWindowState(connectedWalletMeta.walletId, connectedWalletMeta.walletName);

    return {
      address,
      ...connectedWalletMeta,
    };
  } catch (error) {
    throw normalizeWalletError(error, "Failed to connect wallet");
  }
}

/**
 * Disconnect active wallet and clear local kit state.
 */
export async function disconnectWallet() {
  initWalletKit();

  try {
    await StellarWalletsKit.disconnect();
  } catch (error) {
    console.warn("Wallet disconnect warning:", error);
  } finally {
    connectedWalletMeta = { walletId: "", walletName: "" };
    setWalletWindowState("", "");
  }
}

/**
 * Sign transaction XDR with active wallet.
 */
export async function signTransaction(xdr, networkPassphrase) {
  initWalletKit();

  try {
    let address;

    try {
      const current = await StellarWalletsKit.getAddress();
      address = current.address;
    } catch (error) {
      // Address can be omitted in most wallets; kit will use active account.
      address = undefined;
    }

    const result = await StellarWalletsKit.signTransaction(xdr, {
      networkPassphrase,
      address,
    });

    return result.signedTxXdr;
  } catch (error) {
    throw normalizeWalletError(error, "Failed to sign transaction");
  }
}

/**
 * Check if at least one supported wallet is available.
 */
export async function isWalletAvailable() {
  initWalletKit();

  try {
    const wallets = await StellarWalletsKit.refreshSupportedWallets();
    return wallets.some(
      (wallet) => SUPPORTED_WALLETS.has(wallet.id) && wallet.isAvailable,
    );
  } catch (error) {
    console.warn("Wallet availability check failed:", error);
    return false;
  }
}

/**
 * Expose connected wallet metadata for UI labels.
 */
export function getConnectedWalletMeta() {
  return { ...connectedWalletMeta };
}

/**
 * Expose available wallet modules for UX hints.
 */
export async function getAvailableWallets() {
  initWalletKit();

  try {
    const wallets = await StellarWalletsKit.refreshSupportedWallets();
    return wallets.filter((wallet) => SUPPORTED_WALLETS.has(wallet.id));
  } catch (error) {
    console.warn("Failed to fetch available wallets:", error);
    return [];
  }
}

export { WalletErrorType };
