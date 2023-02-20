import { SocketInstance } from './type'
import { control, Command } from '#/service/mysql'
import { TicketContentTypeList } from '#/routes/api/ticket/constants'

const send = (socket: SocketInstance, users: any) => {
  socket.on('send', async (roomID, msg, callback) => {
    const id = `ticket-${roomID}`
    const { mail } = users

    // TODO：用redis优化
    const command = new Command('ticket')
      .select({
        id: 1
      })
      .where({ id: roomID })
      .add(`AND (\`to\`='${mail}' OR \`from\`='${mail}')`)
      .done()
    const { results } = await control(command)
    if (results.length === 0) {
      socket.emit('dispatch', {
        type: 'join',
        data: {
          id: socket.id,
          error: 'ticket not found'
        }
      })
      return
    }

    const typeList = TicketContentTypeList
    if (!typeList.includes(msg.type)) {
      callback?.({
        status: 'error',
        msg: 'type error'
      })
      return
    }

    const stamp = Date.now()
    const insertData = {
      ticketID: roomID,
      content: msg.data,
      type: typeList.indexOf(msg.type),
      status: 0,
      createTime: stamp,
      updateTime: stamp,
      sender: mail
    }
    const insertCommand = new Command('ticket_content').insert(insertData).done()
    const insertResult = await control(insertCommand)

    const data = {
      ...insertData,
      id: insertResult.results.insertId,
      type: msg.type,
      localID: msg.id
    }
    callback?.({
      status: 'ok',
      msg: 'success',
      data: data
    })

    socket.emit('send', data)
    socket.to(id).emit('send', data)
  })
}

export { send }
