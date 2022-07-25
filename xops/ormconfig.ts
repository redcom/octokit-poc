module.exports = {
  type: "postgres",
  host: process.env.RDS_HOSTNAME,
  port: process.env.RDS_PORT,
  username: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DB_NAME,
  synchronize: false,
  logging: true,
  schema: process.env.RDS_SCHEMA || "ops",
  maxQueryExecutionTime: 60000, //millisec
  migrationsRun: false, // we do it manually
  migrationsTransactionMode: "all",
  applicationName: "ops-backend",
  extra: { max: 10 }, // connection pool ?
  // ssl: process.env.RDS_SSL, // needed when we connect to AWS RDS
  entities: ["{src,dist}/app/models/entities/**/*{.ts,.js}"],
  migrations: ["{src,dist}/database/migrations/**/*{.ts,.js}"], // only run migrations which contain migration in filename
  migrationsTableName: "tsops_migrations",
  seeds: ["{src,dist}/src/database/seeds/**/*{.ts,.js}"],
  cache: {
    type: "database",
    tableName: "typeorm-query-result-cache",
    duration: 60000,
  },
  subscribers: [
    "{src,dist}/subscriber/**/*{.ts,.js}", // maybe hooks
  ],
  cli: {
    entitiesDir: "src/app/models",
    migrationsDir: "src/database/migrations",
    seedsDir: "src/database/seeds",
  },
}
