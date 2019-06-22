import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button,Icon, Text, Image } from '@tarojs/components'
const api = require('../../../config/api.js');
import './couponList.scss'

class Index extends Component {
    config: Config = {
    navigationBarTitleText: '我的优惠券'
  }

  componentWillReceiveProps (nextProps) {

  }

  componentWillUnmount () { }
  componentWillMount(){
    Taro.getStorage({key:'userInfo'}).then(rst => {   //从缓存中获取用户信息
      this.setState({
        userInfo: rst.data
      })
    })
  }
  state = {
    userInfo:{
      avatarUrl:'',
      nickName:''
    },
    currentNav:0,
    dataList:[]
  }
  couponsMoreFn(){
    this.setState({
      couponsModalShow: true
    })
  }

  getcouponList(type){
    Taro.request({
        url:api.couponListPath,
        method:"POST",
        data:{
            "actId": "",
            "shopId": "1",
            "status": type,
            "type": [1,2,3,4,5,6]
        },
        header:{
            token:Taro.getStorageSync('token')
        }
    }).then((res) =>{
        if(res.data.data){
            this.setState({
                dataList:res.data.data,
                currentNav:type
            })
        }else{
            if(res.data.errorCode=='E401'){
              Taro.setStorageSync('userMember',null);
              Taro.navigateTo({
                url: '/pages/user/login/login'
              })
            }
          }
    })
  }
  componentDidShow () { 
      this.getcouponList(this.state.currentNav)
  }

  componentDidHide () { }
  render () {    
      const {currentNav,dataList} = this.state;
    return (
        <View className="coupon-list-main fixIphonex">
        <View className="coupon-type-tab flex font28 color-3 bkg-white">
            <View className="flex1 position-rlt flex-v-center" onClick={this.getcouponList.bind(this,0)}>
                <View className={(currentNav==0?'theme-color':'')}>未使用</View>
                <View className={"theme-bgc "+(currentNav==0?'on-tab ':'')}></View>
            </View>
            <View className="flex1 position-rlt flex-v-center" onClick={this.getcouponList.bind(this,1)}>
                <View className={(currentNav==1?'theme-color':'')}>已使用</View>
                <View className={"theme-bgc "+(currentNav==1?'on-tab ':'')}></View>
            </View>
            <View className="flex1 position-rlt flex-v-center" onClick={this.getcouponList.bind(this,2)}>
                <View className={(currentNav==2?'theme-color':'')}>已过期</View>
                <View className={"theme-bgc "+(currentNav==2?'on-tab ':'')}></View>
               
            </View>
        </View>
        <View className="coupon-list">
            {
                dataList.map((item) =>{
                    return (
                    <View key={item.id} className={"coupon flex discoloration "+(currentNav==1?"disabled used":"")} >
                        <View className="coupon-price flex theme-color flex-col">
                            <View className={"price-number "+(item.template.type==1?"price-number_3":"")}>
                                {item.template.type==1 && <View className="unit-name_3">¥</View>}                                        
                                <View>{item.template.value}</View>
                                {item.template.type==2 && <View className="coupon_fsize">折</View>}
                            </View>
                            <View className="coupon-full">满{item.template.reqAmt}元</View>
                        </View>
                        <View className="coupon-content flex1 flex flex-col">
                            <View className="coupon-dec coupon-text-line1">{item.template.type==1?"超值满减优惠券":"超值折扣优惠券"}</View>
                            <View className="coupon-date ">{item.template.date1} - {item.template.date2}</View>
                            <View className="color-white font22 coupon-use-scence">
                                <View className="flex flex-v-center">{item.template.isGoods==1?"部分商品可用":"全部商品可用"}</View>
                            </View>
                        </View>
                        <View className="coupon-usebtn flex flex-col">
                            {
                                currentNav==0 && <View className="coupon-usetext">去使用</View>
                            }
                            {
                                currentNav==1 && <View className="coupon-usetext">已使用</View>
                            }
                            {
                                currentNav==2 && <View className="coupon-usetext">已过期</View>
                            }
                            <View className="coupon-expire"><View></View></View>
                        </View>
                        <View className="border-coupon"></View>
                    </View>
                    )
                })
                
            }
            
            {/* <View className="coupon flex discoloration" style="background-color: rgba(241, 45, 34, 0.6);">
                <View className="coupon-price flex theme-color flex-col">
                    <View className="price-number price-number_3">
                        <View className="unit-name_3">¥</View>
                        <View>0.5</View>
                    </View>
                    <View className="coupon-full">满2元</View>
                </View>
                <View className="coupon-content flex1 flex flex-col">
                    <View className="coupon-dec coupon-text-line1">超值满减优惠券</View>
                    <View className="coupon-date">2019.05.13 00:00-2019.08.20 23:59</View>
                    <View className="color-white font22 coupon-use-scence">
                        <View className="flex flex-v-center">全部商品可用 | 全部门店适用</View>
                    </View>
                </View>
                <View className="coupon-usebtn flex flex-col" style="background-color: rgb(241, 45, 34);">
                    <View className="coupon-usetext">去使用</View>
                    <View className="coupon-expire"><View></View></View>
                </View>
                <View className="border-coupon"></View>
            </View>
            <View className="coupon flex discoloration" style="background-color: rgba(241, 45, 34, 0.6);">
                <View className="coupon-price flex theme-color flex-col">
                    <View className="price-number">
                        <View>8</View>
                        <View className="coupon_fsize">折</View>
                    </View>
                    <View className="coupon-full">满5元</View>
                </View>
                <View className="coupon-content flex1 flex flex-col">
                    <View className="coupon-dec coupon-text-line1">超值折扣券</View>
                    <View className="coupon-date ">
                        2019.05.18 00:00-2019.08.25 23:59
                    </View>
                    <View className="color-white font22 coupon-use-scence">
                        <View className="flex flex-v-center">全部商品可用 | 全部门店适用</View>
                    </View>
                </View>
                <View className="coupon-usebtn flex flex-col" style="background-color: rgb(241, 45, 34);">
                    <View className="coupon-usetext">去使用</View>
                    <View className="coupon-expire"><View></View></View>
                </View>
                <View className="border-coupon"></View>
            </View>
            <View className="coupon flex discoloration" style="background-color: rgba(241, 45, 34, 0.6);">
                <View className="coupon-price flex theme-color flex-col">
                    <View className="price-number price-number_3">
                        <View className="unit-name_3">¥</View>
                        <View>0.5</View>
                    </View>
                    <View className="coupon-full">满2元</View>
                </View>
                <View className="coupon-content flex1 flex flex-col">
                    <View className="coupon-dec coupon-text-line1">超值满减优惠券</View>
                    <View className="coupon-date">2019.05.25 00:00-2019.09.01 23:59</View>
                    <View className="color-white font22 coupon-use-scence">
                        <View className="flex flex-v-center">全部商品可用 | 全部门店适用</View>
                    </View>
                </View>
                <View className="coupon-usebtn flex flex-col" style="background-color: rgb(241, 45, 34);">
                    <View className="coupon-usetext">去使用</View>
                    <View className="coupon-expire"><View></View></View>
                </View>
                <View className="border-coupon"></View>
            </View>
            <View className="coupon flex discoloration" style="background-color: rgba(241, 45, 34, 0.6);">
                <View className="coupon-price flex theme-color flex-col">
                    <View className="price-number">
                        <View>8</View>
                        <View className="coupon_fsize">折</View>
                    </View>
                    <View className="coupon-full">满5元</View>
                </View>
                <View className="coupon-content flex1 flex flex-col">
                    <View className="coupon-dec coupon-text-line1">超值折扣券</View>
                    <View className="coupon-date ">
                        2019.05.27 00:00-2019.09.03 23:59
                    </View>
                    <View className="color-white font22 coupon-use-scence"><View className="flex flex-v-center">
                            全部商品可用 | 全部门店适用</View></View>
                </View>
                <View className="coupon-usebtn flex flex-col" style="background-color: rgb(241, 45, 34);">
                    <View className="coupon-usetext">去使用</View>
                    <View className="coupon-expire"><View></View></View>
                </View>
                <View className="border-coupon"></View>
            </View>
            <View className="coupon flex discoloration" style="background-color: rgba(241, 45, 34, 0.6);">
                <View className="coupon-price flex theme-color flex-col">
                    <View className="price-number price-number_3"><View className="unit-name_3">¥</View>
                        <View>5</View>
                    </View>
                    <View className="coupon-full">满100元</View>
                </View>
                <View className="coupon-content flex1 flex flex-col">
                    <View className="coupon-dec coupon-text-line1">满100减5元</View>
                    <View className="coupon-date">2019.03.17 00:00 - 2019.11.05 23:59</View>
                    <View className="color-white font22 coupon-use-scence">
                        <View className="flex flex-v-center">全部商品可用 | 全部门店适用</View>
                    </View>
                </View>
                <View className="coupon-usebtn flex flex-col" style="background-color: rgb(241, 45, 34);">
                    <View className="coupon-usetext">去使用</View>
                    <View className="coupon-expire"><View></View></View>
                </View>
                <View className="border-coupon"></View>
            </View> */}
        </View>
        <View className="loadMore">没有更多了</View>
        {/* <View className=" fixed-btn-group iphoneXMB">
            <View className="btn btn-hide"><View className="iconfont icon-fixed-top color-6"></View></View>
        </View> */}
    </View>
    )
  }
}

export default Index as ComponentClass;
