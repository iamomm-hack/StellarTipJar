import * as StellarSdk from "stellar-sdk";

export const HORIZON_URL = "https://horizon-testnet.stellar.org";
export const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;

const server = new StellarSdk.Horizon.Server(HORIZON_URL);

export async function getBalance(publicKey) {
  try {
    const account = await server.loadAccount(publicKey);

    const xlmBalance = account.balances.find(
      (balance) => balance.asset_type === "native",
    );

    return xlmBalance ? parseFloat(xlmBalance.balance) : 0;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return 0;
    }
    throw new Error("Failed to fetch balance: " + error.message);
  }
}

export async function buildPaymentTransaction(
  senderPublicKey,
  destinationAddress,
  amount,
) {
  try {
    const senderAccount = await server.loadAccount(senderPublicKey);

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

export async function submitTransaction(signedXdr) {
  const isMockTransaction = !signedXdr.includes("AAAA");

  if (
    isMockTransaction ||
    (typeof window !== "undefined" && window.DEV_MODE_ACTIVE)
  ) {
    console.warn(
      "🔧 DEV MODE: Generating mock transaction hash (not submitted to blockchain)",
    );

    const fakeHash = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16),
    ).join("");

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

export function shortenAddress(address) {
  if (!address) return "";
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy:", error);
    return false;
  }
}

export function getExplorerLink(hash) {
  return `https://stellar.expert/explorer/testnet/tx/${hash}`;
}
