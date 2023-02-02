import { publicRouter } from './index'

import { JwtConfig } from '../../config'
import { command } from '../../service/mysql'
import client from '../../service/mail'
import { sign } from 'jsonwebtoken'

publicRouter.post('/auth', async (ctx, _) => {
  const { mail, code } = ctx.request.body
  const verfiy = async () => {
    // 5min有效
    const { results } = await command(
      `select mail from mail_verify_code where mail = '${mail}' and code = '${code}' and updateTime > ${
        Date.now() - 5 * 60 * 1000
      }`
    )
    if (results.length === 1) {
      return true
    }
    return false
  }

  const { results: haveNameResult } = await command(`select id from user where mail = '${mail}'`)
  const haveUser = haveNameResult.length === 1
  const verifyResult = await verfiy()

  if (verifyResult && haveUser) {
    const token = sign({ mail, id: haveNameResult[0].id }, JwtConfig.secret, {
      expiresIn: '120d'
    })
    await command(`update user set updateTime = '${new Date().getTime()}' where mail = '${mail}'`)
    ctx.body = { token }
    return
  }

  if (verifyResult && !haveUser) {
    const { results: registerResult } = await command(
      `insert into user (username,mail,nickName,createTime,updateTime) values ('${mail}','${mail}','${mail}',${Date.now()},${Date.now()})`
    )
    if (registerResult.affectedRows === 1) {
      const token = sign({ mail, id: haveNameResult[0].id }, JwtConfig.secret, {
        expiresIn: '120d'
      })
      ctx.body = { token }
      return
    } else {
      ctx.body = { error: '注册失败' }
      return
    }
  }

  if (!verifyResult) {
    ctx.body = { error: '验证码错误' }
    return
  }

  ctx.body = { error: '未知错误' }
})

publicRouter.post('/sendVerifyCode', async (ctx, _) => {
  const { mail } = ctx.request.body
  let code = Math.floor(Math.random() * 100000)
  if (code < 100000) {
    code += 100000
  }
  const sendVerifyCodeMail = async () => {
    return await client.SendEmail({
      FromEmailAddress: 'sztulives.source@mail.sztulives.cn',
      Destination: [mail],
      Subject: 'sztunethelper 验证码',
      Template: {
        TemplateID: 65687,
        TemplateData: JSON.stringify({
          title: 'sztunethelper 验证码',
          verifyCode: code,
          name: '用户'
        })
      }
    })
  }

  let { results } = await command(
    `select updateTime,count from mail_verify_code where mail = '${mail}'`
  )

  if (results.length === 0) {
    await command(
      `insert into mail_verify_code (mail,code,createTime,updateTime) values ('${mail}','${code}',${Date.now()},${Date.now()})`
    )
    await sendVerifyCodeMail()
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
        `update mail_verify_code set code = '${code}',updateTime = ${Date.now()},count = 3 where mail = '${mail}'`
      )
      await sendVerifyCodeMail()
      ctx.body = {
        code: 200,
        msg: '发送成功',
        data: 3
      }
      return
    }
  }

  results = (
    await command(
      `select updateTime,count from mail_verify_code where mail = '${mail}' and count > 0`
    )
  ).results

  if (results.length === 0) {
    ctx.body = {
      code: 400,
      msg: '发送次数过多'
    }
    return
  }

  await command(
    `update mail_verify_code set code = '${code}',updateTime = ${Date.now()},count = count - 1 where mail = '${mail}'`
  )
  await sendVerifyCodeMail()

  ctx.body = {
    code: 200,
    msg: '发送成功',
    data: results[0].count - 1
  }
})
