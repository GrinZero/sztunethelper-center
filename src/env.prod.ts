export const secretID = process.env.SECRET_ID as string
export const secretKey = process.env.SECRET_KEY as string

export const mysqlUser = process.env.MYSQL_USER as string
export const mysqlSecret = process.env.MYSQL_PASSWORD as string
export const mysqlPort = Number(process.env.MYSQL_PORT) as number
export const mysqlHost = process.env.MYSQL_HOST as string

export const uploadAccessKey = process.env.UPLOAD_ACCESS_KEY as string
export const uploadSecretKey = process.env.UPLOAD_SECRET_KEY as string
export const uploadOptions = {
  scope: process.env.UPLOAD_SCOPE as string,
  isPrefixalScope: 1,
  persistentOps: process.env.UPLOAD_PERSISTENT_OPS as string,
  persistentPipeline: process.env.UPLOAD_PERSISTENT_PIPELINE as string
}
