import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View,Image } from '@tarojs/components'
// import './home.scss'
class DyQianDao extends Component {
  config: Config = {
    navigationBarTitleText: '签到'
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
  }
  componentDidHide () { }
  render () {
    return (
      <View className='dy_box'>
        <Image className='bg_box' mode='scaleToFill' src='http://www.kknx6.com/demo/opr/dy_qiandao.jpg'></Image>
      </View>
    )
  }
}

export default DyQianDao as ComponentClass
