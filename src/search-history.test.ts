import { describe, expect, it } from "@jest/globals";

import {
  rememberSearchQuery,
  readSearchHistory,
  SEARCH_HISTORY_KEY,
} from "./search-history.js";

function memoryStorage(): Storage {
  const items = new Map<string, string>();

  return {
    get length() {
      return items.size;
    },
    clear() {
      items.clear();
    },
    getItem(key: string) {
      return items.get(key) ?? null;
    },
    key(index: number) {
      return [...items.keys()][index] ?? null;
    },
    removeItem(key: string) {
      items.delete(key);
    },
    setItem(key: string, value: string) {
      items.set(key, value);
    },
  };
}

describe("search history", () => {
  it("stores a query and returns it first", () => {
    const storage = memoryStorage();

    expect(rememberSearchQuery(storage, " Spain ")).toEqual(["Spain"]);
    expect(readSearchHistory(storage)).toEqual(["Spain"]);
    expect(storage.getItem(SEARCH_HISTORY_KEY)).toBe(JSON.stringify(["Spain"]));
  });

  it("moves a repeated query to the front without duplicating its case", () => {
    const storage = memoryStorage();

    rememberSearchQuery(storage, "france");
    expect(rememberSearchQuery(storage, "France")).toEqual(["France"]);
  });

  it("keeps at most eight queries", () => {
    const storage = memoryStorage();

    for (let index = 0; index < 9; index += 1) {
      rememberSearchQuery(storage, `q${index}`);
    }

    expect(readSearchHistory(storage)).toHaveLength(8);
    expect(readSearchHistory(storage)[0]).toBe("q8");
  });

  it("returns an empty list when storage is unreadable", () => {
    const storage = memoryStorage();
    storage.setItem(SEARCH_HISTORY_KEY, "{");

    expect(readSearchHistory(storage)).toEqual([]);
  });
});
