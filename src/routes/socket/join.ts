import { SocketInstance } from './type'
import { control, Command } from '#/service/mysql'

const join = (socket: SocketInstance, users: any) => {
  socket.on('join', async (roomID, callback) => {
    const id = `ticket-${roomID}`
    const { mail } = users

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

    socket.join(id)
    callback?.('ok')
  })
}

export { join }
