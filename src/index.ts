process.env.TZ = 'Asia/Shanghai'

import { app } from './app'
import os from 'os'

function getNetworkIp() {
  // 打开的 host
  let needHost = ''
  try {
    // 获得网络接口列表
    let network = os.networkInterfaces()
    for (const dev in network) {
      let iface = network[dev]
      for (let i = 0; i < iface!.length; i++) {
        let alias = iface![i]
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
          needHost = alias.address
        }
      }
    }
  } catch (e) {
    needHost = 'http://localhost'
  }
  return needHost
}

app.listen(3000, () => {
  console.log('应用已经启动，http://localhost:3000')
  console.log('无需认证的接口已经启动，http://localhost:3000/public/')
  console.log('需认证的接口已经启动，http://localhost:3000/api/')
  const host = getNetworkIp()
  console.log('局域网IP：' + host)
})
