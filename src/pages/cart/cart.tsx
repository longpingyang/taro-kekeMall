import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button,Image,Input, Text } from '@tarojs/components'
import { AtFloatLayout } from "taro-ui"
import CouponsModal from '../goods/details/couponsModal/couponsModal'
import goodsImg from '../../images/goods/1.jpg';
import './cart.scss'
const api = require('../../config/api.js');

class Cart extends Component {
   
  config: Config = {
    navigationBarTitleText: '购物车'
  }

  componentWillReceiveProps (nextProps) {
  }

  componentWillUnmount () { }
  componentDidMount(){
  }

  componentDidShow () { 
    this.getShopcartList();
  }

  componentDidHide () { }
  state ={
    couponsModalShow: false,
    goodsList:[],
    amount:0,
    allChecked:true
  }
  goDetailPage(id){
    Taro.navigateTo({
      url: '/pages/goods/details/details?id='+id
    })
  }
  goOrderCreatePage(){
    Taro.setStorageSync("orderCreate",{goodsList:this.state.goodsList,amount:this.state.amount});
    Taro.navigateTo({
      url: '/pages/cart/ordercreate/ordercreate'
    })
  }
  getShopcartList(){
    Taro.request({
      url:api.orderShopcartListPath,
      method:"POST",
      header:{
        token:Taro.getStorageSync('token')
      }
    }).then((res) =>{
      if(res.data.success){
        res.data.data.goodsList.forEach(element => {
          element['checked']=true
        });

        this.setState({
          goodsList:res.data.data.goodsList,
          amount:res.data.data.amount,
          allChecked:true,
          couponsModalShow: false
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
  editCartCount(type,index){
    if(type=='jian'){
      if(this.state.goodsList[index].count>1){
        this.setState((preState)=>{
          let tempNum = parseInt(preState.goodsList[index].count)-1;
          preState.goodsList[index].count=tempNum;
          this.updateCartCount(preState.goodsList[index].cartId,tempNum);
        },()=>{          
          this.setTotalPrice()
        })
      }
      
    }else{
      this.setState((preState)=>{
        let tempNum = parseInt(preState.goodsList[index].count)+1;
        preState.goodsList[index].count=tempNum;
        this.updateCartCount(preState.goodsList[index].cartId,tempNum);
      },()=>{
        this.setTotalPrice()
      })
    }
  }
  //更新购物 count
  updateCartCount(id,count){
    Taro.request({
      url:api.orderShopcartModifyPath,
      method:"POST",
      data:{
        "cartId": id,
        "count": count
      },
      header:{
        token:Taro.getStorageSync('token')
      }
    })
  }


  //选择要结算的商品
  checkGoods(index){
    this.setState((data)=>{
      data.goodsList[index].checked=!this.state.goodsList[index].checked;
    },()=>{
      let isAll = true;
      this.state.goodsList.forEach(element => {
        if(!element['checked']){
          this.setState((data)=>{
            data['allChecked']=false;
            data['couponsModalShow']=false;
          });
          isAll=false
        }
      });
      if(isAll){
        this.setState((data)=>{
          data['allChecked']=true;
          data['couponsModalShow']=false;
        });
      }
      this.setTotalPrice();
    })
  }
  allCheckedFn(){
    this.setState((data)=>{
      data['allChecked']=!this.state.allChecked;
    },()=>{
      let goodsList = this.state.goodsList;
      if(this.state.allChecked){
        goodsList.forEach(element => {
          element['checked']=true;
        })
      }else{
        goodsList.forEach(element => {
          element['checked']=false;
        })
      }
      this.setState((data)=>{
          data.goodsList=goodsList;
      });
      this.setTotalPrice();      
    });
  }


  //计算总价
  setTotalPrice(){
    let total=0;
    this.state.goodsList.forEach(element => {
      if(element['checked']){
        total=total+parseInt(element.count)*parseFloat(element.price);
      }
    });
    this.setState((data)=>{
      data['amount']=total;
      data['couponsModalShow']=false;
    })
  }
  //删除
  delCartGoods(){
    let delIds=[];
    this.state.goodsList.forEach(element => {
      if(element['checked']){
        delIds.push(element.cartId);
      }
    });

    if(delIds.length>0){
      Taro.showModal({
        title:"提示",
        content:"您确认要删除吗?",
        success:()=>{
          Taro.request({
            url:api.orderShopcartDelPath,
            method:"POST",
            data:{
              cartId:delIds.join(','),
              count:delIds.length
            },
            header:{
              token:Taro.getStorageSync('token')
            }
          }).then((res)=>{
            if(res.data.success){
              Taro.showToast({
                title:"删除成功",
                icon:"success",
                duration:1500
              });
              this.getShopcartList()
            }
          })
        }
      })
    }else{
      Taro.showToast({
        title:"请选择要删除的商品",
        icon:"none",
        duration:1500
      })
    }

    
  }



  //更多优惠卷
  couponsMoreFn(){
    this.setState((data)=>{
      data['couponsModalShow']=true;
    })
  }
  render () {
    const { goodsList } = this.state
    return (
      <View className='cart_box'>
        <View className="shopcart">
          <View className="store_wrap">
              <View className="shopcart_title_wrap flex flex-between font28">
                  <View className="shopcart_title_name text-line-1 flex1">
                    <View onClick={this.allCheckedFn.bind(this)} className="store_select">
                      <View className="shopcart_iconwrap">
                        <View className={"iconfont theme-color "+(this.state.allChecked?"icon-xuanzhong":"icon-weixuanzhong")}></View>
                      </View>
                    </View>
                    <Text className="color-3">克克智慧零售</Text>
                  </View>
                  <View onClick={this.couponsMoreFn} className="shopcart_title_action font26 color-5"><Text className="btn btn_coupon">优惠券</Text></View>
              </View>
              <View>
                {
                  goodsList.map((item,index) =>{
                    return (
                      <View className="shopcart_g" key={item.cartId}>
                        <View className="rc-swipeout">
                            <View className="rc-swipeout-content" style="touch-action:pan-y;">
                                <View className="shopcart_g2">
                                    <View className="shopcart_content flex">
                                        <View className="shopcart_iconwrap">
                                            <View onClick={this.checkGoods.bind(this,index)} className={"iconfont theme-color "+(item.checked?"icon-xuanzhong":"icon-weixuanzhong")}></View>
                                        </View>
                                        <View className="shopcart_img">
                                            {/* <View className="imgCover" style={{backgroundImage: `url(${goodsImg})`}}>
                                            </View> */}
                                            <Image className='imgCover' mode='aspectFill' src={item.mainPic}></Image>
                                        </View>
                                        <View className="flex1 font26 info">
                                            <View>
                                                <View className="shopcart_title text-line2">
                                                    {item.goodsName}
                                                </View>
                                                <View className="shopcart_sku line-height1">
                                                    {item.colorName}/{item.sizeName}
                                                </View>
                                                <Text className="activityTag">会员</Text>
                                            </View>
                                            <View className="shopcart_buy_price">
                                              <View className="theme-color">
                                                <Text className="font24">¥</Text>
                                                <Text className="font30">{item.price}</Text>
                                                {/* <Text className="font24">.00</Text> */}
                                              </View>
                                            </View>
                                            <View className="shopcart_buy_action flex">
                                                <View className={"label jian "+(item.count==1?"invalid":"")} onClick={this.editCartCount.bind(this,'jian',index)}>－</View>
                                                  <View><Input type="number" value={item.count}></Input></View>
                                                <View className="label jia " onClick={this.editCartCount.bind(this,'jia',index)}>＋</View>
                                            </View>
                                        </View>
                                    </View>
                                    <View className="goods-split-line"></View>
                                </View>
                            </View>
                        </View>
                      </View>
                    )
                  })
                }                
              </View>
          </View>
          <View className="shopcart_account_wrap flex bottom100 iphoneXMB">
              <View onClick={this.allCheckedFn.bind(this)} className="shopcart_iconwrap">
                <View className={"iconfont theme-color "+(this.state.allChecked?"icon-xuanzhong":"icon-weixuanzhong")}></View>
              </View>
              <View className="sc_select_all">全选</View>
              <View onClick={this.delCartGoods} className="theme-color delete_btn font26">删除</View>
              <View className="shopcart_total_price flex1 flex flex-col">
                  <View className="font26">
                      总计:
                      <Text className="theme-color price">
                        <Text className="font26">¥</Text>
                        <Text className="font36">{this.state.amount}</Text>
                        {/* <Text className="font26">.00</Text> */}
                      </Text>
                  </View>
                  <View className="description font20">(不含运费)</View>
              </View>
              <View onClick={this.goOrderCreatePage} className="shopcart_go_buy">去结算</View>
          </View>
          <View className="navHeight"></View>
        </View>
        <View className='nocart_box' hidden={true}>
          <Image mode='widthFix' src={require('../../images/003.jpg')}></Image>
          <View className='goodsList_box'>
          {
            this.state.goodsList.map((item,index)=>{
            return <View className='goodsItem' key={item.id} onClick={this.goDetailPage.bind(this,item.id)}>
                <Image className='goods_img' mode='aspectFill' src={item.imgurl}></Image>
                <View className={'title ' + (item.lump==1?"lump":"")}>{item.title}</View>
                <View className='lump' hidden={item.lump!=1}>
                  <Text className='text'>拼团</Text>
                </View>
                <View className='bottom'>
                  <Text className='vip'>会员</Text>
                  <Text className='b'>￥</Text>
                  <Text className='span'>0.87</Text>
                  <Image className='image' src={require('../../images/index03.jpg')}></Image>
                </View>
            </View>
            })
          }
          </View>
        </View>
          
        <AtFloatLayout title="领取优惠券" isOpened={this.state.couponsModalShow}>
            <CouponsModal />
        </AtFloatLayout>

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

export default Cart as ComponentClass
