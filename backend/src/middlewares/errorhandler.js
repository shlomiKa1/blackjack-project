import { success } from "zod";

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const error = err.message || "Internal Server Error";

  return res.status(statusCode).send({
    success: false,
    error,
  });
}
