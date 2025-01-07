export class InvalidParameterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidParameterError";
  }
}

export class UnauthorizedAccessError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedAccessError";
  }
}

export class FailedRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FailedRequestError";
  }
}
