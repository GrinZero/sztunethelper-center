import { apiRouter } from '..'

import { command } from '#service/mysql'

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