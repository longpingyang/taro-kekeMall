import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Text, Image } from '@tarojs/components'

const api = require('../../config/api.js');

import './card.scss'
class Card extends Component {
    /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
    config: Config = {
    navigationBarTitleText: '个人信息'
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () {
  }
  componentWillMount(){
    // Taro.getStorage({key:'userInfo'}).then(rst => {   //从缓存中获取用户信息
    //   // this.props.setBasicInfo(rst.data)avatarUrl
    //   this.setState({
    //     userInfo: rst.data
    //   })
    // })
    Taro.login({
      success:function(res){
        Taro.request({
          url:'https://api.weixin.qq.com/sns/jscode2session?appid=wxa4028bf5e14b501a&secret=cc66408d416e1152f7c6ee16abf25860&js_code=' + res.code,
          header:{
            'content-type':'json'
          },
          success:function(data){
            Taro.setStorage({key:'wxOpenid',data:data.data.openid})
            Taro.getStorage({key:'wxOpenid'})
            Taro.request({
              url:api.memberCheckPath,
              data:{
                wxOpenid:data.data.openid
                // wxOpenid:'123456789'
              },
              method: 'POST',
              success:function(obj){
                console.log(obj);
                if(obj.success){
                  this.setState({
                    isCard:obj.data.verifyResult //1新用户;2未登录;3已登录
                  })
                }
              }
            })
            
          }
        })

      }
    })
  }

  componentDidShow () { Taro.showTabBar({})}

  componentDidHide () { }

  state = {
    userInfo:{
      avatarUrl:'',
      nickName:''
    },
    isCard:2
  }

  /**领取会员卡 */
  goinputTelFn = () => {
    Taro.navigateTo({
      url: '/pages/card/input_tel/input_tel'
    })
    // this.setState({
    //   isCard:2
    // })
  }
  /**会员卡详情 */
  goCardDetailsPageFn = () =>{
    // console.log('会员卡详情');
    Taro.navigateTo({
      url: '/pages/card/details/cardDetails'
    })
  }
  render () {
    console.log(this.state.isCard);
    return (
      <View>
        <View className='card_info_box'>
          <View className='box'>
            <View className='image_box'>
              <Image src={this.state.userInfo.avatarUrl}></Image>
            </View>
            <View className='card_text'>
              <Text>{this.state.userInfo.nickName}\n会员卡 | 白银会员</Text>
            </View>
            <View className='cardno_box'>
              <Text>卡号：456464546</Text>
            </View>
          </View>
        </View>
        <View className='get_card' hidden={this.state.isCard==1}>
          <Button className='btn' onClick={this.goinputTelFn}>领取会员卡</Button>
        </View>
        <View className='user_entrance'  hidden={this.state.isCard==3}>
          <View>
            <Text>用户中心</Text>
          </View>
          <View className='user' onClick={this.goCardDetailsPageFn}>
            <Text>会员卡详情</Text>
          </View>
          <View className='user'>
            <Text>积分商城</Text>
          </View>
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

export default Card as ComponentClass
