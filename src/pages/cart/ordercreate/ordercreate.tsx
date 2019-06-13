import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Input, Text,Image } from '@tarojs/components'
import goodsImg from '../../../images/goods/1.jpg';

import InvocePage from '../invocePage/invocePage'
const api = require('../../../config/api.js');
import './ordercreate.scss'

class Ordercreate extends Component {
    config: Config = {
        navigationBarTitleText: '确认订单'
    }
    goEditAddressPage(){
        Taro.navigateTo({
            url: '/pages/address/edit/edit'
        })
    }
    goListAddressPage(){
        Taro.navigateTo({
            url: '/pages/address/list/list?checkedId='+this.state.memberAddressId
        })
    }
    state={
        isShowInvocePage:true,
        goodsList:[],
        amount:0,
        couponList:[],//礼券列表
        coupon:0,//优惠金额
        freight:0,//运费
        payScore:"",
        payBanlance:"",
        payMoney:"",
        remark:"",
        addressObj:{},
        addressListlength:0,
        memberAddressId:""
    }

    getAddressList(){
        Taro.request({
          url:api.memberDeliveryListPath,
          method:"POST",
          header:{
            token:Taro.getStorageSync('token')
          }
        }).then((res) =>{
          if(res.data.success){
            let isDefault=true;
            if(this.$router.params.addId){
                res.data.data.forEach(element => {
                    if(element['deliveryId']==this.$router.params.addId){
                        isDefault=false
                        this.setState({
                            addressObj:element,
                            addressListlength:res.data.data.length,
                            memberAddressId:element.deliveryId
                        })
                    }
                });  
            }else{
                res.data.data.forEach(element => {
                    if(element['isDefault']==1){
                        isDefault=false
                        this.setState({
                            addressObj:element,
                            addressListlength:res.data.data.length,
                            memberAddressId:element.deliveryId
                        })
                    }
                });
            }
            
            if(isDefault){
                this.setState({
                    addressObj:res.data.data[0],
                    addressListlength:res.data.data.length,
                    memberAddressId:res.data.data[0].deliveryId
                })
            }
          }
        })
      }
    showInvocePage(){
        this.setState({
            isShowInvocePage:false
        })
    }
    componentDidMount(){
        this.getAddressList();
        this.setState({
            goodsList:Taro.getStorageSync('orderCreate').goodsList,
            amount:Taro.getStorageSync('orderCreate').amount
        })
    }
    //提交订单
    subOrderFn(){
        Taro.showLoading({
            title: '处理中',
        })
        Taro.request({
            url:api.orderCreatePath,
            method:"POST",
            data:{
                "activityId": "1",
                "couponList": [],
                "goodsList": this.state.goodsList,
                "memberAddressId": this.state.memberAddressId,
                "payBanlance": 0,
                "payMoney": this.state.amount-this.state.coupon+this.state.freight,
                "payScore": 0,
                "remark": this.state.remark
            },
            header:{
                token:Taro.getStorageSync('token')
            }
        }).then((res)=>{
            Taro.hideLoading();
            if(res.data.success){                
                Taro.showToast({
                    title: '提交成功',
                    icon: 'none',
                    duration: 1500
                });
                Taro.navigateTo({
                    url: '/pages/order/order'
                })
            }
        })
    }

    render(){
        const {goodsList,amount,addressObj,addressListlength} = this.state;
        return (
            <View className="page-container order-create_box">
                <View className="wrap-delivery-type flex flex-v-center">
                    <View className="deli-title flex0">配送方式</View>
                    <View className="deli-type-list flex1 flex">
                        <View className="deli-item  border-around theme-color theme-bdc  text-line1">商家配送</View>
                        <View className="deli-item  text-line1">到店自提</View>
                    </View>
                </View>
                <View className="wrap-address">
                    <View className="arrow-container" hidden={addressListlength>0}>
                        <View className="addr-cont border-bottom-1px theme-color">
                            <View className="arrow-wrap flex-v-center ">
                                <View className="flex">
                                    <View className="wrap-locat flex0">
                                        <View className="iconfont icon-dizhi2 noaddress-icon"></View>
                                    </View>
                                    <View className="flex1">
                                        <View onClick={this.goEditAddressPage} className="wrap-addr-cont noaddress" data-elementid="address">请先添加收货地址</View>
                                    </View>
                                </View>
                                <View className="iconfont icon-newarrow theme-color"></View>
                            </View>
                        </View>
                    </View>
                    <View className="wrap-addr-cont" hidden={addressListlength==0}>
                        <View className="arrow-container">
                            <View className="addr-cont border-bottom-1px">
                                <View className="arrow-wrap flex-v-center ">
                                    <View className="wrap-locat flex0">
                                        <View className="iconfont icon-dizhi2"></View>
                                    </View>
                                    <View onClick={this.goListAddressPage} className="flex1">
                                        <View className="wrap-addr-cont ">
                                            <View className="wrap-addr-detail flex flex-between">
                                                <Text className="">收 货 人 ：{addressObj['truename']}</Text>
                                                <Text>{addressObj['phone']}</Text>
                                            </View>
                                            <View className="wrap-addr-detail">
                                                收货地址：{addressObj['address']}
                                            </View>
                                        </View>
                                    </View><View className="iconfont icon-newarrow undefined"></View>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View className="custom-form pr-32">
                        <View className="arrow-wrap flex-v-center no-icon">
                            <View className="flex0 group-wrap-tip">
                                <Text className="group-tip text-line1">备注</Text>
                            </View>
                            <View className="group-wrap-input flex1">
                                <Input type="text" value={this.state.remark}></Input>
                            </View>
                        </View>
                    </View>
                </View>
                <View className="wrap-goods section-item">
                    <View className="wrap-goods-title border-bottom-1px">
                        <View className="iconfont icon-gouwuqingdan"></View>购物清单
                    </View>
                    <View className="wrap-goods-cont">
                        <View className="goods-list">
                                {
                                    goodsList.map((item) =>{
                                        return (
                                            <View key={item.cartId} className="wrap-good-item">
                                                <View className="goods-item">
                                                    <View className="good-img">                                            
                                                        <Image className='imgCover' mode='aspectFill' src={item.mainPic}></Image>
                                                    </View>
                                                    <View className="good-info flex1">
                                                        <View className="flex flex-between">
                                                            <View className="order-good-name text-line2 flex1">
                                                                {item.goodsName}
                                                            </View>
                                                            <View className="flex0 pl-32">¥{item.price}</View>
                                                        </View>
                                                        <View className="good-ext flex flex-between pt-16">
                                                            <Text className="flex1 c-999"><Text className="font11">{item.colorName}/{item.sizeName}</Text></Text>
                                                            <Text className="flex0 pl-32 font12 c-64">x{item.count}</Text>
                                                        </View>
                                                        <View className="good-tags"><Text className="good-tag">会员</Text></View>
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                                {/* <View className="wrap-good-item">
                                    <View className="goods-item">
                                        <View className="good-img">
                                            <Image className='imgCover' mode='aspectFill' src={require('../../../images/goods/1.jpg')}></Image>
                                        </View>
                                        <View className="good-info flex1">
                                            <View className="flex flex-between">
                                                <View className="order-good-name text-line2 flex1">
                                                    反季促销毛衫（演示，不发货）
                                                </View>
                                                <View className="flex0 pl-32">¥80</View>
                                            </View>
                                            <View className="good-ext flex flex-between pt-16">
                                                <Text className="flex1 c-999">
                                                    <Text className=" font11">黑色/M</Text>
                                                </Text>
                                                <Text className="flex0 pl-32 font12 c-64">x1</Text>
                                            </View>
                                            <View className="good-tags"><Text className="good-tag">会员</Text></View>
                                        </View>
                                    </View>
                                </View> */}
                            </View>
                        <View className="wrap-message border-bottom-1px">
                            <Input type="text" className="order-message" placeholder="给卖家留言：(50字以内)" value=""></Input>
                        </View>
                        <View className="wrap-goods-total flex flex-end">
                            <Text className="goods-total-num">共{goodsList.length}件商品</Text>
                            <Text>合计:</Text>
                            <Text className="goods-tataol-price theme-color">¥{amount}</Text>
                        </View>
                    </View>
                </View>
                <View className="wrap-pormo section-item">
                    <View className="arrow-item flex flex-between">
                        <Text>优惠券/码</Text>
                        <Text>已优惠{this.state.coupon}元</Text>
                    </View>
                    <View className=" wrap-radio-input border-bottom-1px invoice-btn-wrap">
                        <View onClick={this.showInvocePage} className="wrap-radio flex-between flex">
                            <Text className="flex0">发票</Text>
                            <View className="flex flex1 flex-end flex-v-center"><View className="radio"></View>
                            </View>
                        </View>
                        {/* <View className="wrap-switch-input wrap-paytype section-item">
                            <View className="arrow-item flex flex-between">
                                <Text>开票信息</Text>
                                <Text>请填写开票信息</Text>
                            </View>
                        </View> */}
                    </View>
                </View>
                <View className="wrap-paytype section-item">
                    <View className="arrow-item flex flex-between arrow-item1">
                        <Text>支付方式</Text>
                        <Text>货到付款</Text>
                    </View>
                </View>
                <View className="wrap-payinfo section-item">
                    <View className="flex flex-between">
                        <View>商品金额
                            <Text className="money-tip iconfont icon-gandanhao font24">
                                <Text className="money-msg-tip money-msg">价格说明：因价格更新导致价格变动、营销互斥规则等原因，商品售价可能与前置页面不同，以本结算页为准</Text>
                            </Text>
                        </View>
                        <Text>¥{this.state.amount-this.state.coupon}</Text>
                    </View>
                    <View className="flex flex-between">
                        <Text>优惠抵扣</Text><Text>-¥{this.state.coupon}</Text>
                    </View>
                    <View className="flex flex-between">
                        <Text>运费</Text><Text>¥{this.state.freight}</Text>
                    </View>
                    <View className="flex flex-between">
                        <Text>实际支付</Text><Text>¥{this.state.amount-this.state.coupon+this.state.freight}</Text>
                    </View>
                </View>
                <View className="wrap-footer flex flex-between border-top-1px fixIphonex">
                    <View className="pay-info"> 实付：<Text className="theme-color">¥{this.state.amount-this.state.coupon+this.state.freight}</Text>
                    </View>
                    {/* disable */}
                    <View className="sub-btn theme-bgc" onClick={this.subOrderFn.bind(this)}>提交订单</View>
                </View>
                <View className='InvocePage_box' hidden={this.state.isShowInvocePage}>
                    <InvocePage></InvocePage>
                </View>
                


            </View>
        )
    }
}
export default Ordercreate as ComponentClass