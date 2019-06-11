import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Button, Swiper, SwiperItem, Radio, RadioGroup, Text } from '@tarojs/components'
const api = require('../../../config/api.js');

import './details.scss'


class OrderDetails extends Component {

    /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
    config: Config = {
    navigationBarTitleText: '订单详情'
  }
  state = {
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    items: [
      { name: '0', value: '商家配送', checked: true },
      { name: '1', value: '到店自提' }
    ],
    orderDetail:{}
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }
  componentWillMount(){
    this.getDetailsFn()
  }
  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  getDetailsFn(){
      Taro.request({
          url:api.orderDetailPath,
          method:"POST",
          data:{
            orderId:this.$router.params.id
          },
          header:{
            token:Taro.getStorageSync('token')
          }
      }).then((res) =>{
          if(res.data.success){
            this.setState({
                orderDetail:res.data.data
            })
          }
      })
  }

  render () {
    const {orderDetail}=this.state    
    return (
      <View className='order_detail_box fixIphonex'>
          <View className="order-detail-deliver-goods">
              <View className="font38">商家备货中</View>
              <View className="font28 m-t-3" hidden={true}></View>
          </View>
          <View className="order-delivery">
              <View className=""></View>
              <View className="order-detail-delivery flex flex-v-center bgwh border-bottom-1px" hidden={true}>
                  <View className="order-detail-icon iconfont icon-xinxi"></View>
                  <View className="delivery-address-box font26 flex1 color-3 bgwh">
                      <View className="order-subjoin-itemorder-subjoin-item">
                          配送方式：到店自提
                      </View>
                  </View>
              </View>
              <View className="order-detail-delivery flex flex-v-center bgwh border-bottom-1px">
                <View className="order-detail-icon iconfont icon-shouhuodizhi"></View>
                <View className="delivery-address-box flex1 font26 color-3">
                    <View className="flex">
                        <View className="flex1">
                            <Text className="letter-spacing-9">收货人</Text>： {orderDetail.deliveryInfo.truename}
                        </View>
                        <Text>{orderDetail.deliveryInfo.phone}</Text>
                    </View>
                    <View className="detail-delivery-address">
                        收货地址：{orderDetail.deliveryInfo.address}
                    </View>
                </View>
            </View>
          </View>
          <View className="order-detail-shopping flex border-bottom-1px bgwh">
              <View className="order-detail-icon iconfont icon-gouwuqingdan"></View>
              <View className="font28 color-3">
                  购物清单
              </View>
          </View>
          <View>
              <View className="order-shopping-list bgwh">
                  <View>                      
                      {
                          orderDetail['goodsList'].map((item)=>{
                            return (
                                <View key={item.goodsId} className="order-goods border-bottom-1px">
                                    <View className="flex">
                                        <Image className="order-goods-img" mode='aspectFill' src={item.mainPic}></Image>
                                        <View className="order-goods-detail flex1">
                                            <View className="flex font26">
                                                <View className="order-goods-title text-line2 flex1">
                                                    {item.goodsName}
                                                </View>
                                                <View className="order-goods-price tr">
                                                    ¥{item.price}
                                                </View>
                                            </View>
                                            <View className="order-goods-sku flex">
                                                <View className="flex1 font22">{item.colorName}/{item.sizeName}</View>
                                                <View className="order-goods-count font26 tr">
                                                    x{item.count}
                                                </View>
                                            </View>
                                            <View className="order-goods-tags font20 flex">
                                                <View className="order-goods-tag">会员</View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )
                          })
                      }
                  </View>
                  <View className="order-detail-msg font26 color-9 border-bottom-1px">买家留言</View>
              </View>
              <View className="order-detail-price font26 g64 bgwh">
                  <View className="flex flex-between flex-v-center">
                      <View>商品金额</View>
                      <View>
                          ¥{orderDetail['orderMoney']}
                      </View>
                  </View>
                  <View className="flex flex-between flex-v-center">
                      <View>优惠券</View>
                      <View>-¥0</View>
                  </View>
                  <View className="flex flex-between flex-v-center">
                      <View>实际支付</View>
                      <View className="theme-color">
                          ¥{orderDetail['payMoney']}
                      </View>
                  </View>
              </View>
          </View>
          <View className="order-detail-record font26 g64 bgwh detail-record-bottom">
              <View className="item classname flex flex-between flex-v-center">
                  <View>
                      订单编号： {orderDetail['orderId']}
                  </View>
                  <View data-orderno="8811948016528">复制</View>
              </View>
              <View className='item'>
                  服务门店： 演示账号
              </View>
              <View className='item'>
                  下单时间：{orderDetail['ctime']}
              </View>
              <View className='item' hidden={true}>支付时间：1970.01.01 08:00:00</View>
              <View className='item' hidden={true}> 交易单号：</View>
              <View className='item'>
                  支付方式：线下支付
              </View>
              <View className='item' hidden={true}>
                  完成时间：1970.01.01 08:00:00
              </View>
              <View className='item' hidden={true}>
                  取消时间：1970.01.01 08:00:00
              </View>
              <View className='item' hidden={true}>
                  确认收货时间：1970.01.01 08:00:00
              </View>
          </View>
          <View className="order-detail-action fixIphonex border-top-1px font26 bgwh">
              <View className="detail-action-handle bdc-64" data-iscycle="false" data-type="2">取消订单</View>
          </View>
          {/* <View className=" fixed-btn-group iphoneXMB">
              <View className="btn">
              <a href="http://100000260628.im.n.weimob.com/saas/im/100000260628?btype=ec&amp;pid=100000260628&amp;storeId=60296628&amp;pageName=%E8%AE%A2%E5%8D%95%E8%AF%A6%E6%83%85&amp;orderNo=8811948016528&amp;url=http%3A%2F%2Fn.weimob.com%2Fsaas%2Fpayment%2Fweixinpay%2Fretail_orderdetail%3Fpid%3D100000260628%26storeId%3D60296628%26orderNo%3D8811948016528"
                      to="http://100000260628.im.n.weimob.com/saas/im/100000260628?btype=ec&amp;pid=100000260628&amp;storeId=60296628&amp;pageName=%E8%AE%A2%E5%8D%95%E8%AF%A6%E6%83%85&amp;orderNo=8811948016528&amp;url=http%3A%2F%2Fn.weimob.com%2Fsaas%2Fpayment%2Fweixinpay%2Fretail_orderdetail%3Fpid%3D100000260628%26storeId%3D60296628%26orderNo%3D8811948016528"><span
                          className="iconfont icon-customer color-6"></span></a></View>
              <View className="btn btn-hide"><span className="iconfont icon-fixed-top color-6"></span></View>
          </View> */}
      </View>
    )
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default OrderDetails as ComponentClass
