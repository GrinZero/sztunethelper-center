import { apiRouter } from '..'

import { control } from '#service/mysql'

apiRouter.post('/readTicket', async (ctx, _) => {
  const { mail, type } = ctx.state.user
  const { id } = ctx.request.body

  const isUser = type === 0

  // 0b01: unread by to
  // 0b10: unread by from
  // 0b11: read

  const command = `
      UPDATE ticket 
      SET \`read\` = \`read\` | ${isUser ? 0b10 : 0b01}
      WHERE \`${isUser ? 'from' : 'to'}\` = '${mail}' and id = ${id}
    `

  await control(command)
  ctx.body = {
    msg: 'ok',
    state: isUser ? 1 : 2
  }
})
