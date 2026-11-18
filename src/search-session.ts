export type SearchHit = {
  card: {
    name: string;
    flag: string;
    capital: string;
    region: string;
    population: number;
    languages: string[];
  };
  raw: unknown;
};

export type SearchState =
  | { kind: "cleared" }
  | { kind: "loading" }
  | { kind: "empty" }
  | { kind: "results"; hits: SearchHit[] }
  | { kind: "error"; query: string };

export type CountrySearch = (
  query: string,
  signal: AbortSignal,
) => Promise<unknown[]>;

export function createSearchSession(options: {
  delay: number;
  search?: CountrySearch;
  onChange: (state: SearchState) => void;
}): { setQuery: (text: string) => void } {
  void options;
  throw new Error("not implemented");
}
