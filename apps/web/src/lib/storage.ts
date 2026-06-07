import type { User } from "@dreemi/types";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";

interface JwtPayload {
  userId?: string;
  exp?: number;
}

/**
 * Returns true when browser localStorage is available (client-only).
 */
function canUseLocalStorage(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.localStorage !== "undefined"
  );
}

/**
 * Returns browser localStorage or null during SSR / unavailable contexts.
 */
function getLocalStorage(): Storage | null {
  if (!canUseLocalStorage()) return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function parseJwtPayload(token: string): JwtPayload | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    const payload = JSON.parse(json) as JwtPayload;
    if (typeof payload.exp !== "number" || typeof payload.userId !== "string") {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Validates a JWT access token expiry without reading browser storage.
 */
export function isAccessTokenValid(token: string | null): boolean {
  if (!token) return false;
  const payload = parseJwtPayload(token);
  if (!payload?.exp) return false;
  return payload.exp * 1000 > Date.now();
}

/**
 * Persists auth tokens and user profile in browser storage.
 */
export function saveAuth(
  accessToken: string,
  refreshToken: string,
  user: User
): void {
  const storage = getLocalStorage();
  if (!storage) return;
  try {
    storage.setItem(ACCESS_TOKEN_KEY, accessToken);
    storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    storage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    // Ignore quota/private-mode storage failures.
  }
}

/**
 * Reads the stored access token, or null during SSR / when unavailable.
 */
export function getAccessToken(): string | null {
  const storage = getLocalStorage();
  if (!storage) return null;
  try {
    return storage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

/**
 * Reads the stored user profile, or null during SSR / when unavailable.
 */
export function getStoredUser(): User | null {
  const storage = getLocalStorage();
  if (!storage) return null;
  const raw = storage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

/**
 * Updates the stored user profile in browser storage.
 */
export function saveUser(user: User): void {
  const storage = getLocalStorage();
  if (!storage) return;
  try {
    storage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    // Ignore quota/private-mode storage failures.
  }
}

/**
 * Returns whether a valid access token exists in browser storage.
 */
export function isAuthenticated(): boolean {
  return isAccessTokenValid(getAccessToken());
}

/**
 * Clears persisted auth data from browser storage.
 */
export function clearAuth(): void {
  const storage = getLocalStorage();
  if (!storage) return;
  try {
    storage.removeItem(ACCESS_TOKEN_KEY);
    storage.removeItem(REFRESH_TOKEN_KEY);
    storage.removeItem(USER_KEY);
  } catch {
    // Ignore storage failures during cleanup.
  }
}
