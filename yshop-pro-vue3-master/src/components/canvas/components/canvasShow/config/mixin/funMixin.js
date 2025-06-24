import sendReqMixin from './sendReqMixin'
import { useRouter } from 'vue-router'

export default function () {
  const router = useRouter()
  const { sendReq } = sendReqMixin()
  const isEdit = localStorage.getItem('isEdit')
  //  请求数据前 请求完再显示所有组件
  function beforeGetData () {
    if (typeof uni !== 'undefined') {
      uni.getStorage({
        key: 'sendNum',
        success: function (res) {
          const sendNum = res.data
          uni.setStorage({ key: 'sendNum', data: parseInt(sendNum) + 1 })
        },
      })
    } else {
      const sendNum = localStorage.getItem('sendNum')
      localStorage.setItem('sendNum', parseInt(sendNum) + 1)
    }
  }
  //  请求数据后
  function afterGetData () {
    if (typeof uni !== 'undefined') {
      uni.getStorage({
        key: 'sendNum',
        success: function (res) {
          const sendNum = res.data
          uni.setStorage({ key: 'sendNum', data: parseInt(sendNum) - 1 })
        },
      })
    } else {
      const sendNum = localStorage.getItem('sendNum')
      localStorage.setItem('sendNum', parseInt(sendNum) - 1)
    }
  }
  // 判断url
  function jumpLink (linkObj) {
    if (isEdit !== 'true') {
      var link = ''
      if (typeof uni !== 'undefined') {
        console.log(linkObj.data)
        if (linkObj && linkObj.typeText && linkObj.data) {
          switch (linkObj.typeText) {
            case '类别':
              this.jumpCategory(linkObj.data)
              break
            case '店辅':
              this.jumpStore(linkObj.data)
              break
            case '商品':
              this.jumpProductDetail(linkObj.data)
              break
            case '自定义':
              // router.push("/category");
              break
            case '公告':
              this.jumpNoticeDetail(linkObj.data)
              break
          }
        } else if (linkObj.selsectValue === '/index') {
          uni.navigateTo({
            url: `/pages/index/index`
          })
        }
        return link
      } else {
        if (linkObj && linkObj.typeText && linkObj.data) {
          const data = {
            productId: linkObj.data.productId,
            skuId: linkObj.data.skuId,
            shopId: linkObj.data.shopId
          }
          switch (linkObj.typeText) {
            case '类别':
              router.push({ name: 'category', query: { classifyData: JSON.stringify(linkObj.data) }})
              break
            case '店辅':
              router.push({
                path: '/store',
                query: { shopId: linkObj.data.shopId }
              });
              break
            case '商品':
              router.push({
                path: '/productDetail',
                query: {
                  proData: JSON.stringify(data)
                }
              })
              break
            case '自定义':
            // router.push("/activity/category");
              break
          }
        } else if (linkObj.selsectValue === '/index') {
          router.push('/index');
        }
        return link
      }
    }
  }
  // 跳转到类别主页
  function jumpCategory (item) {
    if (isEdit !== 'true') {
      if (typeof uni !== 'undefined') {
        uni.navigateTo({
          url: `/pages_category_page1/goodsModule/goodsList?category3Id=${item.id}`
        })
      } else {
        router.push({ name: 'category', query: { classifyData: JSON.stringify(item) }})
      }
    }
  }
  // 跳转到店铺主页
  function jumpStore (item) {
    if (isEdit !== 'true') {
      if (typeof uni !== 'undefined') {
        uni.navigateTo({
          url: `/pages_category_page1/store/index?storeId=${item.shopId}`
        })
      } else {
        router.push({
          path: '/store',
          query: { shopId: item.shopId }
        });
      }
    }
  }
  // 跳转到商品详情
  function jumpProductDetail (item) {
    if (isEdit !== 'true') {
      if (typeof uni !== 'undefined') {
        uni.navigateTo({
          url: '/pages_category_page1/goodsModule/goodsDetails?shopId=' + item.shopId + '&productId=' + item.productId + '&skuId=' + item
            .skuId
        })
      } else {
        const data = {
          productId: item.productId,
          skuId: item.skuId,
          shopId: item.shopId
        }
        router.push({
          path: '/productDetail',
          query: {
            proData: JSON.stringify(data)
          }
        });
      }
    }
  }
  // 跳转到秒杀专区
  function jumpSeckills (item, ids) {
    if (isEdit !== 'true') {
      if (typeof uni !== 'undefined') {
        if (item.shopId) {
          uni.navigateTo({
            url: '/pages_category_page1/discount/spikeList?shopId=' + item.shopId + '&shopSeckillId=' + item.shopSeckillId
          })
        } else {
          uni.navigateTo({
            url: '/pages_category_page1/discount/spikeList'
          })
        }
      } else {
        if (item.shopId) {
          router.push({
            path: '/activity/rabatt',
            query: { shopId: item.shopId, ids: ids }
          });
        } else {
          router.push({
            path: '/activity/rabatt',
            query: { id: item.seckillId }
          });
        }
      }
    }
  }
  // 跳转到拼团专区
  function jumpGroupWorks (item) {
    if (isEdit !== 'true') {
      if (typeof uni !== 'undefined') {
        if (item.shopId) {
          uni.navigateTo({
            url: '/pages_category_page1/discount/groupBuy?shopId=' + item.shopId + '&shopGroupWorkId=' + item.shopGroupWorkId
          })
        } else {
          uni.navigateTo({
            url: '/pages_category_page1/discount/groupBuy?'
          })
        }
      } else {
        if (item.shopId) {
          router.push({
            path: '/activity/groupBuy',
            query: { shopId: item.shopId, id: item.shopGroupWorkId }
          });
        } else {
          router.push({
            path: '/activity/groupBuy',
            query: { id: item.groupWorkId }
          });
        }
      }
    }
  }
  // 跳转到折扣专区
  function jumpDiscount (item) {
    if (isEdit !== 'true') {
      if (typeof uni !== 'undefined') {
        if (item.shopId) {
          if (item.shopDiscountId) {
            uni.navigateTo({
              url: '/pages_category_page1/discount/discount?shopId=' + item.shopId + '&shopDiscountId=' + item.shopDiscountId
            })
          } else {
            uni.showToast({
              title: '暂无活动',
              icon: 'none'
            });
          }
        } else {
          if (item.discountId) {
            uni.navigateTo({
              url: '/pages_category_page1/discount/platformDiscount?discountId=' + item.discountId
            })
          } else {
            uni.showToast({
              title: '暂无活动',
              icon: 'none'
            });
          }
        }
      } else {
        if (item.shopId) {
          router.push({
            path: '/activity/spitze',
            query: { shopId: item.shopId, id: item.shopDiscountId }
          });
        } else {
          router.push({
            path: '/activity/spitze',
            query: { id: item.discountId }
          });
        }
      }
    }
  }
  // 跳转到会员专区
  function jumpVip () {
    if (isEdit !== 'true') {
      if (typeof uni !== 'undefined') {
        uni.navigateTo({
          url: '/pages_category_page1/memberCenter/activityList',
          success: res => {}, fail: () => {}, complete: () => {}
        })
      } else {
        router.push({
          path: '/activity/vip'
        });
      }
    }
  }
  // 定价捆绑跳转
  function jumpPrice (id) {
    if (isEdit !== 'true') {
      if (typeof uni !== 'undefined') {
        console.log('移动端定价捆绑跳转')
      } else {
        router.push({
          path: '/activity/bind',
          query: {
            shopId: id
          }
        });
      }
    }
  }
  // 跳转到公告详情
  function jumpNoticeDetail (item) {
    if (isEdit !== 'true') {
      if (typeof uni !== 'undefined') {
        uni.navigateTo({
          url: '/pages_category_page2/userModule/messageDetail?noticeId=' + item.noticeId
        })
      } else {
        this.$router.push({
          path: '/activity/notificationDetails',
          query: {
            id: item.noticeId
          }
        })
      }
    }
  }

  // 跳转到画布产品列表
  function jumpProList (item) {
    if (isEdit !== 'true') {
      if (typeof uni !== 'undefined') {
        if (item.sourceType === '1') {
          uni.navigateTo({
            url: `/pages_category_page1/goodsModule/canvasGoods?sourceType=${item.sourceType}&ids=${item.productIdList}`
          })
        } else if (item.sourceType === '2') {
          uni.navigateTo({
            url: `/pages_category_page1/goodsModule/canvasGoods?sourceType=${item.sourceType}&classifyId=${item.categoryId}`
          })
        }
      } else {
        if (item.sourceType === '1') {
          router.push({
            path: '/canvasGoods',
            query: {
              sourceType: item.sourceType,
              ids: item.productIdList.join(',')
            }
          });
        } else if (item.sourceType === '2') {
          router.push({
            path: '/canvasGoods',
            query: {
              sourceType: item.sourceType,
              classifyId: item.categoryId
            }
          });
        }
      }
    }
  }

  // 查询产品
  function searchPro (key, type) {
    if (isEdit !== 'true') {
      if (typeof uni !== 'undefined') {
        console.log('移动端查询')
      } else {
        if (this.$route.name !== 'search') {
          this.$router.push({
            path: '/search',
            query: {
              keyword: key,
              searchVal: type
            }
          })
        } else {
          this.$emit('search', this.keyword, this.searchVal)
        }
      }
    }
  }

  // 跳转到直播列表
  function jumpLive () {
    uni.navigateTo({
      url: '/pages_category_page2/livePage/index'
    })
  }

  // 跳转组合支付
  function jumpCombination (item) {
    if (item.priceId) {
      uni.navigateTo({
        url: '/pages_category_page1/goodsModule/combination?priceId=' + item.priceId
      })
    } else {
      uni.showToast({
        title: '暂无活动',
        icon: 'none'
      });
    }
  }

  // 加入购物车
  function addCart (id) {
    console.log(id)
  }
  return {
    sendReq,
    beforeGetData,
    afterGetData,
    jumpLink,
    jumpCategory,
    jumpStore,
    jumpProductDetail,
    jumpSeckills,
    jumpGroupWorks,
    jumpDiscount,
    jumpVip,
    jumpNoticeDetail,
    addCart,
    jumpPrice,
    jumpProList,
    searchPro,
    jumpLive,
    jumpCombination
  }
}
