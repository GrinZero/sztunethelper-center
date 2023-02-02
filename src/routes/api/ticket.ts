import { apiRouter } from './index'

import { command } from '../../service/mysql'

apiRouter.post('/fetchTicketList', async (ctx, _) => {
  const { user } = ctx.state

  const { mail } = user
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
