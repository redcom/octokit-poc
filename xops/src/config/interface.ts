export type IDatabase = {
  database: string
  dialect: string
  host: string
  password: string
  port: string
  username: string
  schema: string
  ssl?: boolean
}

export type IAws = {
  aws_access_key_id: string
  aws_secret_access_key: string
  aws_default_region: string
}
