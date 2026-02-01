/**
 * Freighter Wallet Integration
 * Handles wallet connection and signing
 */

export async function isFreighterInstalled() {
  return typeof window !== 'undefined' && window.freighterApi !== undefined;
}

export async function connectWallet() {
  if (!await isFreighterInstalled()) {
    throw new Error('Freighter wallet is not installed. Please install it from freighter.app');
  }

  try {
    const publicKey = await window.freighterApi.getPublicKey();
    return publicKey;
  } catch (error) {
    if (error.message?.includes('User declined access')) {
      throw new Error('Wallet connection was declined');
    }
    throw new Error('Failed to connect wallet: ' + error.message);
  }
}

export async function signTransaction(xdr, networkPassphrase) {
  if (!await isFreighterInstalled()) {
    throw new Error('Freighter wallet is not installed');
  }

  try {
    const signedXdr = await window.freighterApi.signTransaction(xdr, {
      networkPassphrase: networkPassphrase,
    });
    return signedXdr;
  } catch (error) {
    if (error.message?.includes('User declined')) {
      throw new Error('Transaction was declined');
    }
    throw new Error('Failed to sign transaction: ' + error.message);
  }
}

export function disconnectWallet() {
  // Freighter doesn't have explicit disconnect, just clear local state
  return true;
}
