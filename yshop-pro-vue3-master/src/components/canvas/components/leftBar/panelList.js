// 导入api接口模块
export const panelList = [
  {
    title: '基础组件',
    type: 1,
    classList: [
      {
        title: '商城头部',
        iconClass: 'icon-dianputoubu',
        type: 'header',
        undraggable: true, // 不可拖动
        onlyAdmin: false, // 平台端显示
        onlyApp: true, // 只在app显示
        componentContent: {
          type:1,
          pageBgColor: '#F5F5F5',
          imageUrl: 'https://b2c-pro-static-dev.zkthink.com/static/images/logo.png',
          keyList: [],
          toggleTime: 2,
          tabs: []
        },
      },
      {
        title: '轮播图',
        iconClass: 'icon-lunbo',
        type: 'banner',
        componentContent: {
          pageBgColor: '#F5F5F5',
          comBgColor: '#FFFFFF',
          height: 500,
          bannerData: [
            {
              bannerUrl: '',
              linkObj: {
                selectValue: '',
                selectName: '',
                typeText: '',
                url: '',
              },
            },
          ],
        },
      },
      {
        title: '标题文本',
        iconClass: 'icon-wenben',
        type: 'text',
        componentContent: {
          title: '标题', // 标题内容
          describe: '描述', // 描述内容
          textPos: 'left', // 文本对齐方向
          fontSizeNum: '32', // 文本字体大小
          describeSizeNum: '24', // 描述字体大小
          textFontW: 'normal', // 文本粗细
          describeFontW: 'normal', // 描述粗细
          titColor: '#333333', // 文本颜色
          describeColor: '#666666', // 描述颜色
          bgColor: '#FFFFFF', // 文本背景
          showLine: false, // 显示隐藏下划线
          showMore: false, // 显示隐藏更多
          styleValue: '1', // 查看更多样式
          link: '', // 查看更多链接
        },
      },
      {
        title: '公告',
        iconClass: 'icon-gonggao1',
        type: 'notice',
        componentContent: {
          pageBgColor: '#F5F5F5',
          comBgColor: '#FFFFFF',
          list: [{
            title: '',
            link: {
              selectValue: '',
              selectName: '',
              typeText: '',
              url: '',
            }
          }]
        },
      },
      {
        title: '品牌列表',
        iconClass: 'icon-pinpailiebiao',
        type: 'brandList',
        componentContent: {
          title: '品牌列表',
          pageBgColor: '#F5F5F5',
          imgList: [
            {
              title: '标题一',
              imgData: '',
              linkObj: {
                selectValue: '',
                selectName: '',
                typeText: '',
                url: '',
              },
            },
            {
              title: '标题二',
              imgData: '',
              linkObj: {
                selectValue: '',
                selectName: '',
                typeText: '',
                url: '',
              },
            },
            {
              title: '标题三',
              imgData: '',
              linkObj: {
                selectValue: '',
                selectName: '',
                typeText: '',
                url: '',
              },
            },
            {
              title: '标题四',
              imgData: '',
              linkObj: {
                selectValue: '',
                selectName: '',
                typeText: '',
                url: '',
              },
            },
          ],
          imgCurrent: null,
          showMore: false, // 显示隐藏更多
          linkObj: {
            selectValue: '',
            selectName: '',
            typeText: '',
            url: '',
          }, // 查看更多链接
        },
      },
      {
        title: '图文',
        iconClass: 'icon-tuwen',
        type: 'imageText',
        componentContent: {
          pageBgColor: '#F5F5F5',
          imageUrl: '',
          linkObj: {
            selectValue: '',
            selectName: '',
            typeText: '',
            url: '',
          },
          positionValue: 'left',
          title: 'title',
          content: '',
        },
      },
      {
        title: '图文列表',
        iconClass: 'icon-tuwenliebiao',
        type: 'imageTextList',
        componentContent: {
          title: '标题',
          textAlign: 'left',
          pageBgColor: '#F5F5F5',
          imgTextData: [
            {
              linkObj: {
                selectValue: '',
                selectName: '',
                typeText: '',
                url: '',
              },
              isShow: true,
              title: '图文标题',
              describe: '告别生活，畅享便携生活',
              imgData: '',
            },
            {
              linkObj: {
                selectValue: '',
                selectName: '',
                typeText: '',
                url: '',
              },
              isShow: true,
              title: '图文标题',
              text: '告别生活，畅享便携生活',
              imgData: '',
            },
            {
              linkObj: {
                selectValue: '',
                selectName: '',
                typeText: '',
                url: '',
              },
              isShow: true,
              title: '图文标题',
              describe: '告别生活，畅享便携生活',
              imgData: '',
            },
          ],
        },
      },
      {
        title: '图文导航',
        iconClass: 'icon-tuwendaohang',
        type: 'imageTextNav',
        componentContent: {
          pageBgColor: '#F5F5F5',
          comBgColor: '#FFFFFF',
          imgTextData: [
            {
              linkObj: {
                selectValue: '',
                selectName: '',
                typeText: '',
                url: '',
              },
              title: '标题',
              img: '',
            },
            {
              linkObj: {
                selectValue: '',
                selectName: '',
                typeText: '',
                url: '',
              },
              title: '标题',
              img: '',
            },
            {
              linkObj: {
                selectValue: '',
                selectName: '',
                typeText: '',
                url: '',
              },
              title: '标题',
              img: '',
            },
          ],
        },
      },
      {
        title: '铺助分割',
        iconClass: 'icon-fuzhufenge',
        type: 'assistDiv',
        componentContent: {
          height: 30,
          bgColor: '',
        },
      },
      {
        title: '自定义',
        iconClass: 'icon-mofang1',
        type: 'custom',
        componentContent: {
          pageBgColor: '#F5F5F5',
          layoutType: 'L1',
          density: '4',
          maxH: 0,
          imgClearance: 0,
          pageSpacing: 0,
          averageBoxData: [], // 记录格子的激活状态
          imgBoxActive: 0, // 记录框的位置
          elementNum: 1, // 生成格子数量
          imgData: [
            {
              src: '',
              linkObj: {
                selectValue: '',
                selectName: '',
                typeText: '',
                url: '',
              },
            },
            {
              src: '',
              linkObj: {
                selectValue: '',
                selectName: '',
                typeText: '',
                url: '',
              },
            },
          ],
        },
      },
      {
        title: '视频',
        iconClass: 'icon-shipin',
        type: 'videoBox',
        componentContent: {
          title: '标题',
          pageBgColor: '#F5F5F5',
          videoUrl: '',
          mainBody: '描述',
          coverImg: '',
        },
      },
      {
        title: '直播',
        iconClass: 'icon-zhibo',
        onlyAdmin: true, // 平台端显示
        onlyWeixin: true, // 只在小程序显示
        type: 'live',
        componentContent: {
          pageBgColor: '#F5F5F5',
          showMore: false,
        },
      },
    ],
  },
  {
    title: '商品组件',
    type: 1,
    classList: [
      {
        title: '商品列表',
        iconClass: 'icon-shangpin',
        type: 'productList',
        componentContent: {
          title: '商品列表',
          pageBgColor: '#F5F5F5',
          productData: {
            sourceType: '1',
            categoryId: 0,
            categoryName: '',
            imgTextData: [],
            productIdList: [],
          },
          productRowNum: 1, // 展示行数
          productNum: 4, //  展示列数
          arrangeType: '多行多列', // 布局方式
          showMore: false, // 显示隐藏更多
          styleValue: '1', // 查看更多样式
          linkObj: {
            selectValue: '',
            selectName: '',
            typeText: '',
            url: '',
          }, // 查看更多链接
        },
      },
      {
        title: '类别列表',
        iconClass: 'icon-leibieliebiao',
        type: 'categoryList',
        componentContent: {
          title: '类别列表',
          pageBgColor: '#F5F5F5',
          categoryData: [
            {
              id: 1,
              selClassData: [],
              img: '',
            },
            {
              id: 2,
              selClassData: [],
              img: '',
            },
            {
              id: 3,
              selClassData: [],
              img: '',
            },
            {
              id: 4,
              selClassData: [],
              img: '',
            },
          ],
          textAlign: 'center',
        },
      },
    ],
  },
  {
    title: '店铺组件',
    type: 2,
    classList: [
      {
        title: '拼团专区',
        iconClass: 'icon-pintuan1',
        type: 'groupList',
        componentContent: {
          // title: '拼团专区',
          id: '',
          name: '',
          pageBgColor: '#F5F5F5',
          productData: [],
          productRowNum: 1, // 展示行数
          productNum: 4, //  展示列数
          arrangeType: '多行多列', // 布局方式
          showMore: false, // 显示隐藏更多
          styleValue: '1', // 查看更多样式
        },
      },
      {
        title: '秒杀专区',
        iconClass: 'icon-miaosha1',
        type: 'spikeList',
        componentContent: {
          // title: '秒杀专区',
          pageBgColor: '#F5F5F5',
          comBgColor: '#FFFFFF',
          showMore: false, // 显示隐藏更多
          productData: [],
          sourceType: '1',
          productNum: 10,
          arrangeType: '横向滑动', // 布局方式
          id: '',
          name: ''
        },
      },
      {
        title: '限时折扣',
        iconClass: 'icon-zhekou1',
        type: 'discountList',
        componentContent: {
          // title: '限时折扣',
          pageBgColor: '#F5F5F5',
          comBgColor: '#FFFFFF',
          showMore: false, // 显示隐藏更多
          productData: [],
          sourceType: '1',
          productNum: 10,
          id: '',
          name: '',
          arrangeType: '横向滑动', // 布局方式
          moreBg: '',
        },
      },
      // {
      //   title: '定价捆绑',
      //   iconClass: 'icon-price',
      //   type: 'priceList',
      //   onlyMerchant: true, // 商家端显示
      //   componentContent: {
      //     // title: '定价捆绑',
      //     productData: {
      //       composeProducts: [],
      //     },
      //     productRowNum: 1, // 展示行数
      //     productNum: 4, //  展示列数
      //     arrangeType: '多行多列', // 布局方式
      //     showMore: false, // 显示隐藏更多
      //     styleValue: '1', // 查看更多样Z
      //     priceId: '',
      //   },
      // },
      // {
      //   title: '会员专区',
      //   iconClass: 'icon-huiyuan',
      //   type: 'vip',
      //   onlyAdmin: true, // 平台端显示
      //   componentContent: {
      //     // title: '会员专区',
      //     productData: {
      //       productIdList: [],
      //     },
      //     productRowNum: 1, // 展示行数
      //     productNum: 4, //  展示列数
      //     arrangeType: '多行多列', // 布局方式
      //     showMore: false, // 显示隐藏更多
      //     styleValue: '1', // 查看更多样式
      //   },
      // },
      {
        title: '优惠券',
        iconClass: 'icon-youhuiquan',
        type: 'coupon',
        componentContent: {
          pageBgColor: '#F5F5F5',
          arrangeActiveIndex: 2,
          cardActiveIndex: 1,
          colorActiveIndex: 0,
          arrangeType: '一行一个',
          selectedCoupon: [],
        },
      },
      // {
      //   title: '每日上新',
      //   iconClass: 'icon-new',
      //   type: 'newProduct',
      //   onlyApp: true, // 只在app显示
      //   componentContent: {
      //     productData: {
      //       sourceType: '1',
      //       imgTextData: [],
      //       productIdList: [],
      //     },
      //     showMore: false, // 显示隐藏更多
      //     styleValue: '1', // 查看更多样式
      //     linkObj: {
      //       selectValue: '',
      //       selectName: '',
      //       typeText: '',
      //       url: '',
      //     }, // 查看更多链接
      //   },
      // },
      // {
      //   title: '每日好店',
      //   iconClass: 'icon-toubu',
      //   type: 'shop',
      //   onlyApp: true, // 只在app显示
      //   componentContent: {
      //     imgTextData: [
      //       {
      //         linkObj: {
      //           selectValue: '',
      //           selectName: '',
      //           typeText: '',
      //           url: '',
      //         },
      //         img: '',
      //       },
      //     ],
      //   },
      // },
    ],
  },
]
export default panelList
