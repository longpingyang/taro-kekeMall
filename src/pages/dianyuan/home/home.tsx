import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View,Image,Input,Text } from '@tarojs/components'
import { AtGrid } from "taro-ui"
import './home.scss'
import index from 'src/pages/index';
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
    // Taro.getLocation({
    //   type: 'gcj02', //返回可以用于wx.openLocation的经纬度
    //   success (res) {
    //     const latitude = res.latitude
    //     const longitude = res.longitude
    //     Taro.openLocation({
    //       latitude,
    //       longitude,
    //       scale: 18
    //     })
    //   }
    //  })


    
  }
  componentDidHide () { }

  goDy_qiandaoPage(){
    Taro.navigateTo({
      url: '/pages/dianyuan/qiandao/qiandao'
    })
  }
  goDy_msgPage(){
    Taro.navigateTo({
      url: '/pages/dianyuan/shopList/shopList'
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
  goDy_hylistPage(){
    Taro.navigateTo({
      url: '/pages/dianyuan/minehuiyuan/hylist/hylist'
    })
  }
  goPagefn(obj){
    if(obj.value=='签到'){
      this.goDy_qiandaoPage();
    }
    else if(obj.value=='店铺'){
      this.goDy_msgPage();
    }
    else if(obj.value=='会员'){
      this.goDy_hylistPage();
    }
  }
  render () {
    return (
      <View className='zitiShop_box'>
          <View className="mention-list-header flex bkg-white" >
              <View className="mention-list-header-search flex1 flex flex-v-center">
                  <View className="iconfont icon-sousuo"></View>
                  <Input className="flex1" type="text" placeholder="输入搜索门店内商品" value=""></Input>
              </View>
          </View>
          <View className="dy_home_con">
          <AtGrid onClick={this.goPagefn.bind(this)} hasBorder={false} columnNum={2} data={
            [
              {
                image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png',
                value: '签到'              
              },
              {
                image: 'https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png',
                value: '店铺'
              },
              {
                image: 'https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
                value: '消息'
              },
              {
                image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png',
                value: '开单'
              },
              {
                image: 'https://img14.360buyimg.com/jdphoto/s72x72_jfs/t17251/336/1311038817/3177/72595a07/5ac44618Na1db7b09.png',
                value: '会员'
              },
              {
                image: 'https://img30.360buyimg.com/jdphoto/s72x72_jfs/t5770/97/5184449507/2423/294d5f95/595c3b4dNbc6bc95d.png',
                value: '报表'
              }
            ]
          } />
          </View>
      </View>
      )

    //(
    // <View className='dy_box'>
    //     <Image className='bg_box' mode='scaleToFill' src='http://www.kknx6.com/demo/opr/dy_home.jpg'></Image>
    //     <View className='goPage_box'>
    //         <View className='search_box'></View>
    //         <View className='line'>
    //             <View className='item' onClick={this.goDy_qiandaoPage}></View>
    //             <View className='item' onClick={this.goDy_msgPage}></View>
    //         </View>
    //         <View className='line'>
    //             <View className='item' onClick={this.goDy_addHyPage}></View>
    //             <View className='item'></View>
    //         </View>
    //         <View className='line'>
    //             <View className='item' onClick={this.goDy_daifaPage}></View>
    //             <View className='item' onClick={this.goDy_orderPage}></View>
    //         </View>
    //         <View className='line'>
    //             <View className='item' onClick={this.goDy_huiyuanPage}></View>
    //             <View className='item' onClick={this.goDy_tongjiPage}></View>
    //         </View>
    //         <View className='line'>
    //             <View className='item'></View>
    //             <View className='item'></View>
    //         </View>
    //     </View>
    // </View>
    //)
  }
}

export default DyHome as ComponentClass
