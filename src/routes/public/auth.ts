import { publicRouter } from './index'

import { JwtConfig } from '#config/index'
import { control } from '#service/mysql'
import client from '#service/mail'
import { sign } from 'jsonwebtoken'

import { escape } from 'mysql'

publicRouter.post('/auth', async (ctx, _) => {
  const { mail: _mail, code: _code } = ctx.request.body
  const mail = escape(_mail)
  const code = escape(_code)

  const verfiy = async () => {
    // 5min有效
    const command = `select mail from mail_verify_code where mail = ${mail} and code = ${code} and updateTime > ${
      Date.now() - 5 * 60 * 1000
    }`
    console.log(command)
    const { results } = await control(command)
    if (results.length === 1) {
      return true
    }
    return false
  }

  const { results: haveNameResult } = await control(`select id,type from user where mail = ${mail}`)
  const haveUser = haveNameResult.length === 1
  const verifyResult = await verfiy()

  if (verifyResult && haveUser) {
    const token = sign(
      { mail, id: haveNameResult[0].id, type: haveNameResult[0].type },
      JwtConfig.secret,
      {
        expiresIn: '120d'
      }
    )
    await control(`update user set updateTime = '${new Date().getTime()}' where mail = ${mail}`)
    ctx.body = { token }
    return
  }

  if (verifyResult && !haveUser) {
    const { results: registerResult } = await control(
      `insert into user (username,mail,nickName,createTime,updateTime) values (${mail},${mail},${mail},${Date.now()},${Date.now()})`
    )
    if (registerResult.affectedRows === 1) {
      const token = sign(
        { mail, id: haveNameResult[0].id, type: haveNameResult[0].type },
        JwtConfig.secret,
        {
          expiresIn: '120d'
        }
      )
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
  const { mail: _mail } = ctx.request.body
  const mail = escape(_mail)
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

  let { results } = await control(
    `select updateTime,count from mail_verify_code where mail = ${mail}`
  )

  if (results.length === 0) {
    await control(
      `insert into mail_verify_code (mail,code,createTime,updateTime) values (${mail},'${code}',${Date.now()},${Date.now()})`
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
      await control(
        `update mail_verify_code set code = '${code}',updateTime = ${Date.now()},count = 3 where mail = ${mail}`
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
    await control(
      `select updateTime,count from mail_verify_code where mail = ${mail} and count > 0`
    )
  ).results

  if (results.length === 0) {
    ctx.body = {
      code: 400,
      msg: '发送次数过多'
    }
    return
  }

  await control(
    `update mail_verify_code set code = '${code}',updateTime = ${Date.now()},count = count - 1 where mail = ${mail}`
  )
  await sendVerifyCodeMail()

  ctx.body = {
    code: 200,
    msg: '发送成功',
    data: results[0].count - 1
  }
})
