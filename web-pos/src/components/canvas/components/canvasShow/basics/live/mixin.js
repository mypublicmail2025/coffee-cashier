import {
  ref,
  onMounted
} from 'vue';
import { funMixin } from '../../config/mixin'

export default function () {
  const { jumpLive } = funMixin()
  const appid = ref('wx2b03c6e691cd7370')
  const roomId = ref([]) // 填写具体的房间号
  const roomList = ref([])

  onMounted(() => {
    getLiveRooms()
  })

  // 获取直播间列表
  function getLiveRooms () {
    // Net.request('https://api.weixin.qq.com/wxa/business/getliveinfo?access_token=').then(res => {})
    const response = {
      errcode: 0, // 错误码，0代表成功，1代表未创建直播间
      errmsg: 'ok', // 错误信息
      total: 1,
      room_info: [{
        name: '直播房间名',
        roomid: 1,
        cover_img: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.eJnwPMdBIGhMob2NTkqGUAHaJa?pid=ImgDet&rs=1',
        share_img: 'http://http://mmbiz.qpic.cn/mmbiz_jpgRl1RuuhdstSfZa8EEljedAYcbtX3Ejpdl2et1tPAQ37bdicnxoVialDLCKKDcPBy8Iic0kCiaiaalXg3EbpNKoicrweQ/0?wx_fmt=jpeg',
        live_status: 101,
        // "live_status": 101, // 直播间状态。101：直播中，102：未开始，103已结束，104禁播，105：暂停，106：异常，107：已过期
        start_time: 1568128900, // 直播间开始时间，列表按照start_time降序排列
        end_time: 1568131200, // 直播计划结束时间
        anchor_name: '里斯',
        goods: [{
          cover_img: 'http://http://mmbiz.qpic.cn/mmbiz_jpg/Rl1RuuhdstSfZa8EEljedAYcbtX3Ejpdl2et1tPAQ37bdicnxoVialDLCKKDcPBy8Iic0kCiaiaalXg3EbpNKoicrweQ/0?wx_fmt=jpeg',
          url: 'pages/index/index.html',
          name: '茶杯',
          price: 1889, // 价格（分）
          price2: 0,
          price_type: 1, // 价格类型，1：一口价（只需要传入price，price2不传） 2：价格区间（price字段为左边界，price2字段为右边界，price和price2必传） 3：显示折扣价（price字段为原价，price2字段为现价， price和price2必传）
          goods_id: 256, // 商品id
          third_party_appid: 'wx3d0fae56402d8a81', // 第三方商品appid ,当前小程序商品则为空
        },],
        live_type: 0, // 直播类型，1 推流 0 手机直播
        close_like: 0, // 是否关闭点赞 【0：开启，1：关闭】（若关闭，观众端将隐藏点赞按钮，直播开始后不允许开启）
        close_goods: 0, // 是否关闭货架 【0：开启，1：关闭】（若关闭，观众端将隐藏商品货架，直播开始后不允许开启）
        close_comment: 0, // 是否关闭评论 【0：开启，1：关闭】（若关闭，观众端将隐藏评论入口，直播开始后不允许开启）
        close_kf: 1, // 是否关闭客服 【0：开启，1：关闭】 默认关闭客服（直播开始后允许开启）
        close_replay: 1, // 是否关闭回放 【0：开启，1：关闭】默认关闭回放（直播开始后允许开启）
        is_feeds_public: 0, // 是否开启官方收录，1 开启，0 关闭
        creater_openid: 'oawjt4t9NWZV2BYaEPA89sh1XblE', // 创建者openid
        feeds_img: 'XXX', // 官方收录封面
      },
      {
        name: '直播房间名',
        roomid: 2,
        cover_img: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.eJnwPMdBIGhMob2NTkqGUAHaJa?pid=ImgDet&rs=1',
        share_img: 'http://http://mmbiz.qpic.cn/mmbiz_jpgRl1RuuhdstSfZa8EEljedAYcbtX3Ejpdl2et1tPAQ37bdicnxoVialDLCKKDcPBy8Iic0kCiaiaalXg3EbpNKoicrweQ/0?wx_fmt=jpeg',
        live_status: 102,
        // "live_status": 101, // 直播间状态。101：直播中，102：未开始，103已结束，104禁播，105：暂停，106：异常，107：已过期
        start_time: 1639223017, // 直播间开始时间，列表按照start_time降序排列
        end_time: 1639200008, // 直播计划结束时间
        anchor_name: '里斯',
        goods: [{
          cover_img: 'http://http://mmbiz.qpic.cn/mmbiz_jpg/Rl1RuuhdstSfZa8EEljedAYcbtX3Ejpdl2et1tPAQ37bdicnxoVialDLCKKDcPBy8Iic0kCiaiaalXg3EbpNKoicrweQ/0?wx_fmt=jpeg',
          url: 'pages/index/index.html',
          name: '茶杯',
          price: 1889, // 价格（分）
          price2: 0,
          price_type: 1, // 价格类型，1：一口价（只需要传入price，price2不传） 2：价格区间（price字段为左边界，price2字段为右边界，price和price2必传） 3：显示折扣价（price字段为原价，price2字段为现价， price和price2必传）
          goods_id: 256, // 商品id
          third_party_appid: 'wx3d0fae56402d8a81', // 第三方商品appid ,当前小程序商品则为空
        },],
        live_type: 0, // 直播类型，1 推流 0 手机直播
        close_like: 0, // 是否关闭点赞 【0：开启，1：关闭】（若关闭，观众端将隐藏点赞按钮，直播开始后不允许开启）
        close_goods: 0, // 是否关闭货架 【0：开启，1：关闭】（若关闭，观众端将隐藏商品货架，直播开始后不允许开启）
        close_comment: 0, // 是否关闭评论 【0：开启，1：关闭】（若关闭，观众端将隐藏评论入口，直播开始后不允许开启）
        close_kf: 1, // 是否关闭客服 【0：开启，1：关闭】 默认关闭客服（直播开始后允许开启）
        close_replay: 1, // 是否关闭回放 【0：开启，1：关闭】默认关闭回放（直播开始后允许开启）
        is_feeds_public: 0, // 是否开启官方收录，1 开启，0 关闭
        creater_openid: 'oawjt4t9NWZV2BYaEPA89sh1XblE', // 创建者openid
        feeds_img: 'XXX', // 官方收录封面
      },
      ],
    }
    roomList.value = response.room_info
  }

  function toLiveRoom (item) {
    roomId.value.push(item.roomid)
    if (!appid.value || !roomId.value.length) {
      return
    }
    // 路由参数
    const customParams = encodeURIComponent(
      JSON.stringify({
        path: 'livePage/index',
        pid: 1
      })
    )
    // let customParams
    // 开发者在直播间页面路径上携带自定义参数（如示例中的path和pid参数），后续可以在分享卡片链接和跳转至商详页时获取，详见【获取自定义参数】、【直播间到商详页面携带参数】章节（上限600个字符，超过部分会被截断）
    // #ifdef MP-WEIXIN
    // eslint-disable-next-line no-undef
    wx.navigateTo({
      url: `plugin-private://${appid.value}/pages/live-player-plugin?room_id=${roomId.value}&custom_params=${customParams}`,
    })
    // #endif
  }

  return {
    appid,
    roomId,
    roomList,
    toLiveRoom,
    jumpLive
  }
}
