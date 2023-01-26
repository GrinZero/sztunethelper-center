import { publicRouter } from './index'

import { JwtConfig } from '../../config'
import { command } from '../../service/mysql'
import { sign } from 'jsonwebtoken'

publicRouter.post('/auth', async (ctx, _) => {
  const { username, password } = ctx.request.body

  const getID = async () => {
    const { results } = await command(
      `select id from user where username = '${username}' and password = '${password}'`
    )
    if (results.length === 1) {
      return results[0].id
    }
    return null
  }

  const id = await getID()
  if (id) {
    const token = sign({ name: username, id }, JwtConfig.secret, {
      expiresIn: '120d'
    })
    await command(`update user set updateTime = '${new Date().getTime()}' where id = ${id}`)
    ctx.body = { token }
    return
  }

  const { results: haveNameResult } = await command(
    `select * from user where username = '${username}'`
  )
  if (haveNameResult.length === 1) {
    ctx.body = { error: '密码错误' }
    return
  }

  const { results: registerResult } = await command(
    `insert into user (username,password) values ('${username}','${password}')`
  )
  if (registerResult.affectedRows === 1) {
    const token = sign({ name: username, id: await getID() }, JwtConfig.secret, {
      expiresIn: '120d'
    })
    ctx.body = { token }
    return
  }
})
