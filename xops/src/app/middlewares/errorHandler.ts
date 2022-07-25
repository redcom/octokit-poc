import { isArray, ValidationError } from "class-validator"
import { NextFunction, Request, Response } from "express"
import { extractErrors } from "./validator"
import Sentry from "../../utils/sentry"

class HttpException extends Error {
  status: number
  message: string
  constructor(status: number, message: string) {
    super(message)
    this.status = status
    this.message = message
  }
}

type TypeOfError = HttpException & ValidationError & ValidationError[]

function errorMiddleware(
  error: TypeOfError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  let validationErrors: unknown = null
  if (isArray(error) && error[0] instanceof ValidationError) {
    validationErrors = extractErrors(error)
  }

  const status = 400
  const message = error.message || "Something went terrably wrong"

  Sentry.captureException(validationErrors ?? message)

  res.status(status).send({
    status,
    message: validationErrors ?? message,
  })
}

export default errorMiddleware
