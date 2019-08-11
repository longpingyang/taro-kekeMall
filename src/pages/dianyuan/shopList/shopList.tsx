import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View,Image,Text } from '@tarojs/components'
import './shopList.scss'
const api = require('../../../config/api.js');
class DyShopList extends Component {
  config: Config = {
    navigationBarTitleText: '店铺列表'
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
    Taro.request({
        url:api.shopListPath,
        method:'POST',
      }).then((res) =>{
        if(res.data.success){ 
          // console.log(res.data.data);
          this.setState({
            addressList:res.data.data
          })
        } 
      })
  }
  //调整地图位置
  setLocationFn(shopId){
    Taro.chooseLocation({
        success:  (res)=>{
          Taro.request({
            url:api.opShopSetlocalPath+'?posLat='+res.latitude+'&posLng='+res.longitude+'&shopId='+shopId+'&token='+Taro.getStorageSync('dy_token'),
            method:'POST',
          }).then(res =>{
            if(res.data.success){
              Taro.showToast({
                title: res.data.errorInfo,
                icon: 'none',
                duration: 1500
              });
            }else{
              Taro.showToast({
                title: res.data.errorInfo,
                icon: 'none',
                duration: 1500
              });
            }
          })
        },
        fail: ()=> {
        // fail
        },
        complete: ()=> {
        // complete
        }
    })
  }
  componentDidHide () { }
  render () {
    return (
      <View className='zitiShop_box'>
        <View className="mention-list-container">
            {
              this.state.addressList.map((item,index) =>{
                return (
                  <View className="mention-list-item bkg-white" key={index}  onClick={this.setLocationFn.bind(this,item['shopId'])}>
                    <View className="mention-list-item-title flex felx-v-center">
                        <Text className="flex1 text-line1">{item['name']}</Text>
                        {/* <Text className="mention-list-item-choose theme-color font24">[当前]</Text> */}
                        <Text className="iconfont icon-dizhi2"><Text className="font26">查看地图</Text></Text>
                    </View>
                    <View className="mention-list-item-address">{item['address']}
                    </View>
                    <View className="mention-list-item-business flex flex-v-center border-top-1px">
                        <Text className="flex1">营业时间: (周一)10:00-22:00</Text>
                        {/* <Text className="iconfont icon-dizhi2"></Text> */}
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

export default DyShopList as ComponentClass
