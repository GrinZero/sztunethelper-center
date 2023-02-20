import { Socket } from 'socket.io'

export interface SocketData {
  type: string
  data: any
}

export interface ServerTicket {
  id: number
  ticketID: string | number
  content: string
  type: 'text' | 'image' | 'file'
  status: number
  createTime: number
  updateTime: number
  sender: any
}
export interface ServerToClientEvents {
  dispatch: (data: SocketData) => void
  onmessage: (data: SocketData) => void
  send: (data: ServerTicket, callback?: (msg: string) => void) => void
}

export interface TicketMessage {
  type: 'text' | 'image' | 'file'
  data: string
  time?: number
  id?: string | number
}

export interface SocketMessage {
  msg: string
  data?: any
  status: 'ok' | 'error'
}
export interface ClientToServerEvents {
  join: (roomID: string | number, callback?: (msg: string) => void) => void
  send: (
    roomID: string | number,
    data: TicketMessage,
    callback?: (msg: SocketMessage) => void
  ) => void
  dispatch: (data: SocketData) => void
  onmessage: (data: SocketData) => void
}
export interface InterServerEvents {
  ping: () => void
}

export interface UserState {
  id: number
  mail: string
}

export type SocketInstance = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>
