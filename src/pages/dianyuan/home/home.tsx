import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View,Image } from '@tarojs/components'
import './home.scss'
class DyHome extends Component {
  config: Config = {
    navigationBarTitleText: '首页'
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

  goDy_qiandaoPage(){
    Taro.navigateTo({
      url: '/pages/dianyuan/qiandao/qiandao'
    })
  }
  goDy_msgPage(){
    Taro.navigateTo({
      url: '/pages/dianyuan/msg/msg'
    })
  }
  goDy_addHyPage(){
    Taro.navigateTo({
      url: '/pages/dianyuan/addHy/addHy'
    })
  }
  goDy_daifaPage(){
    Taro.navigateTo({
      url: '/pages/dianyuan/daifa/daifa'
    })
  }
  goDy_orderPage(){
    Taro.navigateTo({
      url: '/pages/dianyuan/order/order'
    })
  }
  goDy_huiyuanPage(){
    Taro.navigateTo({
      url: '/pages/dianyuan/minehuiyuan/minehuiyuan'
    })
  }
  goDy_tongjiPage(){
    Taro.navigateTo({
      url: '/pages/dianyuan/tongji/tongji'
    })
  }
  render () {
    return (
    <View className='dy_box'>
        <Image className='bg_box' mode='scaleToFill' src='http://www.kknx6.com/demo/opr/dy_home.jpg'></Image>
        <View className='goPage_box'>
            <View className='search_box'></View>
            <View className='line'>
                <View className='item' onClick={this.goDy_qiandaoPage}></View>
                <View className='item' onClick={this.goDy_msgPage}></View>
            </View>
            <View className='line'>
                <View className='item' onClick={this.goDy_addHyPage}></View>
                <View className='item'></View>
            </View>
            <View className='line'>
                <View className='item' onClick={this.goDy_daifaPage}></View>
                <View className='item' onClick={this.goDy_orderPage}></View>
            </View>
            <View className='line'>
                <View className='item' onClick={this.goDy_huiyuanPage}></View>
                <View className='item' onClick={this.goDy_tongjiPage}></View>
            </View>
            <View className='line'>
                <View className='item'></View>
                <View className='item'></View>
            </View>
        </View>
    </View>
    )
  }
}

export default DyHome as ComponentClass
