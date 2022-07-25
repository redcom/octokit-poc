import pino from "pino"

const streams = [{ stream: process.stdout }]

export const baseLogger = pino(
  {
    level: process.env.LOG_LEVEL || "info",
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "hostname,pid",
      },
    },
  },
  pino.multistream(streams)
)
