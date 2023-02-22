import { apiRouter } from '..'
import { TicketContentTypeList } from './constants'

import { control, Command, condition } from '#service/mysql'

const ContactTypeList = ['socket', 'mail', 'image', 'other']
apiRouter.post('/fetchTicketList', async (ctx, _) => {
  const { mail, type } = ctx.state.user
  const { page } = ctx.request.body
  const pageSize = 10
  const offset = page * pageSize

  const isUser = type === 0

  // 0: open 1: close 2: delete
  const command = new Command()
    .select({
      ticket: {
        '*': 1,
        ...(isUser
          ? {
              to: 'other'
            }
          : {
              from: 'other'
            })
      },
      user: {
        username: 'adminName'
      }
    })
    .where({
      ...(isUser
        ? {
            from: mail,
            ticket: {
              to: '`user`.`mail`'
            }
          }
        : {
            to: mail,
            ticket: {
              from: '`user`.`mail`'
            }
          }),
      status: condition('!=', 2)
    })
    .orderBy({ createTime: -1 })
    .limit(pageSize)
    .offset(offset)
    .done()

  const { results: list } = await control(command)
  const reador = isUser ? 0b10 : 0b01
  ctx.body = list.map((item: any) => {
    return {
      ...item,
      read: (item.read & reador) === reador,
      contactType: ContactTypeList[item.contactType]
    }
  })
})

apiRouter.post('/fetchTicketInfos', async (ctx, _) => {
  const { mail, type } = ctx.state.user
  const { page, id } = ctx.request.body
  const pageSize = 20
  const offset = page * pageSize

  const isUser = type === 0

  const { results: isTicketExist } = await control(
    new Command()
      .select({
        ticket: {
          id: 1
        }
      })
      .where({
        id,
        ...(isUser ? { from: mail } : { to: mail }),
        status: condition('!=', 2)
      })
      .add(`AND (\`to\`='${mail}' OR \`from\`='${mail}')`)
      .done()
  )

  if (isTicketExist.length === 0 || id === null || id === undefined) {
    ctx.body = null
    return
  }

  const command = new Command()
    .select({
      ticket_content: {
        '*': 1
      },
      user: {
        username: 'senderName'
      }
    })
    .where({
      ticketID: id,
      ticket_content: {
        sender: '`user`.`mail`'
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
      type: TicketContentTypeList[item.type]
    }
  })
})
