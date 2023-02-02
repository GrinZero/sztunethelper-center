import Koa from 'koa'
import jwt from 'koa-jwt'
import koaBody from 'koa-body'

import { JwtConfig } from './config'

const app = new Koa()

app.use(koaBody())
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*')
  ctx.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Content-Length, Authorization, Accept, X-Requested-With'
  )
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
  if (ctx.method == 'OPTIONS') {
    ctx.body = 200
  } else {
    await next()
  }
})

import { publicRouter } from './routes/public'
import { apiRouter } from './routes/api'

app.use(
  jwt({
    secret: JwtConfig.secret,
    debug: true
  }).unless({
    path: [/^\/public/]
  })
)

app.use(publicRouter.routes()).use(publicRouter.allowedMethods())
app.use(apiRouter.routes()).use(apiRouter.allowedMethods())

export { app }
