import { apiRouter } from '..'

import { control, Command, condition } from '#service/mysql'

apiRouter.post('/fetchTicketList', async (ctx, _) => {
  const { mail } = ctx.state.user
  const { page } = ctx.request.body
  const pageSize = 10
  const offset = page * pageSize

  // 0: open 1: close 2: delete
  const command = new Command()
    .select({
      ticket: {
        '*': 1
      },
      user: {
        username: 'adminName'
      }
    })
    .where({
      from: mail,
      status: condition('!=', 2),
      ticket: {
        to: '`user`.`mail`'
      }
    })
    .orderBy({ createTime: -1 })
    .limit(pageSize)
    .offset(offset)
    .done()

  const { results: list } = await control(command)
  ctx.body = list.map((item: any) => {
    return {
      ...item,
      read: (item.read & 0b10) === 0b10
    }
  })
})

// apiRouter.post('/fetchTicketInfos', async (ctx, _) => {
//   const { mail } = ctx.state.user
//   const { page } = ctx.request.body
//   const pageSize = 10
//   const offset = page * pageSize
// })
