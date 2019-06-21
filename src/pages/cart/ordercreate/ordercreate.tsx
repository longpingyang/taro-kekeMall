import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Input, Text,Image } from '@tarojs/components'
import goodsImg from '../../../images/goods/1.jpg';

import { AtFloatLayout } from "taro-ui"
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
        if(this.$router.params.orderType){
            Taro.navigateTo({
                url: '/pages/address/list/list?checkedId='+this.state.memberAddressId+"&orderType="+this.$router.params.orderType
            })
        }else{
            Taro.navigateTo({
                url: '/pages/address/list/list?checkedId='+this.state.memberAddressId
            })
        }
    }
    state={
        isShowInvocePage:true,
        couponsModalShow: false,
        goodsList:[],
        amount:0,
        saveTimes:0,
        couponList:[],//礼券列表
        coupon:0,//优惠金额
        cxYhMoney:0,//促销优惠金额
        cxYhMoneyId:"",
        cxYhMoneyType:"",
        couponId:'',
        freight:0,//运费
        payScore:"",
        payBanlance:"",
        payMoney:"",
        remark:"",
        addressObj:{},
        addressListlength:0,
        memberAddressId:"",
        yHmoneyArr:{},
        orderType:0//0:普通订单 5:充值送鞋订单
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
    showInvocePage(){
        this.setState({
            isShowInvocePage:false
        })
    }
    componentDidMount(){
        this.getAddressList();
        if(this.$router.params.orderType==5){//充值送鞋
            this.setState({
                goodsList:Taro.getStorageSync('orderCreate').goodsList,
                amount:Taro.getStorageSync('orderCreate').amount,
                saveTimes:Taro.getStorageSync('orderCreate').saveTimes,
                orderType: 5
            })
        }else{
            this.setState({
                goodsList:Taro.getStorageSync('orderCreate').goodsList,
                amount:Taro.getStorageSync('orderCreate').amount
            })
            this.getCouponList();
            this.getAllActivityList();
        }        
    }
    componentDidShow(){}
    //提交订单
    subOrderFn(){
        Taro.showLoading({
            title: '处理中',
        })
        let couponList = [];
        if(this.state.couponId!=''){
            couponList.push(this.state.couponId);
        }
        Taro.request({
            url:api.orderCreatePath,
            method:"POST",
            data:{
                "actType":this.state.cxYhMoneyType,
                "activityId": this.state.cxYhMoneyId,
                "couponList": couponList,
                "goodsList": this.state.goodsList,
                "memberAddressId": this.state.memberAddressId,
                "remark": this.state.remark,
                "payActAmount": this.state.cxYhMoney,
                "payCouponAmount": this.state.coupon,
                "payRealMoney": this.state.amount-this.state.cxYhMoney-this.state.coupon+this.state.freight,
                "paySavingAmount": 0,
                "payScore": 0,
                "payScoreAmount": 0,
                "payScoreCount": 0
            },
            header:{
                token:Taro.getStorageSync('token')
            }
        }).then((res)=>{
            Taro.hideLoading();
            if(res.data.success){                
                // Taro.showToast({
                //     title: '提交成功',
                //     icon: 'none',
                //     duration: 1500
                // });
                // Taro.navigateTo({
                //     url: '/pages/order/order'
                // })
                if(this.state.cxYhMoneyType!='5'){
                    Taro.request({
                        url:api.payPreorderPath,
                        method:"POST",
                        data:{
                          type:2,
                          totalPrice:res.data.data.payMoney,
                          linkOrder:res.data.data.orderId
                        },
                        header:{
                          token:Taro.getStorageSync('token')
                        }
                    }).then((res) =>{
                        this.payMoneyFn(res)
                    })
                }else{
                    this.payMoneyFn(res)
                }
            }else{
                if(res.data.errorInfo){
                    Taro.showToast({
                        title: res.data.errorInfo,
                        icon: 'none',
                        duration: 1500
                    });
                }else{
                    Taro.showToast({
                        title: '失败'+res.data.errorCode,
                        icon: 'none',
                        duration: 1500
                    });
                }
                
            }
        })
    }

    payMoneyFn(res){
          if(res.data.success){
            let param = {};
            let arr=res.data.data.split("&"); //各个参数放到数组里
              for(var i=0;i < arr.length;i++){
                  var num=arr[i].indexOf("=");
                   if(num>0){
                      let name=arr[i].substring(0,num);
                      let value=arr[i].substr(num+1);
                      param[name]=value;
                   }
              }
            Taro.requestPayment({
              timeStamp: param.timeStamp,
              nonceStr: param.nonceStr,
              package: "prepay_id="+param.prepay_id,
              signType: param.signType,
              paySign: param.paySign,
              success (res) {
                console.log(res);
              },
              fail (res) {console.log(res); }
            })
          }
    }

    //去充值
    goRecharge(amount){
    //    Taro.requestPayment({
    //         timeStamp: '',
    //         nonceStr: '',
    //         package: '',
    //         signType: 'MD5',
    //         paySign: '',
    //         success (res) { },
    //         fail (res) { }
    //     })
        Taro.navigateTo({
            url: '/pages/user/amount/amount?type=2&amount='+amount
        })
    }
    //获取用户所有有效优惠券
    getCouponList(){
        Taro.request({
            url:api.couponListPath,
            method:"POST",
            data:{
                "actId": "",
                "shopId": "1",
                "status": 0,
                "type": [1,2,3,4,5,6]
            },
            header:{
                token:Taro.getStorageSync('token')
            }
        }).then((res) =>{
            if(res.data.success){
                //筛选可用的优惠券
                let goodList = Taro.getStorageSync('orderCreate').goodsList;
                res.data.data.forEach(ele => {
                    if(ele.template.isGoods==1){
                        goodList.forEach(obj => {
                            if(ele.template.goodsId.indexOf(obj.goodsId)>-1){
                                ele['ky'] = true;
                            }
                        });
                    }else{
                        ele['ky'] = true;
                    }
                    
                });
                let tempList = []
                res.data.data.forEach(ele => {
                    if(ele['ky']){
                        tempList.push(ele)
                    }
                })
                tempList.forEach(element => {
                    this.useCoupon(element);
                });


                this.setState({
                    couponList:tempList
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
    //选择优惠券
    couponsMoreFn(){   
    this.setState({
        couponsModalShow: true
        })
    }
    //使用优惠券
    useCoupon(obj){
        let tempGoodsList = [];        
        if(obj.template.isGoods==1){
            this.state.goodsList.forEach(ele => {
                if(obj.template.goodsId.indexOf(ele.goodsId)>-1){
                    tempGoodsList.push(ele);
                }
            });
        }else{
            tempGoodsList = this.state.goodsList;
        }
        let money = 0;
        let yHmoney =0;
        tempGoodsList.forEach(element => {
            money+= element.price*element.count;
        });   
        if(money>=obj.template.reqAmt){
            if(obj.template.type==1){//(1.代金券 2.折扣券)
                yHmoney=obj.template.value;
            }else{
                yHmoney=parseFloat((money*(1-(obj.template.value/10))).toFixed(2));
            }            
        }
        let tempyHmoneyArr = this.state.yHmoneyArr;
        tempyHmoneyArr[obj.template.couponId] = yHmoney;
        this.setState({
            yHmoneyArr:tempyHmoneyArr
        });
        let MaxYh={
            id:'',
            val:0
        };
        for(let key in tempyHmoneyArr){
            if(tempyHmoneyArr[key]>MaxYh.val){
                MaxYh.id= key;
                MaxYh.val = tempyHmoneyArr[key];
            }
        }
        this.setState({
            coupon:MaxYh.val,
            couponId:MaxYh.id
        });
    }
    //选择优惠券
    selUseCoupon(id){
        this.setState({
            coupon:this.state.yHmoneyArr[id],
            couponId:id,
            couponsModalShow:false
        });
    }
    //促销活动
    getAllActivityList(){
        let allActivityList =Taro.getStorageSync('allActivityList');
        let goodsList = Taro.getStorageSync('orderCreate').goodsList;
        let tempList= [];
        allActivityList.forEach(element => {
            if(element.type!=4 && element.type!=5){
                tempList.push(element);
            }
        });
        if(tempList.length>0){
            let yXActivity = tempList[tempList.length-1];
            let rule = JSON.parse(yXActivity.rule);//规则
            // let rule = [{min:1,max:1,value:8},{min:2,max:2,value:7},{min:3,max:1000000,value:6}]
            let tempGoodsList = [];
            if(yXActivity.goodsType==1){
                goodsList.forEach(ele => {
                    if(yXActivity.goodsId.indexOf(ele.goodsId)>-1){
                        tempGoodsList.push(ele);
                    }
                });
            }else{
                tempGoodsList = goodsList;
            }
            
            let cxYhMoney = 0;
            if(yXActivity.type==1){//满几件打几折
                let count = 0;
                let sumMoney = 0;
                tempGoodsList.forEach(element => {
                    count +=element.count;
                    sumMoney +=element.price*element.count;
                });
                rule.forEach(element => {
                    if(count>=element.min && count<=element.max){
                        cxYhMoney=(10-element.value)/10*sumMoney;
                    }
                });
            }
            if(yXActivity.type==2){//满几件省多少
                let count = 0;
                tempGoodsList.forEach(element => {
                    count +=element.count;
                });
                rule.forEach(element => {
                    if(count>=element.min && count<element.max){
                        cxYhMoney=element.value;
                    }
                });

            }
            if(yXActivity.type==3){//满多少省多少
                let sumMoney = 0;
                tempGoodsList.forEach(element => {
                    sumMoney +=element.price*element.count;
                });
                rule.forEach(element => {
                    if(sumMoney>=element.min && sumMoney<element.max){
                        cxYhMoney=element.value;
                    }
                });
            }
            this.setState({
                cxYhMoney:cxYhMoney,
                cxYhMoneyId:yXActivity.id,
                cxYhMoneyType:yXActivity.type,
            })

        }

        

    }


    render(){
        const {goodsList,amount,addressObj,addressListlength,couponList} = this.state;
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
                            <Text className="goods-total-num">共{goodsList.length}类商品</Text>
                            <Text>合计:</Text>
                            <Text className="goods-tataol-price theme-color">¥{amount}</Text>
                        </View>
                    </View>
                </View>
                <View className="wrap-pormo section-item">
                    {
                        this.state.orderType==0 && <View className="arrow-item flex flex-between" onClick={this.couponsMoreFn}>
                                                        <Text>优惠券/码</Text>
                                                        <Text>已优惠{this.state.coupon}元</Text>
                                                    </View>
                    }                    
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
                        <Text>微信</Text>
                    </View>
                </View>
                <View className="wrap-payinfo section-item">
                    <View className="flex flex-between">
                        <View>商品金额
                            <Text className="money-tip iconfont icon-gandanhao font24">
                                <Text className="money-msg-tip money-msg">价格说明：因价格更新导致价格变动、营销互斥规则等原因，商品售价可能与前置页面不同，以本结算页为准</Text>
                            </Text>
                        </View>
                        <Text>¥{this.state.amount}</Text>
                    </View>
                    
                    {
                        this.state.orderType==5 && <View>
                                                        <View className="flex flex-between">
                                                            <Text>充值赠送抵扣</Text><Text>-¥{this.state.amount}</Text>
                                                        </View>
                                                        <View className="flex flex-between">
                                                            <Text>充值金额</Text><Text>¥{this.state.amount*this.state.saveTimes}</Text>
                                                        </View>
                                                        <View className="flex flex-between">
                                                            <Text>运费</Text><Text>¥{this.state.freight}</Text>
                                                        </View>
                                                        <View className="flex flex-between">
                                                            <Text>实付支付</Text><Text>¥{this.state.amount*this.state.saveTimes+this.state.freight}</Text>
                                                        </View>
                                                    </View>
                    }
                    {
                        this.state.orderType==0 && <View>
                                                        <View className="flex flex-between">
                                                            <Text>促销活动抵扣</Text><Text>-¥{this.state.cxYhMoney}</Text>
                                                        </View>
                                                        <View className="flex flex-between">
                                                            <Text>优惠券抵扣</Text><Text>-¥{this.state.coupon}</Text>
                                                        </View>
                                                        <View className="flex flex-between">
                                                            <Text>运费</Text><Text>¥{this.state.freight}</Text>
                                                        </View>
                                                        <View className="flex flex-between">
                                                            <Text>实际支付</Text><Text>¥{this.state.amount-this.state.cxYhMoney-this.state.coupon+this.state.freight}</Text>
                                                        </View>
                                                    </View>
                    }
                </View>
                <View className="wrap-footer flex flex-between border-top-1px fixIphonex">
                    {
                        this.state.orderType==0 && <View className="pay-info"> 
                                                        实付：<Text className="theme-color">¥{this.state.amount-this.state.cxYhMoney-this.state.coupon+this.state.freight}</Text>
                                                    </View>
                    }
                    {
                        this.state.orderType==5 && <View className="pay-info"> 
                                                        实付：<Text className="theme-color">¥{this.state.amount*this.state.saveTimes+this.state.freight}</Text>
                                                    </View>
                    }
                    
                    {/* disable */}
                    {
                        this.state.orderType==0 && <View className="sub-btn theme-bgc" onClick={this.subOrderFn.bind(this)}>提交订单</View>
                    }
                    {
                        this.state.orderType==5 && <View className="sub-btn theme-bgc" onClick={this.goRecharge.bind(this,this.state.amount*this.state.saveTimes+this.state.freight)}>去充值</View>
                    }
                </View>
                <View className='InvocePage_box' hidden={this.state.isShowInvocePage}>
                    <InvocePage></InvocePage>
                </View>
                
                <AtFloatLayout title="使用优惠券" isOpened={this.state.couponsModalShow}>
                    <View className='couponsModal_box select_coupons_wrap'>
                        <View className="select_coupons_box">
                            <View className="select_ocupons_cont coupon_pick_wrap">
                                {
                                    couponList.map((item)=>{
                                        return (
                                    <View key={item.id} className="coupon flex coupon-picker discoloration" style="background-color: rgba(241, 45, 34, 0.6);">
                                        <View className="coupon-price flex theme-color flex-col">
                                            <View className={"price-number "+(item.template.type==1?"price-number_3":"")}>
                                                {item.template.type==1 && <View className="unit-name_3">¥</View>}                                        
                                                <View>{item.template.value}</View>
                                                {item.template.type==2 && <View className="coupon_fsize">折</View>}
                                            </View>
                                            <Text className="coupon-full">满{item.template.reqAmt}元</Text>
                                        </View>
                                        <View className="coupon-content flex1 flex flex-col">
                                            {item.type==1 && <View className="coupon-dec text-line1">满{item.template.reqAmt}减{item.template.value}元</View>}
                                            {item.type==2 && <View className="coupon-dec text-line1">{item.template.type==1?"超值满减券":"超值折扣券"}</View>}
                                            <View className="coupon-date">
                                                {item.template.date1} - {item.template.date2}
                                            </View>
                                            <View className="coupon-date">{item.template.isGoods==1?"部分商品可用":"全部商品可用"}</View>
                                        </View>
                                        <View onClick={this.selUseCoupon.bind(this,item.template.couponId)} className="coupon-operate flex" style="background-color: rgb(241, 45, 34);">
                                            <View  className="btn-pick theme-bdc theme-color font26">{this.state.couponId==item.template.couponId?'已使用': '使用'}</View>
                                        </View>
                                        <View className="border-coupon"></View>
                                    </View>
                                        )
                                    })
                                }
                                <View className="height-48"></View>
                            </View>
                        </View>
                    </View>
                </AtFloatLayout>


            </View>
        )
    }
}
export default Ordercreate as ComponentClass