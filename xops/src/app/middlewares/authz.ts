import { NextFunction, Request, Response } from "express"
import Sentry from "../../utils/sentry"

function authzMiddleware(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization ?? ""

  if (auth.indexOf("Bearer") > -1) {
    const authToken = auth.replace("Bearer ", "")
    if (authToken === process.env.XOPS_API_TOKEN) {
      return next()
    }
  }

  const status = 401
  const message = "Authorization failed"

  Sentry.captureMessage(message)

  res.status(status).send({
    status,
    message,
  })
}

export default authzMiddleware
