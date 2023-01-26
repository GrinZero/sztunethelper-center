import tencentcloud from 'tencentcloud-sdk-nodejs'

import { secretID, secretKey } from '../../env'

const SesClient = tencentcloud.ses.v20201002.Client
const clientConfig = {
  credential: {
    secretId: secretID,
    secretKey: secretKey
  },
  region: 'ap-hongkong',
  profile: {
    httpProfile: {
      endpoint: 'ses.tencentcloudapi.com'
    }
  }
}

const client = new SesClient(clientConfig)

export default client
