import publicRouter from '../index'

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
  contactType: 'socket' | 'mail' | 'image' | 'other'
}

publicRouter
  .get('/getBanner', async (ctx, _) => {
    const banners: Banner[] = [
      {
        id: 1,
        title: '我校首次推进宿舍网络认证客户端，点击查看',
        url: 'https://www.baidu.com',
        img: 'https://img1.baidu.com/it/u=1830000000,1830000000&fm=26&fmt=auto&gp=0.jpg'
      }
    ]
    ctx.body = {
      data: banners,
      code: 200,
      msg: 'success'
    }
  })
  .get('/getDuty', async (ctx, _) => {
    const currentDuty: Duty = {
      id: 2,
      name: '源心锁',
      avatarUrl: 'https://img.atobo.com/ProductImg/EWM/UWeb/1/9/4/0/0447/19400447/1.gif',
      desc: '我是源心锁，2019级大数据学院学生',
      contact: 'Phone: 17603095310',
      rate: 4.5,
      contactType: 'mail'
    }
    ctx.body = {
      data: currentDuty,
      code: 200,
      msg: 'success'
    }
  })
