import publicRouter from '../index'
import { control, Command, condition } from '#/service/mysql'

interface Banner {
  id: number
  title: string
  url: string
  img: string
}

interface Duty {
  id: number
  name: string
  avatarUrl: string
  desc: string
  contact: string
  rate: number | null
  mail: string
  contactType: 'socket' | 'mail' | 'image' | 'other'
}

publicRouter.get('/getBaseData', async (ctx, _) => {
  const currentDate = new Date()
  const curDay = currentDate.getDay()
  const curStamp = currentDate.getTime()
  const oneMonth = 30 * 24 * 60 * 60 * 1000

  const avgRateCommand = `(
    select avg(rate) from ticket
    where ticket.to = user.mail and ticket.status >= 1
    and ticket.rate > 0 and ticket.createTime > ${curStamp - oneMonth}
  )`
  const dutyCommand = new Command()
    .select({
      duty: {
        contact: 1,
        contactType: 1
      },
      user: {
        id: 1,
        avatar: 'avatarUrl',
        mail: 1,
        introduce: 'desc',
        username: 'name'
      },
      [avgRateCommand]: 'rate'
    })
    .where({
      duty: {
        onDutyTime: curDay,
        userID: '`user`.`id`'
      }
    })
    .done()

  const bannerCommand = new Command()
    .select({
      banner: {
        '*': 1
      }
    })
    .where({
      overdueTime: condition('<', curStamp)
    })
    .done()

  const noticeCommand = new Command()
    .select({
      notice: {
        '*': 1
      }
    })
    .where({
      overdueTime: condition('<', curStamp)
    })
    .done()

  const [duty, banner, notice] = await Promise.all([
    control(dutyCommand),
    control(bannerCommand),
    control(noticeCommand)
  ])

  ctx.body = {
    code: 0,
    data: {
      duty: (duty.results[0] as Duty) ?? null,
      banner: banner.results as Banner[],
      notice: notice.results[0] ?? null
    }
  }
})
