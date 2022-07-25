import type { Config } from "@jest/types"

export default async (): Promise<Config.InitialOptions> => {
  return {
    verbose: true,
    testEnvironment: "node",
    testPathIgnorePatterns: ["stub"],
    coveragePathIgnorePatterns: ["/node_modules/"],
    collectCoverage: true,
    bail: true,
    maxConcurrency: 10,
    maxWorkers: 10,
    moduleFileExtensions: ["ts", "js"],
    transform: {
      "^.+\\.(ts|tsx)$": "ts-jest",
    },
    testMatch: ["**/__tests__/**/*.test.(ts|js)"],
    setupFilesAfterEnv: ["./__tests__/setup.ts"],
  }
}
