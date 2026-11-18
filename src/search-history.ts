export const SEARCH_HISTORY_KEY = "country-search-history";
const MAX_HISTORY = 8;

export function readSearchHistory(storage: Storage): string[] {
  try {
    const raw = storage.getItem(SEARCH_HISTORY_KEY);

    if (raw === null) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

export function rememberSearchQuery(storage: Storage, query: string): string[] {
  const trimmed = query.trim();

  if (trimmed.length === 0) {
    return readSearchHistory(storage);
  }

  const next = [
    trimmed,
    ...readSearchHistory(storage).filter(
      (item) => item.toLowerCase() !== trimmed.toLowerCase(),
    ),
  ].slice(0, MAX_HISTORY);

  try {
    storage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(next));
  } catch {
    return readSearchHistory(storage);
  }

  return next;
}
