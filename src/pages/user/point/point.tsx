import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'

const api = require('../../../config/api.js');

import './point.scss'
class Point extends Component {
    /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '积分明显'
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
  getScoreLogList(){
    
  }

 
  render () {
    return (
    <View className="integral-detail">
        <View className="integral-header">
            <View className="apoint-wrap">
                <View className="svg-wrap" style="background-image: linear-gradient(0deg, rgb(241, 45, 34) 1%, rgb(255, 255, 255) 100%);">
                    <View  className="iconfont icon-dicengtoumingdu theme-color"></View>
                    <View  className="iconfont icon-zhongjiancengtoumingdu theme-color"></View>
                    <View  className="iconfont icon-dingcengtoumingdu theme-color"></View>
                </View>
                <View className="header-point flex flex-center">
                    0
                </View>
                <a className="header-desc line-height1 color333 font26"></a>
            </View>
            <View className="wrap-integral-nav flex flex-v-center font32 border-bottom-1px">
                <View  className="integral-nav border-right-1px flex flex-center">
                    <View className="iconfont icon-jifenshangcheng theme-color"></View>积分商城
                </View>
                <View className="integral-nav flex flex-center">
                    <View className="iconfont icon-duihuanjilu theme-color"></View>兑换记录
                </View>
            </View>
            <View className="integral-title font30 color666">
                积分明细
                <View className="text-icon theme-bgc"></View>
            </View>
        </View>
        <View className="integral-record-wrap">
            <View></View>
        </View>
        <View className="ap-no-record color-9 font26">没有产生积分记录哦~</View>
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

export default Point as ComponentClass
