import { IDatabase, IRancher, IAws } from "./interface"
const dbConfig: { [key: string]: IDatabase } = {
  development: {
    database: <string>process.env.RDS_DB_NAME,
    dialect: <string>process.env.RDS_DIALECT || "postgres",
    host: <string>process.env.RDS_HOSTNAME,
    password: <string>process.env.RDS_PASSWORD,
    port: <string>process.env.RDS_PORT,
    username: <string>process.env.RDS_USERNAME,
    schema: <string>process.env.RDS_SCHEMA || "ops",
    // ssl: <boolean>Boolean(process.env.RDS_SSL || false),
  },
  production: {
    database: <string>process.env.RDS_DB_NAME,
    dialect: <string>process.env.RDS_DIALECT || "postgres",
    host: <string>process.env.RDS_HOSTNAME,
    password: <string>process.env.RDS_PASSWORD,
    port: <string>process.env.RDS_PORT,
    username: <string>process.env.RDS_USERNAME,
    schema: <string>process.env.RDS_SCHEMA || "ops",
    // ssl: <boolean>Boolean(process.env.RDS_SSL || false),
  },
  local: {
    database: <string>process.env.RDS_DB_NAME,
    dialect: <string>process.env.RDS_DIALECT || "postgres",
    host: <string>process.env.RDS_HOSTNAME,
    password: <string>process.env.RDS_PASSWORD,
    port: <string>process.env.RDS_PORT,
    username: <string>process.env.RDS_USERNAME,
    schema: <string>process.env.RDS_SCHEMA || "ops",
    // ssl: <boolean>Boolean(process.env.RDS_SSL || false),
  },
}
const awsConfig: { [key: string]: IAws } = {
  development: {
    aws_access_key_id: <string>process.env.AWS_ACCESS_KEY_ID,
    aws_secret_access_key: <string>process.env.AWS_SECRET_ACCESS_KEY,
    aws_default_region: <string>process.env.AWS_DEFAULT_REGION,
  },
  production: {
    aws_access_key_id: <string>process.env.AWS_ACCESS_KEY_ID,
    aws_secret_access_key: <string>process.env.AWS_SECRET_ACCESS_KEY,
    aws_default_region: <string>process.env.AWS_DEFAULT_REGION,
  },
  local: {
    aws_access_key_id: <string>process.env.AWS_ACCESS_KEY_ID,
    aws_secret_access_key: <string>process.env.AWS_SECRET_ACCESS_KEY,
    aws_default_region: <string>process.env.AWS_DEFAULT_REGION,
  },
}
export { dbConfig, awsConfig }
