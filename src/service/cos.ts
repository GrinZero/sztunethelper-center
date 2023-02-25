import { uploadOptions, uploadAccessKey, uploadSecretKey } from '#/env.prod'
import qiniu from 'qiniu'

const mac = new qiniu.auth.digest.Mac(uploadAccessKey, uploadSecretKey)

const M = 1024 * 1024
const min = 60
const options = {
  ...uploadOptions,
  deadline: 45 * min,
  fsizeLimit: 30 * M,
  returnBody: `{"key": $(key), "hash": $(etag), "w": $(imageInfo.width), "h": $(imageInfo.height)}`
}

export const getUploadToken = () => {
  const putPolicy = new qiniu.rs.PutPolicy(options)
  const uploadToken = putPolicy.uploadToken(mac)
  return uploadToken
}
