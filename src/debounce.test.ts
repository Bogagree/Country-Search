import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";

import { debounce } from "./debounce.js";

const delay = 200;

describe("debounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("calls fn once with the original argument only after the full delay", () => {
    const fn = jest.fn<(value: number) => void>();
    const debounced = debounce(fn, delay);

    debounced(1);
    jest.advanceTimersByTime(delay - 1);

    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(1);
  });

  it("resets the timer and calls fn once with the latest argument", () => {
    const fn = jest.fn<(value: number) => void>();
    const debounced = debounce(fn, delay);

    debounced(1);
    jest.advanceTimersByTime(delay - 1);
    debounced(2);
    jest.advanceTimersByTime(delay);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(2);
  });
});
