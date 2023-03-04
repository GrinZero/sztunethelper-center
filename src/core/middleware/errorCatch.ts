import Koa from 'koa'

const errorCatch = async (
  ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext, any>,
  next: Koa.Next
) => {
  try {
    await next()
  } catch (err: any) {
    ctx.status = err?.status || 500
    ctx.body = err?.message
    ctx.app.emit('error', err, ctx)
  }
}

export default errorCatch
