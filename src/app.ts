import Koa from 'koa'
import jwt from 'koa-jwt'
import koaBody from 'koa-body'
import helmet from 'koa-helmet'
import { verify } from 'jsonwebtoken'

import { JwtConfig } from './config'
import { createServer } from 'http'
import { Server } from 'socket.io'

import { errorCatch, adminVerify, accessControl } from './core/middleware'
import { publicRouter } from './routes/public'
import { apiRouter } from './routes/api'
import { join, send } from './routes'

import type {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
  UserState
} from '#routes/index'

const app = new Koa()

// 错误拦截中间件
app.use(errorCatch)
// 安全中间件
app.use(helmet())
// POST body解析中间件
app.use(koaBody())
// 跨域中间件
app.use(accessControl)
// JWT中间件
app.use(
  jwt({
    secret: JwtConfig.secret,
    debug: true
  }).unless({
    path: [/^\/public/]
  })
)
// 管理员权限验证中间件
app.use(adminVerify)
app.use(publicRouter.routes()).use(publicRouter.allowedMethods())
app.use(apiRouter.routes()).use(apiRouter.allowedMethods())
const socketServer = createServer(app.callback())

//SOCKET
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(
  socketServer,
  {
    cors: {
      origin: '*'
    }
  }
)
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
export { app, socketServer }
