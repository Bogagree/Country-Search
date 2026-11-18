import { describe, expect, it } from "@jest/globals";

import { classifySearchError } from "./classify-error.js";
import { HttpError } from "./http-error.js";

describe("classifySearchError", () => {
  it("classifies AbortError as abort", () => {
    expect(
      classifySearchError(
        new DOMException("The operation was aborted", "AbortError"),
      ),
    ).toBe("abort");
  });

  it("classifies TimeoutError as timeout", () => {
    expect(
      classifySearchError(
        new DOMException("The operation timed out", "TimeoutError"),
      ),
    ).toBe("timeout");
  });

  it("classifies HttpError as http", () => {
    expect(classifySearchError(new HttpError(503))).toBe("http");
  });

  it("classifies a network failure as failure", () => {
    expect(classifySearchError(new TypeError("Failed to fetch"))).toBe(
      "failure",
    );
  });
});
