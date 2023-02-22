import { apiRouter } from '..'

import { control, Command } from '#service/mysql'

const typeList = ['网络问题']
const contactTypeList = ['socket', 'mail', 'image', 'other']

apiRouter.post('/addTicket', async (ctx, _) => {
  const { mail } = ctx.state.user
  const { toID, type, title, content, contactType } = ctx.request.body

  if (!typeList.includes(type) || !contactTypeList.includes(contactType)) {
    ctx.body = {
      msg: '类型错误',
      state: -1
    }
    return
  }

  const { results: toResult } = await control(`
        SELECT mail,username FROM user
        WHERE id = ${toID} and type > 0
      `)
  if (toResult.length === 0) {
    ctx.body = {
      msg: '工作人员ID错误',
      state: -1
    }
  }

  const contactTypeValue = contactTypeList.indexOf(contactType)

  const stamp = Date.now()
  const command = new Command('ticket')
    .insert({
      from: mail,
      to: toResult[0].mail,
      type,
      title,
      contactType: contactTypeValue,
      createTime: stamp,
      updateTime: stamp,
      read: 0b10
    })
    .done()

  const result = await control(command)
  const { insertId } = result.results
  ctx.body = {
    msg: 'ok',
    data: {
      id: insertId,
      createTime: stamp,
      updateTime: stamp,
      read: true,
      status: 0,
      rate: -1,
      to: toResult[0].mail,
      adminName: toResult[0].username
    },
    state: 1
  }

  const ticketContentControl = new Command('ticket_content')
    .insert({
      ticketID: insertId,
      content,
      createTime: stamp,
      updateTime: stamp,
      type: 0,
      sender: mail
    })
    .done()

  await control(ticketContentControl)
})
