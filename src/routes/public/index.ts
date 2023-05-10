import Router from 'koa-router'

const router = new Router({ prefix: '/public' })

export { router as publicRouter }
export default router

import './auth'
import './baseData'
import './file'
