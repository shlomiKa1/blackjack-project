export default class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
  }
}

export function isValidChips(chips) {
  return typeof chips === "number" && chips > -1;
}

export function isValidNewChips(chips, newChips) {
  return chips >= newChips;
}
