import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View,Image } from '@tarojs/components'
// import './home.scss'
class DyOrder extends Component {
  config: Config = {
    navigationBarTitleText: '订单查询'
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
      <Image className='bg_box' mode='scaleToFill' src='http://www.kknx6.com/demo/opr/dy_order.jpg'></Image>
    </View>
    )
  }
}

export default DyOrder as ComponentClass
