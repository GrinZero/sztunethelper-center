import { publicRouter } from './index'
import { Command } from '#/service/mysql'

publicRouter.post('/_invisible/verifyFile', async (ctx, _) => {
  if (!ctx.request.body) {
    console.log('没有消息')
    ctx.body = { error: '没有消息' }
    return
  }
  const { Message: msg } = ctx.request.body
  const { hash } = msg

  const { results } = await new Command('ticket_content')
    .select({
      id: 1
    })
    .where({
      uploadID: hash,
      status: 0
    })
    .query()

  if (results.length !== 0) {
    ctx.body = {
      status: 'success'
    }
    await new Command('ticket_content')
      .update({
        status: 1
      })
      .where({
        uploadID: hash
      })
      .query()
    return
  }

  console.log('文件不存在，锁定IP：', msg['source_ip'])
  const { results: effectResult } = await new Command('ticket_content')
    .update({
      status: -1
    })
    .where({
      uploadID: hash,
      status: 0
    })
    .query()

  if (effectResult.affectedRows === 0) {
    ctx.body = { error: '文件不存在' }
    await new Command('ticket_content')
      .update({
        status: -1
      })
      .where({
        uploadID: hash
      })
      .query()
    return
  }

  ctx.body = { error: '文件不存在' }
})
