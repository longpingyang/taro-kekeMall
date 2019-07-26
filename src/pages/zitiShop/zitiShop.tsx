import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View,Text, Input } from '@tarojs/components'

const api = require('../../config/api.js');

class ZitiShop extends Component {
  config: Config = {
    navigationBarTitleText: '自提门店'
  }
  static options = {
    addGlobalClass: true
  } 
  state={
    addressList:[],
    listlength:0,
    iscreateOrder: true
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
    // })  shopListPath
    Taro.request({
      url:api.shopListPath,
      method:'POST',
      header:{
        token:Taro.getStorageSync('token')
      }
    }).then((res) =>{
      if(res.data.success){ 
        // console.log(res.data.data);
        this.setState({
          addressList:res.data.data
        })
      } 
    })





  }
  componentDidHide () { }

  selzitiAddressFn(id){
    if(this.state.iscreateOrder){
        if(this.$router.params.orderType){
          Taro.navigateTo({
            url: '/pages/cart/ordercreate/ordercreate?addId='+id+"&isSelfGet=1&orderType="+this.$router.params.orderType
          })
        }else{
          Taro.navigateTo({
            url: '/pages/cart/ordercreate/ordercreate?addId='+id+"&isSelfGet=1"
          })
        }
      }
  }

  render () {
    return (
    <View className='zitiShop_box'>
        <View className="mention-list-header flex bkg-white" >
            {/* <View>
                <View className="mention-list-header-site flex flex-v-center">
                    <View className="iconfont icon-zitidizhi"></View>
                    <View className="flex1 color-3 text-line1 font24">上海市</View><View></View>
                </View>
            </View> */}
            <View className="mention-list-header-search flex1 flex flex-v-center">
                <View className="iconfont icon-sousuo"></View>
                <Input className="flex1" type="text" placeholder="输入搜索门店名称" value=""></Input>
            </View>
        </View>
        <View className="mention-list-container">
            {
              this.state.addressList.map((item) =>{
                return (
                  <View className="mention-list-item bkg-white" onClick={this.selzitiAddressFn.bind(this,'1')}>
                    <View className="mention-list-item-title flex felx-v-center">
                        <Text className="flex1 text-line1">{item['name']}</Text>
                        <Text className="mention-list-item-choose theme-color font24">[当前]</Text>
                        {/* <Text>查看地图</Text> */}
                    </View>
                    <View className="mention-list-item-address">{item['address']}
                    </View>
                    <View className="mention-list-item-business flex flex-v-center border-top-1px">
                        <Text className="flex1">营业时间: (周一)10:00-22:00</Text>
                        <Text className="iconfont icon-dianhua"></Text>
                    </View>
                  </View>
                )
              })
            }
            <View className="no-more">没有更多了~</View>
        </View>
    </View>
    )
  }
}

export default ZitiShop as ComponentClass
