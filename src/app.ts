import Koa from 'koa'
import jwt from 'koa-jwt'
import koaBody from 'koa-body'

import { JwtConfig } from './config'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = new Koa()

//HTTP
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err: any) {
    ctx.status = err?.status || 500
    ctx.body = err?.message
    ctx.app.emit('error', err, ctx)
  }
})
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

//SOCKET

const httpServer = createServer(app.callback())
const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
})

io.on('connection', (socket) => {
  console.log('a user connected')
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

export { app, httpServer }
