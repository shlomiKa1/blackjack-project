import { MAX_NUMBER, } from "../config.js";

export default class AppError extends Error {
  constructor(message, statusCode) {
    const errorMessage =
      typeof message === "object"
        ? message.message || JSON.stringify(message)
        : message;
    super(errorMessage);

    this.name = "AppError";
    this.statusCode = statusCode;
  }
}

export function isValidBet(chips, bet) {
  return chips >= bet;
}

export function isValidNumber(total) {
    return total <= MAX_NUMBER;
}