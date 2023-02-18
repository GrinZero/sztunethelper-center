import { apiRouter } from '..'

import { command, insert } from '#service/mysql'

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

  const { results: toResult } = await command(`
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
  const control = insert({
    table: 'ticket',
    data: {
      from: mail,
      to: toResult[0].mail,
      type,
      title,
      contactType: contactTypeValue,
      createTime: stamp,
      updateTime: stamp,
      read: 0b10
    }
  })

  const result = await command(control)
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

  const ticketContentControl = insert({
    table: 'ticket_content',
    data: {
      ticketID: insertId,
      content,
      createTime: stamp,
      updateTime: stamp,
      type: 0
    }
  })

  await command(ticketContentControl)
})
