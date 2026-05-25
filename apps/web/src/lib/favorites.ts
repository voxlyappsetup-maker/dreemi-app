const FAVORITES_KEY = "qisas_favorites";

export function getFavoriteIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isFavorite(storyId: string): boolean {
  return getFavoriteIds().includes(storyId);
}

export function toggleFavorite(storyId: string): boolean {
  const ids = getFavoriteIds();
  const exists = ids.includes(storyId);
  const next = exists ? ids.filter((id) => id !== storyId) : [...ids, storyId];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  return !exists;
}
