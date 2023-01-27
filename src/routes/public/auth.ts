import { publicRouter } from './index'

import { JwtConfig } from '../../config'
import { command } from '../../service/mysql'
import { sign } from 'jsonwebtoken'

publicRouter.post('/auth', async (ctx, _) => {
  const { mail, code } = ctx.request.body

  const verfiy = async () => {
    const { results } = await command(
      `select mail from mail_verify_code where mail = '${mail}' and code = '${code}`
    )
    if (results.length === 1) {
      return true
    }
    return false
  }

  const verifyResult = await verfiy()
  if (verifyResult) {
    const token = sign({ mail }, JwtConfig.secret, {
      expiresIn: '120d'
    })
    await command(`update user set updateTime = '${new Date().getTime()}' where mail = ${mail}`)
    ctx.body = { token }
    return
  }

  const { results: haveNameResult } = await command(`select id from user where mail = '${mail}'`)
  if (haveNameResult.length === 1) {
    ctx.body = { error: '验证码错误' }
    return
  }

  const { results: registerResult } = await command(
    `insert into user (username,mail,nickName,createTime,updateTime) values ('${mail}','${mail}','${mail}',${Date.now()},${Date.now()})`
  )
  if (registerResult.affectedRows === 1) {
    const token = sign({ mail }, JwtConfig.secret, {
      expiresIn: '120d'
    })
    ctx.body = { token }
    return
  }
})

publicRouter.post('/sendVerifyCode', async (ctx, _) => {
  const { mail } = ctx.request.body
  let code = Math.floor(Math.random() * 1000000)
  if (code < 100000) {
    code += 100000
  }
  let { results } = await command(`select updateTime,count from verifyCode where mail = '${mail}'`)
  if (results.length === 0) {
    await command(
      `insert into verifyCode (mail,code,createTime,updateTime) values ('${mail}','${code}',${Date.now()},${Date.now()})`
    )
    ctx.body = {
      code: 200,
      msg: '发送成功',
      data: 3
    }
    return
  } else {
    const { updateTime } = results[0]
    const oneDay = 24 * 60 * 60 * 1000
    if (Date.now() - updateTime > oneDay) {
      await command(
        `update verifyCode set code = '${code}',updateTime = ${Date.now()},count = 3 where mail = '${mail}'`
      )
      ctx.body = {
        code: 200,
        msg: '发送成功',
        data: 3
      }
      return
    }
  }

  results = await command(
    `select updateTime,count from verifyCode where mail = '${mail}' and count > 0`
  )

  if (results.length === 0) {
    ctx.body = {
      code: 400,
      msg: '发送次数过多'
    }
    return
  }

  await command(
    `update verifyCode set code = '${code}',updateTime = ${Date.now()},count = count - 1 where mail = '${mail}'`
  )

  ctx.body = {
    code: 200,
    msg: '发送成功',
    data: results[0].count - 1
  }
})
