import { HttpError } from "./http-error.js";

export type SearchErrorKind = "abort" | "timeout" | "http" | "failure";

function errorName(error: unknown): string | undefined {
  if (typeof error !== "object" || error === null || !("name" in error)) {
    return undefined;
  }

  return typeof error.name === "string" ? error.name : undefined;
}

export function classifySearchError(error: unknown): SearchErrorKind {
  if (error instanceof HttpError) {
    return "http";
  }

  if (errorName(error) === "AbortError") {
    return "abort";
  }

  if (errorName(error) === "TimeoutError") {
    return "timeout";
  }

  return "failure";
}
