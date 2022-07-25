import { EventEmitter } from "events"
import { createConnection } from "typeorm"
import Sentry from "../../utils/sentry"
import { dbConfig as config } from "../../config/config"
import path from "path"
import { baseLogger } from "../../utils/logger"
const logger = baseLogger.child({ name: "OpsBackend:Services:Database" })

class DatabaseService {
  public static emitter: EventEmitter = new EventEmitter()
  public static isConnected = false

  public static async getConnection() {
    DatabaseService.handleConnectionError()
    return await DatabaseService.createConnection()
  }

  public static async createConnection() {
    const dbConfig = config[`${process.env.ENV}`]
    return await createConnection({
      type: "postgres",
      host: dbConfig.host,
      port: parseInt(dbConfig.port),
      username: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.database,
      entities: [path.join(__dirname, "../models/entities", "*.{ts,js}")],
      migrations: [
        path.join(__dirname, "../../database/migrations/**/*{.ts,.js}"),
      ],
      subscribers: [path.join(__dirname, "../../subscriber/**/*{.ts,.js}")], // maybe hooks
      maxQueryExecutionTime: 60000, //millisec
      migrationsRun: false, // do it manually
      migrationsTransactionMode: "all",
      schema: dbConfig.schema,
      applicationName: "ops-backend",
      // ssl: dbConfig.ssl, // when RDS this needs to be true
      logging: process.env.LOG_LEVEL === "debug",
      cache: true,
    })
      .then(() => {
        DatabaseService.isConnected = true
        logger.info("database connected successfully")
      })
      .catch((err: Error) => {
        Sentry.captureException(err)
        logger.info(`database connection error...retrying ${err}`)
      })
  }
  public static async handleConnectionError() {
    DatabaseService.emitter.on("DB_CONNECT_ERROR", async () => {
      logger.info("handling database connection error...retrying")
      setTimeout(async () => {
        await DatabaseService.createConnection()
      }, 3000)
    })
  }
}

export { DatabaseService }
