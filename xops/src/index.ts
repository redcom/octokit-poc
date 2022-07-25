import * as http from "http"
import * as path from "node:path"
import { init as SentryInit } from "./utils/sentry"
import Sentry from "./utils/sentry"
import { app } from "./app"
import { DatabaseService } from "./app/services/database.service"
import { RancherService } from "./app/services/rancher.service"

SentryInit(app)

import { baseLogger } from "./utils/logger"
const logger = baseLogger.child({ name: "OpsBackend:Index" })

if (!process.env.CONFIG_SET) {
  // eslint-disable-next-line
  require("dotenv").config();
  process.env.CONFIG_SET = "true"
}

DatabaseService.getConnection().then(() => {
  RancherService.getConnection()
    .then(() => {
      const server = http
        .createServer(app)
        .listen(parseInt(process.env.PORT || "3002", 10))
      server.on("listening", async () => {
        logger.info(
         `xops-api listening on ${JSON.stringify(server.address())}`
        )
      })
    })
    .catch((err: Error) => {
      Sentry.captureException(err)
      logger.error(err)
    })
})
