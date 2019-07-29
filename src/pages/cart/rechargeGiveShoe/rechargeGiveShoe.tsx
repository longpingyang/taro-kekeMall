import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button,Image,Input, Text, ScrollView } from '@tarojs/components'
import { AtFloatLayout } from "taro-ui"
import goodsImg from '../../../images/goods/1.jpg';
import './rechargeGiveShoe.scss'
const api = require('../../../config/api.js');

class RechargeGiveShoe extends Component {
   
  config: Config = {
    navigationBarTitleText: '入包送鞋'
  }

  componentWillReceiveProps (nextProps) {
  }

  componentWillUnmount () { }
  componentDidMount(){
  }

  componentDidShow () { 
    this.getShopcartList(this.$router.params.ids);
  }

  componentDidHide () { }
  state ={
    couponsModalShow: false,
    goodsList:[],
    amount:0,
    saveTimes:1,
    allChecked:true
  }
  goDetailPage(id){
    Taro.navigateTo({
      url: '/pages/goods/details/details?id='+id+'&shopId=1'
    })
  }
  goOrderCreatePage(){
    let tempArr = [];
    this.state.goodsList.forEach(element => {
      if(element['checked']){
        tempArr.push(element);
      }
    });
    Taro.setStorageSync("orderCreate",{goodsList:tempArr,amount:this.state.amount,saveTimes:this.state.saveTimes});
    Taro.navigateTo({
      url: '/pages/cart/ordercreate/ordercreate?orderType=5'
    })
  }
  getShopcartList(ids){
    let tempGoods=[];
    let tempamount= 0;
    let idArr=ids.split(',')
    for(let i=0; i<idArr.length; i++){
        Taro.request({
            url:api.goodsDetailPath,
            method:'POST',
            data:{
              goodsId:idArr[i]
            },
            header:{
              token:Taro.getStorageSync('token')
            }
        }).then((res)=>{
            if(res.data.success){
                tempGoods.push(res.data.data);
                tempamount+=res.data.data.price;             
            }else{
              if(res.data.errorCode=='E401'){
                Taro.setStorageSync('userMember',null);
                Taro.navigateTo({
                  url: '/pages/user/login/login'
                })
              }
            }
            
            if(tempGoods.length==idArr.length){
                tempGoods.forEach(element => {
                    element['checked']=true
                    element['count'] =1;
                    element['mainPic'] = JSON.parse(element.picList)[0];
                    element['colorId'] =element.colorList[0].colorId;
                    element['colorName'] =element.colorList[0].name;
                    element['sizeId'] =element.sizeList[0].sizeId;
                    element['sizeName'] =element.sizeList[0].name;
                });
                this.setState({
                    goodsList:tempGoods,
                    amount:tempamount,
                    allChecked:true,
                    couponsModalShow: false,
                    saveTimes:parseInt(JSON.parse(this.$router.params.rule).saveTimes)
                })
            }


        })
    }
    
  }
  editCartCount(type,index){
    if(type=='jian'){
      if(this.state.goodsList[index].count>1){
        this.setState((preState)=>{
          let tempNum = parseInt(preState.goodsList[index].count)-1;
          preState.goodsList[index].count=tempNum;
          // this.updateCartCount(preState.goodsList[index].cartId,tempNum);
        },()=>{          
          this.setTotalPrice()
        })
      }
      
    }else{
      this.setState((preState)=>{
        let tempNum = parseInt(preState.goodsList[index].count)+1;
        preState.goodsList[index].count=tempNum;
        // this.updateCartCount(preState.goodsList[index].cartId,tempNum);
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
      })      
    });
    this.setTotalPrice(); 
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
  render () {
    const { goodsList } = this.state
    const goodsItem = goodsList.map((post) =>{
        return  <View className='goodsItem' key={post.id} onClick={this.goDetailPage.bind(this,post.goodsId)}>
                  <Image className='goods_img' mode='aspectFill' src={post.mainPic}></Image>     
                  <View className='goodsText'>         
                    <View className='title'>{post.goodsName}</View>
                    <View className='lump' hidden={post.lump!=1}>
                      <Text className='text'>拼团</Text>
                    </View>
                    <View className='bottom'>
                      <Text className='vip'>会员</Text>
                      <Text className='b'>￥</Text>
                      <Text className='span'>{post.dispPrice}</Text>
                      <Image className='image' src={require('../../images/index03.jpg')}></Image>
                    </View>
                  </View>
              </View>
        })
    return (
        <View>
            <ScrollView>
                <View className='goodsList_box'>
                {goodsItem}
                </View>
            </ScrollView>
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

export default RechargeGiveShoe as ComponentClass
