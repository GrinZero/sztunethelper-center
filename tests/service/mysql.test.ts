import { Command, condition } from '#service/mysql'
import { it, expect, describe } from 'vitest'

it('Command: insert', () => {
  const command = new Command('ticket_content').insert({ a: 1, b: 2 }).done()
  expect(command).toEqual('INSERT INTO `ticket_content` (`a`,`b`) VALUES (1,2)')
})

describe('Command: select', () => {
  it('Command: select=>empty', () => {
    const command = new Command('ticket_content').select().done()
    expect(command).toEqual('SELECT * FROM `ticket_content`')
  })

  it('Command: select=>base', () => {
    const command = new Command('ticket_content').select({ a: 1 }).done()
    expect(command).toEqual('SELECT `a` FROM `ticket_content`')
  })

  it('Command: select=>alias', () => {
    const command = new Command('ticket_content').select({ a: 'b' }).done()
    expect(command).toEqual('SELECT `a` as `b` FROM `ticket_content`')
  })

  it('Command: select=>multi table', () => {
    const command = new Command('ticket_content')
      .select({
        ticket_content: { a: 1 },
        ticket: { b: 1 }
      })
      .done()
    expect(command).toEqual(
      'SELECT `ticket_content`.`a`,`ticket`.`b` FROM `ticket_content`,`ticket`'
    )
  })
})

describe('Command: where', () => {
  it('Command: where=>base', () => {
    const command = new Command('ticket_content').select().where({ a: 1, b: 2 }).done()
    expect(command).toEqual('SELECT * FROM `ticket_content` WHERE `a` = 1 AND `b` = 2')
  })

  it('Command: where=>condition', () => {
    const command = new Command('ticket_content')
      .select()
      .where({ a: condition('>', 1), b: 2 })
      .done()
    expect(command).toEqual('SELECT * FROM `ticket_content` WHERE `a` > 1 AND `b` = 2')
  })
})

it('Command: high level', () => {
  const command = new Command()
    .select({
      ticket: {
        '*': 1
      },
      user: {
        username: 'adminName'
      }
    })
    .where({
      from: 'mail',
      status: condition('!=', 2),
      ticket: {
        to: '`user`.`mail`'
      }
    })
    .orderBy({ createTime: -1 })
    .limit(10)
    .offset(1)
    .done()
  expect(command).toEqual(
    "SELECT `ticket`.*,`user`.`username` as `adminName` FROM `ticket`,`user` WHERE `from` = 'mail' AND `status` != 2 AND `ticket`.`to` = `user`.`mail` ORDER BY `createTime` DESC LIMIT 10 OFFSET 1"
  )
})
