import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Text, Icon, Image, Input } from '@tarojs/components'

const api = require('../../config/api.js');

import './index.scss'

class Index extends Component {

    /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
    config: Config = {
    navigationBarTitleText: '首页'
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }
  
  componentWillMount(){     
    // Taro.showTabBar({}) 
    this.getShopActivity();
  }
  componentDidMount(){
    console.log(1)
  }
  componentWillUnmount () {  }
  componentDidShow () {
    this.getIndeList();
  }
  //首页商品展示信息
  getIndeList(){
    Taro.request({
      url:api.goodsIndexCategorygoodsPath,
      method:'POST',
      header:{
        token:Taro.getStorageSync('token')
      }
    }).then((res)=>{
      if(res.data.success){
        this.setState({
          typeGoodsList:res.data.data
        })
      }
    })
  }
  //获取 店铺 活动信息
  getShopActivity(){
    Taro.request({
      url:api.activityQueryPath,
      method:'POST',
      data:{
          "actId": "",
          "shopId": "1",
          "status": null,
          "type": [1,2,3,4,5,6]
      },
      header:{
        token:Taro.getStorageSync('token')
      }
    }).then((res)=>{
      if(res.data.success){
        Taro.setStorageSync("allCouponList",res.data.data.couponRules);
        Taro.setStorageSync("allActivityList",res.data.data.activityRules);
      }
    })
  }





  componentDidHide () { }
  state = {
    posts: [
      {id:1, imgurl: '/static/images/1.jpg', title: '气质白气质白色连衣裙气质白色连衣裙色连衣裙', lump: 1 },
      {id:2, imgurl: '/static/images/2.jpg', title: '气质白气质白色连衣衣衣衣裙气质白色连衣裙色连衣裙', lump: 1 },
      {id:3, imgurl: '/static/images/7.jpg', title: '气质白气质白色连衣裙气质白色连衣裙色连衣裙', lump: 1 },
      {id:4, imgurl: '/static/images/1.jpg', title: '气质白气质白色连衣裙气质白色连衣裙色连衣裙', lump: 3 },
    ],
    typeGoodsList:[
      {
        categoryId:'',name:'',
        goodsList:[
          {
            "goodsId": "",
            "dispPrice": 0,
            "price": null,
            "goodsName": "",
            "mainPic": null,
            "tag": null
          }
        ]
      }
    ]
  }
  goDetailPage(id){
    Taro.navigateTo({
      url: '/pages/goods/details/details?id='+id
    })
  }
  render () {
    const { posts } = this.state
    // const goodsItem = posts.map((post) =>{
    //   return <View className='goodsItem' key={post.id}>
    //           <Image className='goods_img' mode='aspectFill' src={require('../../images/goods/1.jpg')}></Image>
    //           <View className={'title '+(post.lump==1?'lump':'')}>{post.title}</View>
    //           <View className='lump' hidden={post.lump!=1}>
    //             <Text className='text'>拼团</Text>
    //           </View>
    //           <View className='bottom'>
    //             <Text className='vip'>会员</Text>
    //             <Text className='b'>￥</Text>
    //             <Text className='span'>0.87</Text>
    //             {/* <Image className='image' src={require('../../images/index03.jpg')}></Image> */}
    //             <View className='image iconfont icon-xingouwuche theme-color'></View>
    //           </View>
    //         </View>
    // })

    return (
      <View>
        <View className='searach_box'>
          <View className='searach_con'>
            <View className='icon iconsearch iconfont icon-newsearch'></View>
            <Input type='text' placeholder='搜索店铺内商品'></Input>    
          </View>
        </View>
        <View className='index_head'>
          <Image className='bg' mode='aspectFill' src={require('../../images/goods/7.jpg')}></Image>
          <Button>切换门店</Button>
          <Image className='center' mode='scaleToFill' src={require('../../images/goods.png')}></Image>
          <Text className="text">KK商城演示账户</Text>
        </View>
        {/* <View className='discounts_box'>
          <Image className='image' mode='aspectFill' src={require('../../images/a.jpg')}></Image>
          <Image className='image' mode='aspectFill' src={require('../../images/a.jpg')}></Image>
        </View> */}
        <View className="coupon_1">
          <View className="coupon_area">
            <View className="swiper-container">
                <View className="swiper-wrapper">
                    <View className="swiper-slide swiper-slide-visible swiper-slide-active">
                        <View className="coupon_bg">
                            <View className="coupon_12 flex coupon-picker discoloration">
                                <View className="coupon-price">
                                    <View className="price-number price-number_3">
                                        <Text className='text'>¥</Text>0.5
                                    </View>
                                    <View className="couponline"></View>
                                    <View className="coupondec font24 text-line-1">满2使用</View>
                                </View>
                                <View className="coupon-operate">
                                    <View className="font26 fontweight_300 index_btn" data-elementid="领取">领取</View>
                                </View>
                                <View className="border-indexcoupon"></View>
                            </View>
                        </View>
                    </View>
                    <View className="swiper-slide swiper-slide-visible">
                        <View className="coupon_bg">
                            <View className="coupon_12 flex coupon-picker discoloration">
                                <View className="coupon-price">
                                    <View>
                                      <Text className="coupon_discount">8</Text>
                                      <Text className="coupon_fsize">折</Text>
                                    </View>
                                    <View className="couponline"></View>
                                    <View className="coupondec font24 text-line-1">满5使用</View>
                                </View>
                                <View className="coupon-operate">
                                    <View className="font26 fontweight_300 index_btn" data-elementid="领取">领取</View>
                                </View>
                                <View className="border-indexcoupon"></View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
          </View>
        </View>

        <View className='firstHot'>
          <Image className='image' mode='aspectFill' src={require('../../images/goods/2.jpg')}></Image>
        </View>
        {/* <View className='pintuan'>
          <Text className='bigtitle'>一起来拼团</Text>
          <View className='item_box'>
            <Image className='image' mode='aspectFill' src={require('../../images/goods/3.jpg')}></Image>
            <View className='item_right'>
              <View className='txtCon'>
                <Text className='goodsTitle'>气质白色连衣裙（演示，不发货）</Text>
                <View className='price_box'>
                  <View className='price_left'>
                    <Text className='symbol'>￥</Text>
                    <Text className='num'>0.01</Text>
                  </View>
                  <Button>去拼团</Button>
                </View>
              </View>
              <View className='more'>
                <Text className="text">查看更多</Text>
              </View>
            </View>
          </View>
        </View>
        <View className='pintuan'>
          <Text className='bigtitle'>一起来砍价</Text>
          <View className='item_box'>
            <Image className='image' mode='aspectFill' src={require('../../images/goods/9.jpg')}></Image>
            <View className='item_right'>
              <View className='txtCon'>
                <Text className='goodsTitle'>气质白色连衣裙（演示，不发货）</Text>
                <View className='price_box'>
                  <View className='price_left'>
                    <Text className='symbol'>￥</Text>
                    <Text className='num'>0.01</Text>
                  </View>
                  <Button>发起砍价</Button>
                </View>
              </View>
              <View className='more'>
                <Text className="text">查看更多</Text>
              </View>
            </View>
          </View>
        </View> */}
        {
          this.state.typeGoodsList.map((item) =>{
            return (
            <View className='style_box' key={item.categoryId}>
              <View className='style_title'>
                {item.name}
                {/* <Image className='image' mode='aspectFit' src={require('../../images/styleIcon01.jpg')}></Image> */}
              </View>
              <View className='goodsList_box'>
                {
                  item.goodsList.map((itemC)=>{
                    return <View onClick={this.goDetailPage.bind(this,itemC.goodsId)} className='goodsItem' key={itemC.goodsId}>
                      <Image className='goods_img' mode='aspectFill' src={itemC.mainPic}></Image>
                      <View className={'title '+(itemC['lump']==1?'lump':'')}>{itemC.goodsName}</View>
                      <View className='lump' hidden={itemC['lump']!=1}>
                        <Text className='text'>拼团</Text>
                      </View>
                      <View className='bottom'>
                        <Text className='vip'>会员</Text>
                        <Text className='b'>￥</Text>
                        <Text className='span'>{itemC.dispPrice}</Text>
                        <View className='image iconfont icon-xingouwuche theme-color'></View>
                      </View>
                    </View>
                  })
                }
              </View>
            </View>)
          })
        }
        {/* <View className='style_box'>
          <View className='style_title'>
            <Image className='image' mode='aspectFit' src={require('../../images/styleIcon02.jpg')}></Image>
          </View>
          <View className='goodsList_box'>
            {goodsItem}
          </View>
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

export default Index as ComponentClass
