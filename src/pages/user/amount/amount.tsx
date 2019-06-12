import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'

const api = require('../../../config/api.js');

import './amount.scss'
class Amount extends Component {
    /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '余额明显'
  }
  static options = {
    addGlobalClass: true
  } 
  componentWillReceiveProps (nextProps) {
  }
  componentWillUnmount () {
  }
  componentWillMount(){    
  }
  componentDidShow () { }
  componentDidHide () { }
  state = {
    userInfo:{
      avatarUrl:'',
      nickName:''
    }
  }
 
  render () {
    return (
    <View className="integral-detail">
        <View className="integral-header">
            <View className="apoint-wrap">
                <View className="svg-wrap" style="background-image: linear-gradient(0deg, rgb(241, 45, 34) 1%, rgb(255, 255, 255) 100%);">
                    <View className="iconfont icon-dicengtoumingdu theme-color"></View>
                    <View className="iconfont icon-zhongjiancengtoumingdu theme-color"></View>
                    <View className="iconfont icon-dingcengtoumingdu theme-color"></View>
                </View>
                <View className="header-point flex flex-center">
                    <View className="font56">¥0.00</View>
                </View>
            </View>
            <View className="integral-title font30 color666">
                余额明细
                <View className="text-icon theme-bgc"></View>
            </View>
        </View>
        <View className="amount-record-wrap">
            <View></View>
            <View className="ap-no-record color-9 font26 mr-t-dis">没有产生余额记录哦~</View>
            <View className="amount-charge-fixed flex fixIphonex">
                <View className="amount--btn half theme-color theme-bdc font36">买单</View>
                <View className="amount--btn half color-white theme-bgc font36">充值</View>
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

export default Amount as ComponentClass
