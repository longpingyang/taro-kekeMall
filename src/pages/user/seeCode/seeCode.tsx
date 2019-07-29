import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View,Image } from '@tarojs/components'

const api = require('../../../config/api.js');
import './seeCode.scss'
class SeeCode extends Component {
  config: Config = {
    navigationBarTitleText: '查看验证码'
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
  componentDidShow () { 
    // this.setState({
    //   userInfo: Taro.getStorageSync("userMember")
    // }) 

    Taro.request({
      url:api.memberZccodePath,
      method:"POST",
      header:{
        token:Taro.getStorageSync('token')
      } 
    }).then(res =>{
      console.log(res);
      if(res.data.success){
        
      }
    })
  }
  componentDidHide () { }
  render () {
    return (
        <View className="integral-detail seeCode_box">
            <View className="integral-header">
                <View className="apoint-wrap">
                    <View className="svg-wrap" style="background-image: linear-gradient(0deg, rgb(241, 45, 34) 1%, rgb(255, 255, 255) 100%);">
                        <View  className="iconfont icon-dicengtoumingdu theme-color"></View>
                        <View  className="iconfont icon-zhongjiancengtoumingdu theme-color"></View>
                        <View  className="iconfont icon-dingcengtoumingdu theme-color"></View>
                    </View>
                    <View className="header-point flex flex-center">
                    JHDS03
                    </View>
                    <a className="header-desc line-height1 color333 font26"></a>
                </View>
            </View>        
        </View>
    )
  }
}

export default SeeCode as ComponentClass
