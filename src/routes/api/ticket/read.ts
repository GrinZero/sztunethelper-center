import { apiRouter } from '..'

import { command } from '#service/mysql'

apiRouter.post('/readTicket', async (ctx, _) => {
  const { mail } = ctx.state.user
  const { id } = ctx.request.body
  // 0b01: unread by to
  // 0b10: unread by from
  // 0b11: read

  const { results: fromResult } = await command(`
      SELECT \`from\` FROM ticket
      WHERE \`from\` = '${mail}' and id = ${id}
    `)
  const isFrom = fromResult.length > 0

  const control = `
      UPDATE ticket 
      SET \`read\` = \`read\` | ${isFrom ? 0b10 : 0b01}
      WHERE \`${isFrom ? 'from' : 'to'}\` = '${mail}' and id = ${id}
    `

  await command(control)
  ctx.body = {
    msg: 'ok',
    state: isFrom ? 1 : 2
  }
})
