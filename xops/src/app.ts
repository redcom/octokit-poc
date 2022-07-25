import bodyParser from "body-parser"
import express, { Application } from "express"
import Sentry from "./utils/sentry"
import helmet from "helmet"

import pinoHTTP from "pino-http"

import errorMiddleware from "./app/middlewares/errorHandler"
import authzMiddleware from "./app/middlewares/authz"

import { routes as apiRoutesV1 } from "./routes/index"
import { baseLogger } from "./utils/logger"
const app: Application = express()

const logger = baseLogger.child({ name: "OpsBackend:HTTP" })
// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

app.use(helmet())
app.use(pinoHTTP({ logger }))
app.use(bodyParser.json({ limit: "50mb", type: "application/json" }))
app.use(bodyParser.urlencoded({ extended: true }))

if (!process.env.CONFIG_SET) {
  // eslint-disable-next-line
  require("dotenv").config();
  process.env.CONFIG_SET = "true"
}

app.get("/", (_req, res) =>
  res.json({
    status: true,
    message: "OpsBackend API is healthy!",
  })
)

app.use("/v1", authzMiddleware, apiRoutesV1)

app.use(Sentry.Handlers.errorHandler())
// order matter. This catches all errors
app.use(errorMiddleware)

export { app }
