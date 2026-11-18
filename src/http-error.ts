export class HttpError extends Error {
  readonly status: number;

  constructor(status: number) {
    super("not implemented");
    this.name = "HttpError";
    this.status = status;
    throw new Error("not implemented");
  }
}
