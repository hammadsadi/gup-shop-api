/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from "express";

import httpStatus from "http-status";
import { Prisma } from "@prisma/client";
import { AppError } from "../errors/AppError";
import handleZodError from "../errors/ZodError";
import { ZodError } from "zod";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong!";

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message =
      simplifiedError?.message +
      " | " +
      (simplifiedError?.errorSources?.[0]?.message || "");
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      stack: process.env.NODE_ENV === "development" ? err?.stack : null,
    });
    return;
  }

  if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        case "P2002":
          if (Array.isArray(err.meta?.target)) {
            statusCode = httpStatus.CONFLICT;
            message = `A field with the same ${err.meta.target.join(
              ", "
            )} already exists.`;
          }
          break;

        case "P2003":
          statusCode = httpStatus.BAD_REQUEST;
          message = `Record for ${
            err.meta?.field_name || "a field"
          } does not exist.`;
          break;

        case "P2000":
          statusCode = httpStatus.BAD_REQUEST;
          message = `Value is too long for field ${
            err.meta?.column_name || "unknown"
          }.`;
          break;

        case "P2025":
          statusCode = httpStatus.NOT_FOUND;
          message = `The record you are trying to update/delete does not exist.`;
          break;

        case "P2011":
          statusCode = httpStatus.BAD_REQUEST;
          message = `Field ${
            err.meta?.constraint || "unknown"
          } cannot be null.`;
          break;

        case "P2012":
          statusCode = httpStatus.BAD_REQUEST;
          message = `Missing required field ${
            err.meta?.field_name || "unknown"
          }.`;
          break;

        case "P2014":
          statusCode = httpStatus.BAD_REQUEST;
          message = `Required related record not found.`;
          break;

        case "P2015":
          statusCode = httpStatus.NOT_FOUND;
          message = `Related record not found.`;
          break;

        case "P2024":
          statusCode = httpStatus.SERVICE_UNAVAILABLE;
          message = `Database timeout. Please try again later.`;
          break;

        default:
          statusCode = httpStatus.INTERNAL_SERVER_ERROR;
          message = `A database error occurred: ${err.message}`;
          break;
      }
    } else {
      statusCode = 500;
      message = err.message;
    }
  } else if (err instanceof SyntaxError) {
    statusCode = 400;
    message = "Invalid JSON payload passed.";
  }

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
    stack: process.env.NODE_ENV === "development" ? err?.stack : null,
  });
};
export default globalErrorHandler;
