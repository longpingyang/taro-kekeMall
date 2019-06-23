import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View ,Image} from '@tarojs/components'
// import './home.scss'
class DyMsg extends Component {
  config: Config = {
    navigationBarTitleText: '我的会员'
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


  goDy_hylistPage(){
    Taro.navigateTo({
      url: '/pages/dianyuan/minehuiyuan/hylist/hylist'
    })
  }
  goDy_hybqPage(){
    Taro.navigateTo({
      url: '/pages/dianyuan/minehuiyuan/hybq/hybq'
    })
  }
  goDy_hysrPage(){
    Taro.navigateTo({
      url: '/pages/dianyuan/minehuiyuan/hysr/hysr'
    })
  }
  goDy_hyfxPage(){
    Taro.navigateTo({
      url: '/pages/dianyuan/minehuiyuan/hyfx/hyfx'
    })
  }

  render () {
    return (
    <View className='dy_box'>
      <Image className='bg_box' mode='scaleToFill' src='http://www.kknx6.com/demo/opr/dy_huiyuan.jpg'></Image>
      <View className='goPage_box goHyPage_box'>

          <View className='line' onClick={this.goDy_hylistPage}></View>
          <View className='line' onClick={this.goDy_hybqPage}></View>
          <View className='line' onClick={this.goDy_hysrPage}></View>
          <View className='line' onClick={this.goDy_hyfxPage}></View>
      </View>
    </View>
    )
  }
}

export default DyMsg as ComponentClass
