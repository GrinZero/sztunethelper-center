import { apiRouter } from './index'

import { command } from '../../service/mysql'

apiRouter.post('/fetchTicketList', async (ctx, _) => {
  const { mail } = ctx.state.user
  const { page } = ctx.request.body
  const pageSize = 10
  const offset = page * pageSize

  // 0: open 1: close 2: delete
  const control = `
    SELECT \`ticket\`.*,\`user\`.username as adminName FROM ticket,user
    WHERE \`from\` = '${mail}' and status != 2 and \`ticket\`.to = \`user\`.mail
    ORDER BY createTime DESC
    LIMIT ${pageSize}
    OFFSET ${offset}
  `

  const { results: list } = await command(control)
  ctx.body = list.map((item: any) => {
    return {
      ...item,
      read: (item.read & 0b10) === 0b10
    }
  })
})

apiRouter.post('/readTicket', async (ctx, _) => {
  const { mail } = ctx.state.user
  const { id } = ctx.request.body

  const { results: fromResult } = await command(`
    SELECT \`from\` FROM ticket
    WHERE \`from\` = '${mail}' and id = ${id}
  `)
  const isFrom = fromResult.length > 0

  const control = `
    UPDATE ticket 
    SET \`read\` = \`read\` | ${isFrom ? 0b10 : 0b01}
    WHERE \`${isFrom ? 'from' : 'ro'}\` = '${mail}' and id = ${id}
  `

  await command(control)
  ctx.body = {
    msg: 'ok',
    state: isFrom ? 1 : 2
  }
})

apiRouter
  .post('/closeTicket', async (ctx, _) => {
    const { mail } = ctx.state.user
    const { id } = ctx.request.body

    const CLOSE_STATUS = 1
    const control = `
    UPDATE ticket 
    SET status = ${CLOSE_STATUS}
    WHERE \`from\` = '${mail}' and id = ${id}
  `

    await command(control)
    ctx.body = {
      msg: 'ok',
      state: 1
    }
  })
  .post('/deleteTicket', async (ctx, _) => {
    const { mail } = ctx.state.user
    const { id } = ctx.request.body

    const DELETE_STATUS = 2
    const control = `
    UPDATE ticket 
    SET status = ${DELETE_STATUS}
    WHERE \`from\` = '${mail}' and id = ${id}
  `

    await command(control)
    ctx.body = {
      msg: 'ok',
      state: 1
    }
  })
