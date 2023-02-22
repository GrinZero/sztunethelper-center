import Koa from 'koa'
import { control, Command } from '#/service/mysql'

const adminVeirfy = async (
  ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext, any>,
  next: Koa.Next
) => {
  if (!ctx.state.user) return next()
  const { type } = ctx.state.user
  if (type > 0) {
    const { results } = await control(
      new Command('user')
        .select({
          type: 1
        })
        .where({
          mail: ctx.state.user.mail
        })
        .done()
    )
    const data = results[0]
    if (!data || data.type !== type) {
      ctx.body = {
        status: 'error',
        msg: 'permission denied'
      }
      return
    }
  }
  await next()
}

export default adminVeirfy
