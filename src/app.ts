import Koa from 'koa'
import jwt from 'koa-jwt'
import koaBody from 'koa-body'
import helmet from 'koa-helmet'
import { verify } from 'jsonwebtoken'

import { JwtConfig } from './config'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = new Koa()

//HTTP
// 错误拦截中间件
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err: any) {
    ctx.status = err?.status || 500
    ctx.body = err?.message
    ctx.app.emit('error', err, ctx)
  }
})
app.use(helmet())
// POST body解析中间件
app.use(koaBody())
// 跨域中间价
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
app.use(
  jwt({
    secret: JwtConfig.secret,
    debug: true
  }).unless({
    path: [/^\/public/]
  })
)

import adminVerify from './core/middleware/adminVerify'
app.use(adminVerify)

import { publicRouter } from './routes/public'
import { apiRouter } from './routes/api'
app.use(publicRouter.routes()).use(publicRouter.allowedMethods())
app.use(apiRouter.routes()).use(apiRouter.allowedMethods())

//SOCKET
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
  UserState
} from '#routes/index'
const httpServer = createServer(app.callback())
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(
  httpServer,
  {
    cors: {
      origin: '*'
    }
  }
)

import { join, send } from './routes'
io.on('connection', (socket) => {
  let user: null | UserState = null
  try {
    const token = socket.handshake.auth.token.replace('Bearer ', '')
    user = verify(token, JwtConfig.secret) as UserState
  } catch (err: any) {
    socket.disconnect()
    console.info('a user disconnected:', socket.id, err.name)
    switch (err.name) {
      case 'TokenExpiredError':
        // ctx.app.emit('error', tokenExpiredError, ctx)
        throw new Error('token已过期')
      case 'JsonWebTokenError':
        throw new Error('无效的token')
      default:
        throw new Error('Authorization Error')
    }
  }

  console.info('a user connected:', socket.id, user)

  join(socket, user)
  send(socket, user)

  socket.on('disconnect', () => {
    console.info('user disconnected', socket.id)
  })
})

export { app, httpServer }
