import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button,Icon, Text, Image } from '@tarojs/components'
import './list.scss'
const api = require('../../../config/api.js');
class AddressList extends Component {
  config: Config = {
    navigationBarTitleText: '收货地址'
  }
  goEditAddressPage(id,e){
      Taro.navigateTo({
        url: '/pages/address/edit/edit?id='+id
      })
  }
  state={
    addressList:[],
    listlength:0,
    iscreateOrder: false
  }

  componentDidMount(){
    this.getAddressList()
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
        let iscreateOrder=false;
        if(this.$router.params.checkedId){
          res.data.data.forEach(element => {
            if(element['deliveryId']==this.$router.params.checkedId){
              element['checked'] = true;
              iscreateOrder=true;
            }else{
              element['checked'] = false;
            }
          });
        }
        this.setState({
          addressList:res.data.data,
          listlength:res.data.data.length,
          iscreateOrder:iscreateOrder
        })
      }
    })
  }
  //删除地址
  delAddress(id,e){
    Taro.request({
      url:api.memberDeliveryDelPath,
      method:"POST",
      data:{
        deliveryId:id
      },
      header:{
        token:Taro.getStorageSync('token')
      }
    }).then((res)=>{
      if(res.data.success){
        this.getAddressList();
        Taro.showToast({
          title: '删除成功',
          icon: 'none',
          duration: 1500
        });
      }
    })
  }
  //设为默认地址
  setDefaultAddress(id){
    Taro.request({
      url:api.memberDeliverySetdefaultPath,
      method:"POST",
      data:{
        deliveryId:id
      },
      header:{
        token:Taro.getStorageSync('token')
      }
    }).then((res)=>{
      if(res.data.success){
        this.getAddressList();
        Taro.showToast({
          title: '设置成功',
          icon: 'none',
          duration: 1500
        });
      }
    })
  }
  selCreateOrderAdd(id){
    if(this.state.iscreateOrder){
      if(this.$router.params.orderType){
        Taro.navigateTo({
          url: '/pages/cart/ordercreate/ordercreate?addId='+id+"&orderType="+this.$router.params.orderType
        })
      }else{
        Taro.navigateTo({
          url: '/pages/cart/ordercreate/ordercreate?addId='+id
        })
      }
      
    }
  }




  render () {
    const {addressList,listlength}=this.state;    
    return (
      <View className="addressList_box">
        <View className="msg-header">
            <View className="msg-item theme-color">
                收货地址
                <View className="msg-item-active theme-bgc"></View>
            </View>
            <View className="msg-item">
                身份证信息
                <View className="msg-item-active "></View>
            </View>
        </View>
        <View className="">
            <View className="m-address-list">
                <View className="list">
                {
                  addressList.map((item,index)=>{
                    return (
                      <View onClick={this.selCreateOrderAdd.bind(this,item.deliveryId)} className="item" key={item.deliveryId}>
                        {
                          item.checked && <View className="iconfont icon-xuanzhongdizhi theme-color"></View>
                        }
                        <View className="core">
                          <Text className="name">{item.truename}</Text>
                          <Text className="tel">{item.phone}</Text>
                        </View>
                        <View className="details">
                          {item.address}
                            {/* （{item.phone}） */}
                        </View>
                        <View className="msg-action-box">
                            <View className="default">
                              {
                                item.isDefault==1 && <View className={"iconfont icon-default "+(item.isDefault==1?"icon-morengdizhi theme-color":"icon-weixuanzhong")}></View>
                              }
                              {
                                !(item.isDefault==1) && <View onClick={this.setDefaultAddress.bind(this,item.deliveryId)} className={"iconfont icon-default "+(item.isDefault==1?"icon-morengdizhi theme-color":"icon-weixuanzhong")}></View>
                              }
                              <Text className='text'>{item.isDefault==1?"默认地址":"设为默认地址"}</Text>  
                            </View>
                            <View className="special">
                              <View onClick={this.goEditAddressPage.bind(this,item.deliveryId)} className="iconfont icon-bianji1 edit">编辑</View>
                              <View onClick={this.delAddress.bind(this,item.deliveryId)} className="iconfont  icon-shanchu3 delete">删除</View>
                            </View>
                        </View>
                    </View>
                    )
                  })
                }
                </View>
                <View className={"handel fixIphonex "+(listlength>0?"content":"content-null")}>
                    <View hidden={listlength>0} className="icon-address-null"></View>
                    <View hidden={listlength>0} className="address-tip">您还没有收货地址</View>
                    <View onClick={this.goEditAddressPage.bind(this,'')} className="single-btn theme-bgc color-white">新增地址</View>
                </View>
                {/* <View className=" fixed-btn-group iphoneXMB">
                    <View className="btn btn-hide"><View className="iconfont icon-fixed-top color-6"></View></View>
                </View> */}
            </View>
        </View>
        <View className="none">
            <View className="id-card-list-box">
                <View className="list"></View>
                <View className="handel  content-null fixIphonex">
                    <View className="icon-id-card-null"></View>
                    <View className="id-card-tips">您还没有身份证信息</View><a className="single-btn theme-bgc  color-white "
                        href="">立即添加</a>
                </View>
            </View>
        </View>
      </View>
    )
  }
}
export default AddressList as ComponentClass;












// import { ComponentClass } from 'react'
// import Taro, { Component, Config } from '@tarojs/taro'
// import { View, Button,Icon, Text, Image } from '@tarojs/components'
// import './list.scss'

// class AddressList extends Component {
//   config: Config = {
//     navigationBarTitleText: '收货地址'
//   }
//   render () {    
//     return (
//       <View className="addressList_box">
          
//       </View>
//     )
//   }
// }
// export default AddressList as ComponentClass;
