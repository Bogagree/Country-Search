export type SearchErrorKind = "abort" | "timeout" | "http" | "failure";

export function classifySearchError(error: unknown): SearchErrorKind {
  void error;
  throw new Error("not implemented");
}
