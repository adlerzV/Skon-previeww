"use client";

const STORAGE_PREFIX = "a2b_cred_";
const CREDENTIAL_TTL_MS = 24 * 60 * 60 * 1000;
interface StoredCredentialEnvelope {
  version: 1;
  savedAt: number;
  credentials: StoredCredentials;
}

export interface StoredCredentials {
  email?: string;
  password?: string;
  battleTag?: string;
}

function isBrowser() {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

export function saveCredentials(itemId: string, credentials: StoredCredentials): void {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.setItem(STORAGE_PREFIX + itemId, JSON.stringify({ version: 1, savedAt: Date.now(), credentials } satisfies StoredCredentialEnvelope));
  } catch {
  }
}

export function getCredentials(itemId: string): StoredCredentials | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_PREFIX + itemId);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredCredentialEnvelope>;
    if (parsed.version !== 1 || typeof parsed.savedAt !== "number" || !parsed.credentials) {
      // Do not revive legacy/plaintext records from older builds.
      window.sessionStorage.removeItem(STORAGE_PREFIX + itemId);
      return null;
    }
    if (Date.now() - parsed.savedAt > CREDENTIAL_TTL_MS) {
      window.sessionStorage.removeItem(STORAGE_PREFIX + itemId);
      return null;
    }
    return parsed.credentials;
  } catch {
    return null;
  }
}

export function removeCredentials(itemId: string): void {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.removeItem(STORAGE_PREFIX + itemId);
  } catch {
  }
}
export function clearAllCredentials(): void {
  if (!isBrowser()) return;
  try {
    const keys: string[] = [];
    for (let i = 0; i < window.sessionStorage.length; i += 1) {
      const key = window.sessionStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) keys.push(key);
    }
    keys.forEach((key) => window.sessionStorage.removeItem(key));
  } catch {
  }
}
