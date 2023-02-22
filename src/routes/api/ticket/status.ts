import { apiRouter } from '..'

import { control, Command } from '#service/mysql'

const CLOSE_STATUS = 1
const DELETE_STATUS = 2

apiRouter
  .post('/closeTicket', async (ctx, _) => {
    const { mail, type } = ctx.state.user
    const { id, rate } = ctx.request.body

    if (type === 1) {
      ctx.body = {
        msg: 'permission denied: only user can close ticket',
        state: -1
      }
      return
    }

    if (!id || (rate && (rate < 0 || rate > 5))) {
      ctx.body = {
        msg: 'id and rate is required',
        state: -1
      }
      return
    }

    const command = new Command('ticket')
      .update({
        status: CLOSE_STATUS,
        rate: rate
      })
      .where({
        from: mail,
        id: id
      })
      .done()

    await control(command)
    ctx.body = {
      msg: 'ok',
      state: 1
    }
  })
  .post('/deleteTicket', async (ctx, _) => {
    const { mail, type } = ctx.state.user
    const { id } = ctx.request.body

    const isUser = type === 0

    const command = new Command('ticket')
      .update({
        status: DELETE_STATUS
      })
      .where({
        ...(isUser ? { from: mail } : { to: mail }),
        id: id,
        status: CLOSE_STATUS
      })
      .done()

    const { results: deleteResult } = await control(command)
    if (deleteResult.affectedRows === 0) {
      ctx.body = {
        msg: 'Only closed ticket can be deleted',
        state: -1
      }
      return
    }
    ctx.body = {
      msg: 'ok',
      state: 1
    }
  })
