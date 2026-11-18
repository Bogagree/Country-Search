import { describe, expect, it } from "@jest/globals";

import { HttpError } from "./http-error.js";

describe("HttpError", () => {
  it("keeps the response status", () => {
    const error = new HttpError(500);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(HttpError);
    expect(error.status).toBe(500);
  });
});
