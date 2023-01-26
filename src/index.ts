process.env.TZ = 'Asia/Shanghai'

import { app } from './app'

app.listen(3000, () => {
  console.log('应用已经启动，http://localhost:3000')
  console.log('无需认证的接口已经启动，http://localhost:3000/public/')
  console.log('需认证的接口已经启动，http://localhost:3000/api/')
})
