import * as StellarSdk from "stellar-sdk";
import {
  HORIZON_URL,
  NETWORK_PASSPHRASE,
  getExplorerLink,
} from "./stellar";
import { signTransaction } from "./wallet";

export const SOROBAN_RPC_URL = "https://soroban-testnet.stellar.org";
export const STROOPS_PER_XLM = 10_000_000;

const sorobanServer = new StellarSdk.SorobanRpc.Server(SOROBAN_RPC_URL);
const horizonServer = new StellarSdk.Horizon.Server(HORIZON_URL);

const contractConfig = {
  contractId: import.meta.env.VITE_TIP_CONTRACT_ID || "",
  readMethod: import.meta.env.VITE_TIP_CONTRACT_READ_METHOD || "get_total_tips",
  writeMethod: import.meta.env.VITE_TIP_CONTRACT_WRITE_METHOD || "record_tip",
};

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isObject(value) {
  return typeof value === "object" && value !== null;
}

function toReadableError(error, fallback) {
  if (!error) return fallback;

  if (typeof error === "string") return error;

  if (error?.message) return error.message;

  if (error?.errorResult?.toXDR) {
    return `Soroban error result: ${error.errorResult.toXDR("base64")}`;
  }

  return fallback;
}

function normalizeNativeValue(value) {
  if (typeof value === "bigint") {
    return value.toString();
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeNativeValue(item));
  }

  if (isObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, innerValue]) => [
        key,
        normalizeNativeValue(innerValue),
      ]),
    );
  }

  return value;
}

function toStroops(xlmAmount) {
  const amount = Number(xlmAmount);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Invalid tip amount for contract call");
  }

  const stroops = Math.round(amount * STROOPS_PER_XLM);
  if (stroops <= 0) {
    throw new Error("Tip amount is too small for contract precision");
  }

  return BigInt(stroops);
}

function fromStroops(stroopsValue) {
  const stroops = typeof stroopsValue === "bigint"
    ? stroopsValue
    : BigInt(stroopsValue || 0);

  return Number(stroops) / STROOPS_PER_XLM;
}

function parseScValToNative(scVal) {
  if (!scVal) return null;

  try {
    return StellarSdk.scValToNative(scVal);
  } catch {
    return null;
  }
}

function ensureContractConfigured() {
  if (!contractConfig.contractId || !contractConfig.contractId.startsWith("C")) {
    throw new Error(
      "Contract is not configured. Set VITE_TIP_CONTRACT_ID in your environment.",
    );
  }
}

async function pollForFinalizedTransaction(hash, maxAttempts = 25) {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const response = await sorobanServer.getTransaction(hash);

    if (
      response.status === StellarSdk.SorobanRpc.Api.GetTransactionStatus.SUCCESS
    ) {
      return response;
    }

    if (response.status === StellarSdk.SorobanRpc.Api.GetTransactionStatus.FAILED) {
      throw new Error("Contract transaction failed on-chain");
    }

    await wait(1500);
  }

  throw new Error("Timed out waiting for contract transaction confirmation");
}

async function buildPreparedInvocation({ sourcePublicKey, methodName, args = [] }) {
  const sourceAccount = await horizonServer.loadAccount(sourcePublicKey);
  const contract = new StellarSdk.Contract(contractConfig.contractId);

  const tx = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(methodName, ...args))
    .setTimeout(180)
    .build();

  return sorobanServer.prepareTransaction(tx);
}

export function isContractConfigured() {
  return Boolean(
    contractConfig.contractId && contractConfig.contractId.startsWith("C"),
  );
}

export function getContractConfig() {
  return { ...contractConfig };
}

export async function readTotalTipsFromContract(sourcePublicKey) {
  ensureContractConfigured();

  const simulationSource = sourcePublicKey || import.meta.env.VITE_TIP_READER_PUBLIC_KEY;

  if (!simulationSource) {
    throw new Error(
      "No reader account configured for contract sync. Connect a wallet or set VITE_TIP_READER_PUBLIC_KEY.",
    );
  }

  const prepared = await buildPreparedInvocation({
    sourcePublicKey: simulationSource,
    methodName: contractConfig.readMethod,
  });

  const simulation = await sorobanServer.simulateTransaction(prepared);

  if (StellarSdk.SorobanRpc.Api.isSimulationError(simulation)) {
    throw new Error(simulation.error || "Contract read simulation failed");
  }

  const native = parseScValToNative(simulation.result?.retval);
  if (native === null || native === undefined) {
    return {
      totalTipsXlm: 0,
      totalTipsStroops: "0",
    };
  }

  const totalStroops =
    typeof native === "bigint"
      ? native
      : BigInt(typeof native === "number" ? Math.trunc(native) : native);

  return {
    totalTipsXlm: fromStroops(totalStroops),
    totalTipsStroops: totalStroops.toString(),
  };
}

export async function recordTipOnContract({ senderPublicKey, amountXlm }) {
  ensureContractConfigured();

  if (!senderPublicKey) {
    throw new Error("Wallet public key is required for contract invocation");
  }

  const amountStroops = toStroops(amountXlm);

  const prepared = await buildPreparedInvocation({
    sourcePublicKey: senderPublicKey,
    methodName: contractConfig.writeMethod,
    args: [
      StellarSdk.Address.fromString(senderPublicKey).toScVal(),
      StellarSdk.nativeToScVal(amountStroops, { type: "i128" }),
    ],
  });

  const signedXdr = await signTransaction(prepared.toXDR(), NETWORK_PASSPHRASE);
  const signedTx = StellarSdk.TransactionBuilder.fromXDR(
    signedXdr,
    NETWORK_PASSPHRASE,
  );

  const sendResponse = await sorobanServer.sendTransaction(signedTx);

  if (sendResponse.status === "ERROR") {
    throw new Error(
      toReadableError(sendResponse, "Failed to submit contract transaction"),
    );
  }

  if (sendResponse.status === "TRY_AGAIN_LATER") {
    throw new Error("Soroban RPC is busy. Please retry in a few seconds.");
  }

  const finalResponse = await pollForFinalizedTransaction(sendResponse.hash);

  const totalNative = parseScValToNative(finalResponse.returnValue);
  const totalStroops =
    typeof totalNative === "bigint"
      ? totalNative
      : BigInt(typeof totalNative === "number" ? Math.trunc(totalNative) : totalNative || 0);

  return {
    hash: sendResponse.hash,
    status: "success",
    totalTipsStroops: totalStroops.toString(),
    totalTipsXlm: fromStroops(totalStroops),
  };
}

export async function fetchContractEvents({ cursor, limit = 20 } = {}) {
  ensureContractConfigured();

  const response = await sorobanServer.getEvents({
    cursor,
    limit,
    filters: [
      {
        type: "contract",
        contractIds: [contractConfig.contractId],
      },
    ],
  });

  const mappedEvents = (response.events || []).map((event) => {
    const topic = (event.topic || []).map((item) =>
      normalizeNativeValue(parseScValToNative(item)),
    );

    const value = normalizeNativeValue(parseScValToNative(event.value));

    return {
      id: event.id,
      ledger: event.ledger,
      type: event.type,
      topic,
      value,
      pagingToken: event.pagingToken,
      contractId: event.contractId?.contractId?.() || contractConfig.contractId,
      timestamp: event.ledgerClosedAt,
      explorerLink: getExplorerLink(event.id),
    };
  });

  return {
    events: mappedEvents,
    latestLedger: response.latestLedger,
    cursor:
      mappedEvents.length > 0
        ? mappedEvents[mappedEvents.length - 1].pagingToken
        : cursor,
  };
}

export function startContractEventStream({
  initialCursor,
  intervalMs = 12000,
  onEvents,
  onError,
}) {
  if (!isContractConfigured()) {
    return () => {};
  }

  let isActive = true;
  let cursor = initialCursor;

  const syncEvents = async () => {
    if (!isActive) return;

    try {
      const result = await fetchContractEvents({ cursor });
      cursor = result.cursor;

      if (result.events.length > 0 && onEvents) {
        onEvents(result);
      }
    } catch (error) {
      if (onError) {
        onError(error);
      }
    }
  };

  syncEvents();
  const timer = setInterval(syncEvents, intervalMs);

  return () => {
    isActive = false;
    clearInterval(timer);
  };
}

export function getContractTxExplorerLink(hash) {
  return getExplorerLink(hash);
}
