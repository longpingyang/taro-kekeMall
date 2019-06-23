import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View,Image } from '@tarojs/components'
// import './home.scss'
class DyTongji extends Component {
  config: Config = {
    navigationBarTitleText: '统计报表'
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
      <Image className='bg_box' mode='scaleToFill' src='http://www.kknx6.com/demo/opr/dy_tongji.jpg'></Image>
    </View>
    )
  }
}

export default DyTongji as ComponentClass
