import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'

// import { AtBadge,AtList, AtListItem  } from "taro-ui";
import './order.scss'

const api = require('../../config/api.js');


// #region 书写注意
// 
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion


class Order extends Component {

    /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
    config: Config = {
    navigationBarTitleText: '订单列表'
  }

  componentWillReceiveProps (nextProps) {
    
  }

  componentWillUnmount () { }
  componentWillMount(){
    // Taro.getStorage({key:'userInfo'}).then(rst => {   //从缓存中获取用户信息
    //   this.setState({
    //     userInfo: rst.data
    //   })
    // })
    if(this.$router.params.type){
      this.setState({
        currentNav:this.$router.params.type
      },()=>{
        this.getOrderLisyFn(this.state.currentNav)
      })
    }else{
      this.getOrderLisyFn(this.state.currentNav)
    }
    
  }
  state = {
    userInfo:{
      avatarUrl:'',
      nickName:''
    },
    isCard:2,
    currentNav:1,
    orderList:[]
  }
  componentDidShow () { }

  componentDidHide () { }
  tobegin = (userInfo) => {    
    if(userInfo.detail.userInfo){   //同意
      // this.props.setBasicInfo(userInfo.detail.userInfo) //将用户信息存入redux
      Taro.setStorage({key:'userInfo',data:userInfo.detail.userInfo}).then(rst => {  //将用户信息存入缓存中
          Taro.navigateBack()
      })
    } 
  };
  getOrderLisyFn(type){
    this.setState({
      currentNav:type
    })

    Taro.request({
      url:api.orderListPath,
      method:"POST",
      data:{
        "orderId": "",
        "orderStatus": type,
        "pageInfo": {
          "pageCount": 0,
          "pageNo": 1,
          "pageRec": 0,
          "pageSize": 10
        }
      },
      header:{
        token:Taro.getStorageSync('token')
      }
    }).then((res)=>{
      if(res.data.success){
        this.setState({
          orderList:res.data.data
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

  goOrderDetailsPage(id){
    Taro.navigateTo({
      url: '/pages/order/details/details?id='+id
    })
  }
  payMoneyFn(index){
    if(this.state.orderList[index].orderType){
      Taro.request({
        url:api.payPreorderPath,
        method:"POST",
        data:{
          type:this.state.orderList[index].orderType==1?1:2,
          totalPrice:this.state.orderList[index].payMoney,
          linkOrder:this.state.orderList[index].orderId
        },
        header:{
          token:Taro.getStorageSync('token')
        }
      }).then((res) =>{
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
              Taro.navigateTo({
                url: '/pages/order/order?type=2'
              })
            },
            fail (res) {console.log(res); }
          })
        }
      })
    }else{
      Taro.showToast({
        title: '数据有误',
        icon: 'none',
        duration: 2000
      });
    }
  }
  render () {
    return (
      <View className="orderListPage">
          <View className='order_nav'>
            {/* <Text onClick={this.getOrderLisyFn.bind(this,0)} className={'text '+(this.state.currentNav==1?'active':'')}>全部</Text> */}
            <Text onClick={this.getOrderLisyFn.bind(this,1)} className={'text '+(this.state.currentNav==1?'active':'')}>待支付</Text>
            <Text onClick={this.getOrderLisyFn.bind(this,2)} className={'text '+(this.state.currentNav==2?'active':'')}>待发货</Text>
            <Text onClick={this.getOrderLisyFn.bind(this,3)} className={'text '+(this.state.currentNav==3?'active':'')}>待收货</Text>
            <Text onClick={this.getOrderLisyFn.bind(this,4)} className={'text '+(this.state.currentNav==4?'active':'')}>待评价</Text>
          </View>
          <View className='order_list'>
          {
            this.state.orderList.map((item,index)=>{
              return (
                    <View key={item.orderId} className="order-list-item-wrap">
                      <View className="order-item-desc">
                          <Text className="order-item-time flex1 color-3">下单时间：{item.ctime}</Text>
                          {
                            this.state.currentNav==1 && <View>
                                                          <Text className="theme-color">待支付</Text>
                                                          <Text onClick={this.payMoneyFn.bind(this,index)} className="payBtn theme-color">立即支付</Text>
                                                        </View>
                          }
                          {
                            this.state.currentNav==2 && <Text className="theme-color">待发货</Text>
                          }
                          {
                            this.state.currentNav==3 && <Text className="theme-color">待收货</Text>
                          }
                          {
                            this.state.currentNav==4 && <Text className="theme-color">待评价</Text>
                          }
                      </View>
                      <View className="order-list-item" onClick={this.goOrderDetailsPage.bind(this,item.orderId)}>
                          {
                            item.goodsList.length==1 && item.goodsList.map((citem)=>{
                              return (
                                  <View key={citem.goodsId} className="order-goods">
                                    <View className="flex">
                                        <Image className="order-goods-img" src={citem.mainPic}></Image>
                                        <View className="order-goods-detail flex1">
                                            <View className="flex">
                                                <Text className="order-goods-title flex1" >
                                                  {citem.goodsName}
                                                </Text>
                                                <View className="order-goods-price tr">
                                                    <Text>¥{citem.price}</Text>
                                                </View>
                                            </View>
                                            <View className="order-goods-sku flex">
                                                <Text className="flex1 font22">{citem.colorName}/{citem.sizeName}</Text>
                                                <Text className="order-goods-count font26 tr">x{citem.count}</Text>
                                            </View>
                                            <View className="order-goods-tags font20 flex">
                                                <View className="order-goods-tags font20 flex">
                                                    <Text className="order-goods-tag">会员</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                  </View>
                              )
                            })
                          }
                          {
                            (item.goodsList.length>1 && item.goodsList.length<=3) && 
                                  <View className="order-goods">
                                    <View className="flex">
                                    {
                                        item.goodsList.map((citem)=>{
                                          return (<Image key={citem.goodsId} className="order-goods-img" src={citem.mainPic}></Image>)
                                        })
                                    }
                                    </View>
                                  </View>
                          }
                          {
                            item.goodsList.length>3 && 
                                  <View key={citem.goodsId} className="order-goods">
                                    <View className="flex">
                                        <Image className="order-goods-img" src={item.goodsList[0].mainPic}></Image>
                                        <Image className="order-goods-img" src={item.goodsList[1].mainPic}></Image>
                                        <Image className="order-goods-img" src={item.goodsList[2].mainPic}></Image>
                                    </View>
                                  </View>
                          }
                          <View className="order-goods-amount font26 color-3">
                              <Text className="goods-amount-number">共{item.goodsList.length}件商品</Text>
                              <Text>实付：</Text>
                              <Text className="theme-color">¥{item.payMoney}</Text>
                          </View>
                          <View className="order-item-action" data-no="8811948016528" data-iscycle="false" style="display: none;">
                          </View>
                        </View>
                    </View>
              )
            })
          }
            
          </View>
          <View className="loadMore">没有更多了</View>
      </View>
    )
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Order as ComponentClass
