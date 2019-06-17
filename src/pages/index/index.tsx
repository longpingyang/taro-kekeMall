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
  }
  
  componentWillMount(){     
    // Taro.showTabBar({}) 
    
  }
  componentDidMount(){
  }
  componentWillUnmount () {  }
  componentDidShow () {
    this.getShopActivity();
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


        //优惠券 信息筛选
        let tempList=Taro.getStorageSync('allCouponList');        
        let tempArr = [];
        tempList.forEach(element => {
            tempArr=[...tempArr,...element.coupons];
        });
        let couponlist=[];
        tempArr.forEach(ele => {
          if(ele.isGoods==0){
            couponlist.push(ele);
          }
        });    
        if(couponlist.length>2){
          couponlist = couponlist.slice(0,1);
        }
        this.setState((data) =>{
          data['activityData']=res.data.data;
          data['couponList']= couponlist;
        })
      }else{
        if(res.data.errorCode=='E401'){
          Taro.setStorageSync('userMember',null);
        }
      }
    })
  }





  componentDidHide () { }
  state = {
    posts: [
      // {id:1, imgurl: '/static/images/1.jpg', title: '气质白气质白色连衣裙气质白色连衣裙色连衣裙', lump: 1 },
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
    ],
    couponList:[],//礼券列表
    activityData:{
      activityRules:[],
      couponRules:[]
    }
  }
  goDetailPage(id){
    Taro.navigateTo({
      url: '/pages/goods/details/details?id='+id
    })
  }
  goGiveShow(ids,rule){
    Taro.navigateTo({
      url: '/pages/cart/rechargeGiveShoe/rechargeGiveShoe?ids='+ids+"&rule="+rule
    })
  }
  //去充值
  goRecharge(rule){
      Taro.navigateTo({
          url: '/pages/user/amount/amount?type=1&rule='+rule
      })
  }
  //领取优惠券
  getCoupon(id){
    Taro.request({
        url:api.couponGetPath,
        method:"POST",
        data:{couponId:id},
        header:{token:Taro.getStorageSync('token')}
    }).then((res)=>{
        if(res.data.success){
            Taro.showToast({
                title: '领取成功',
                icon: 'none',
                duration: 1500
            });
        }else{
            Taro.showToast({
                title: res.data.errorInfo,
                icon: 'none',
                duration: 1500
            });
        }
    })
}


  render () {
    const { posts,activityData } = this.state;
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
          <Text className="text">克克智慧零售商城</Text>
        </View>
        {/* <View className='discounts_box'>
          <Image className='image' mode='aspectFill' src={require('../../images/a.jpg')}></Image>
          <Image className='image' mode='aspectFill' src={require('../../images/a.jpg')}></Image>
        </View> */}
        <View className="coupon_1">
          <View className="coupon_area">
            <View className="swiper-container">
                <View className="swiper-wrapper">
                  {
                    this.state.couponList.map((item) =>{
                      return (
                        <View key={item.couponId} className="swiper-slide swiper-slide-visible swiper-slide-active">
                          <View className="coupon_bg">
                              <View className="coupon_12 flex coupon-picker discoloration">
                                  <View className="coupon-price">
                                    {
                                      item.type==1 && <View className="price-number price-number_3">
                                                        <Text className='text'>¥</Text>{item.value}
                                                      </View>
                                    }
                                    {
                                      item.type==2 && <View><Text className="coupon_discount">{item.value}</Text><Text className="coupon_fsize">折</Text></View>
                                    }
                                    <View className="couponline"></View>
                                    <View className="coupondec font24 text-line-1">满{item.reqAmt}使用</View>
                                  </View>
                                  <View className="coupon-operate" onClick={this.getCoupon.bind(this,item.couponId)}>
                                      <View className="font26 fontweight_300 index_btn" >领取</View>
                                  </View>
                                  <View className="border-indexcoupon"></View>
                              </View>
                          </View>
                        </View>
                      )
                    })
                  }
                </View>
            </View>
          </View>
        </View>

        {/* <View className='firstHot'>
          <Image className='image' mode='aspectFill' src={require('../../images/goods/2.jpg')}></Image>
        </View> */}
        {
          activityData.activityRules.map((item)=>{
            return (
              <View hidden={item.type!=4 && item.type!=5} className='pintuan' key={item.id}>
                <Text className='bigtitle'>{item.name}</Text>
                <View className='item_box'>
                  <Image className='image' mode='aspectFill' src={item.adPic}></Image>
                  <View className='item_right'>
                    <View className='txtCon'>
                      {/* <Text className='goodsTitle'>活动有效时间</Text> */}
                      <View className="yxTime_box">
                        <Text className='yxTime font24'>活动开始时间：{item.date1}</Text>
                        <Text className='yxTime font24'>活动结束时间：{item.date2}</Text>
                      </View>
                      {
                        item.type==4 && <View className="font24">充{JSON.parse(item.rule).save}送{JSON.parse(item.rule).give}</View>
                      }
                      {
                        item.type==5 && <View className="font24">充值陪数：{JSON.parse(item.rule).saveTimes}</View>
                      }
                      
                      <View className='price_box'>
                        {
                          item.type==4 && <Button onClick={this.goRecharge.bind(this,item.rule)}>去充值</Button>
                        }
                        {
                          item.type==5 && <Button onClick={this.goGiveShow.bind(this,item.goodsId,item.rule)}>去充值</Button>
                        }
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )
          })
        }
        {/*<View className='pintuan'>
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
