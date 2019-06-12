import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button,Icon, Text, Image } from '@tarojs/components'

import { AtBadge, AtList, AtListItem,AtFloatLayout  } from "taro-ui"
import CouponsModal from '../goods/details/couponsModal/couponsModal'

import './user.scss'
import headImg from '../../images/mine02.jpg';
import centerImg from '../../images/mine01.jpg';

// #region 书写注意
// 
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion
class Index extends Component {

    /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
    config: Config = {
    navigationBarTitleText: '个人中心'
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }
  componentWillMount(){
    Taro.getStorage({key:'userInfo'}).then(rst => {   //从缓存中获取用户信息
      // this.props.setBasicInfo(rst.data)avatarUrl
      this.setState({
        userInfo: rst.data
      })
    })
  }
  state = {
    userInfo:{
      avatarUrl:'',
      nickName:''
    },
    couponsModalShow: false,
    isCard:2,
    orderNumArr:[0,2,0,0,0]
  }
  couponsMoreFn(){
    Taro.navigateTo({
      url: '/pages/user/couponList/couponList'
    })
  }
  componentDidShow () { Taro.showTabBar({})}

  componentDidHide () { }
  
  goOrderListPagefn(){
    Taro.navigateTo({
      url: '/pages/order/order'
    })
  }
  goAddressListPage(){
    Taro.navigateTo({
      url: '/pages/address/list/list'
    })
  }
  //余额明细
  goAmountPage(){
    Taro.navigateTo({
      url: '/pages/user/amount/amount'
    })
  }
  //积分明细
  goPointPage(){
    Taro.navigateTo({
      url: '/pages/user/point/point'
    })
  }

  //个人信息
  gogerenxinxiPage(){
    Taro.navigateTo({
      url: '/pages/user/userInfo/userInfo'
    })
  }

  tobegin = (userInfo) => {    
    if(userInfo.detail.userInfo){   //同意
      // this.props.setBasicInfo(userInfo.detail.userInfo) //将用户信息存入redux
      Taro.setStorage({key:'userInfo',data:userInfo.detail.userInfo}).then(rst => {  //将用户信息存入缓存中
          Taro.navigateBack()
      })
    } 
  };
  render () {    
    const {orderNumArr} =this.state;
    return (
      <View className="mine_box">
          {/* <Button className="btn" openType="getUserInfo" onGetUserInfo={this.tobegin} type="primary">
            登录
          </Button> */}
          {/* <View className='mine_head' style={{backgroundImage: `url(${headImg})`}}> */}
          <View className='mine_head'>
            <Image className='mine_head_bg' src={headImg}></Image>
            <View className='mine_head_top'>
              <Image className='user_img' src={this.state.userInfo.avatarUrl}></Image>
              <Text className='user_name'>{this.state.userInfo.nickName}</Text>
              <Image className='user_qrcode' src={require('../../images/icon/qrcode.png')}></Image>
              <View className='checkIn_btn'>
                <Image className='checkIn_Icon' src={require('../../images/icon/checkIn_Icon.png')}></Image>
                <Text className='checkIn_text'>签到</Text>
              </View>
            </View>
            <View className='mine_head_bottom'>
              <Text className='text'>普通会员</Text>
              <Text className='text'>距离下一成长值差100</Text>
            </View>
          </View>
          <View className='balance_box'>
            <View className='item' onClick={this.goAmountPage}><Text className='text'>0.00\n余额</Text></View>            
            <View className='item center' onClick={this.goPointPage}><Text className='text'>0\n积分</Text></View>            
            <View className='item'><Text className='text' onClick={this.couponsMoreFn}>3\n优惠券</Text></View>            
          </View>
          <View className='order_box'>
            <View className='title'>
              <Text className='text'>订单信息</Text>
              <Text className='more' onClick={this.goOrderListPagefn}>查看全部订单</Text>
            </View>
            <View className='con'>
              <View className='item'>
                <AtBadge value={orderNumArr[0]>0?orderNumArr[0]:''} maxValue={99}>
                  <Image className='icon' src={require('../../images/icon/daifukuan_icon.png')}></Image>
                </AtBadge>                
                <Text className='text'>待付款</Text>
              </View>
              <View className='item'>
                <AtBadge value={orderNumArr[1]>0?orderNumArr[1]:''} maxValue={99}>
                  <Image className='icon' src={require('../../images/icon/daifahuo_icon.png')}></Image>
                </AtBadge>  
                <Text className='text'>待发货</Text>
              </View>
              <View className='item'>
                <AtBadge value={orderNumArr[2]>0?orderNumArr[2]:''} maxValue={99}>
                  <Image className='icon' src={require('../../images/icon/daishouhuo_icon.png')}></Image>
                </AtBadge>  
                <Text className='text'>待收货</Text>
              </View>
              <View className='item'>
                <AtBadge value={orderNumArr[3]>0?orderNumArr[3]:''} maxValue={99}>
                  <Image className='icon' src={require('../../images/icon/daipingjia_icon.png')}></Image>
                </AtBadge>  
                <Text className='text'>待评价</Text>
              </View>
              <View className='item'>
                <AtBadge value={orderNumArr[4]>0?orderNumArr[4]:''} maxValue={99}>
                  <Image className='icon' src={require('../../images/icon/tuikuan_icon.png')}></Image>
                </AtBadge>  
                <Text className='text'>退款/维权</Text>
              </View>
            </View>
          </View>
          <Image className='mineImg' mode='aspectFill' src={require('../../images/mine01.jpg')}></Image>
          {/* <View className='mineImg' style={{backgroundImage: `url(${centerImg})`}}></View> */}
          <View className='menu_box'>
            <AtList>
              <AtListItem
                title='分销中心'
                arrow='right'
                thumb={require('../../images/icon/fenxiao_icon.png')}
              />
              <AtListItem
                title='积分商城'
                arrow='right'
                thumb={require('../../images/icon/shangcheng_icon.png')}
              />
              <AtListItem
                title='拼团'
                arrow='right'
                thumb={require('../../images/icon/pintuan_icon.png')}
              />
              <AtListItem
                title='砍价'
                arrow='right'
                thumb={require('../../images/icon/kanjia_icon.png')}
              />
              <AtListItem
                title='推荐'
                arrow='right'
                thumb={require('../../images/icon/tuijian_icon.png')}
              />
              <AtListItem
                title='我的接龙'
                arrow='right'
                thumb={require('../../images/icon/fenxiao_icon.png')}
              />
              <AtListItem
                title='我的预约'
                arrow='right'
                thumb={require('../../images/icon/yuyue_icon.png')}
              />
              <AtListItem
                title='专属导购'
                arrow='right'
                thumb={require('../../images/icon/daogou_icon.png')}
              />
              <AtListItem onClick={this.goAddressListPage}
                title='收货地址'
                arrow='right'
                thumb={require('../../images/icon/dizhi_icon.png')}
              />
              <AtListItem onClick={this.gogerenxinxiPage}
                title='个人信息'
                arrow='right'
                thumb={require('../../images/icon/gerenxinxi_icon.png')}
              />
            </AtList>
          </View>
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

export default Index as ComponentClass;
