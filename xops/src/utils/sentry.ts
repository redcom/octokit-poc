import * as Sentry from "@sentry/node"
import { Dedupe } from "@sentry/integrations"
import { baseLogger } from "./logger"
import * as Tracing from "@sentry/tracing"

import { Application } from "express"

export const init = (app: Application) => {
  const release = `${process.env.ENV}-ops-backend@${process.env.npm_package_version}`
  baseLogger.info(`Init sentry from release: ${release}`)
  try {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.ENV,
      tracesSampler({ request: { url } }) {
        if (url.includes("rancher/batch")) return 0.1
        if (url === "/") return 0.1
        return 1
      },
      integrations: [
        new Dedupe(),
        new Sentry.Integrations.Http({ tracing: true }),
        new Tracing.Integrations.Express({
          app,
        }),
      ],
      enabled: process.env.ENV !== "development",
      release,
      ignoreErrors: [
        'null value in column "web_uuid" of relation "ops_application" violates not-null constraint',
      ],
      normalizeDepth: 5,
    })
  } catch (err) {
    baseLogger.debug(`Init sentry failed from release: ${release}`)
    console.log(err)
  }
}
export default Sentry
