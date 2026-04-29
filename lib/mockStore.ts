// Module-singleton in-memory store for the mock result-contract service.
// Process-local; resets on dev-server restart. Intentionally simple — this
// is the demo mock, not production state.

import { randomBytes } from "node:crypto";

export type ContractStatus =
  | "accepted"
  | "delivered"
  | "judged"
  | "settled"
  | "refunded"
  | "expired";

export type Verdict = "pass" | "fail";

export type ResultContract = {
  id: string;
  buyerApiKeyId: string;
  sellerApiKeyId: string;
  rubric: string;
  judgeModel: string;
  price: { amount: string; currency: string };
  status: ContractStatus;
  verdict: Verdict | null;
  verdictNotes: string | null;
  deliverableUrl: string | null;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
};

export type ResultRequest = {
  id: string;
  buyerApiKeyId: string;
  topic: string;
  rubric: string;
  budgetMax: { amount: string; currency: string };
  createdAt: string;
  quoteIds: string[];
};

export type ResultQuote = {
  id: string;
  requestId: string;
  sellerApiKeyId: string;
  price: { amount: string; currency: string };
  judgeModel: string;
  etaSeconds: number;
  createdAt: string;
  acceptedAs: string | null;  // contract id once accepted
};

type Store = {
  requests: Map<string, ResultRequest>;
  quotes: Map<string, ResultQuote>;
  contracts: Map<string, ResultContract>;
};

// Global singleton that survives Next.js hot reload in dev
declare global {
  var __pancakeMockStore: Store | undefined;
}

const store: Store =
  globalThis.__pancakeMockStore ?? {
    requests: new Map(),
    quotes: new Map(),
    contracts: new Map(),
  };

if (!globalThis.__pancakeMockStore) {
  globalThis.__pancakeMockStore = store;
}

export function getStore(): Store {
  return store;
}

// Short-ID helper mirroring Pancake conventions (prefix + base62 of random bytes)
const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export function shortId(prefix: string, byteLength = 16): string {
  const bytes = randomBytes(byteLength);
  let n = 0n;
  for (const b of bytes) n = (n << 8n) | BigInt(b);
  let out = "";
  while (n > 0n) {
    out = BASE62[Number(n % 62n)] + out;
    n /= 62n;
  }
  return `${prefix}_${out || "0"}`;
}

export function now(): string {
  return new Date().toISOString();
}

export function plus(seconds: number): string {
  return new Date(Date.now() + seconds * 1000).toISOString();
}
