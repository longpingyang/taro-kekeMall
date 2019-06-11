import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button,Icon, Text, Image, Input,Picker } from '@tarojs/components'
import './edit.scss'
const api = require('../../../config/api.js');
class AddressEdit extends Component {
  config: Config = {
    navigationBarTitleText: '编辑地址'
  }
  state={
    region: ['请选择', '', ''],
    customItem: '全部',
    selected:false,
    truename:"",
    phone:'',
    deliveryId:"",
    addressOtherText:'',
    postalCode:""
  }
  bindRegionChange(e){
    console.log(e);
    this.setState({
      region: e.detail.value
    })
  }
  changeSelected(){
    this.setState({
      selected:!this.state.selected
    })
  }
  saveAddress(){
    var param:any={}
    if(this.state.deliveryId==''){
      param={
        "address": this.state.region.join('')+this.state.addressOtherText,
        "isDefault": this.state.selected?'1':'0',
        "memberId": "",
        "phone": this.state.phone,
        "truename": this.state.truename
      }
    }else{
      param={
        "address": this.state.region.join('')+this.state.addressOtherText,
        "isDefault": this.state.selected?'1':'0',
        "memberId": "",
        deliveryId:this.state.deliveryId,
        "phone": this.state.phone,
        "truename": this.state.truename
      }
    }
    Taro.request({
      url:api.memberDeliverySavePath,
      method:'POST',
      data:param,
      header:{
        token:Taro.getStorageSync('token')
      }
    }).then((res)=>{
      if(res.data.success){
        Taro.showToast({
          title: '保存成功',
          icon: 'none',
          duration: 2000
        });
        Taro.navigateTo({
          url: '/pages/address/list/list'
        })
      }
    })
  }
  handleChange (key,e) {
    this.setState({
      [key]:e.detail.value
    })    
    return e.detail.value;
  }

  componentDidMount(){
    if(this.$router.params.id!=''){
      this.state.deliveryId=this.$router.params.id
    }
  }
  render () {    
    return (
        <View className="edit-addr-box">
            <View className="edit-addr-container">
                  {/* <View className="m-row m-row-line m-row-between">
                      <View>快速识别地址信息</View>
                      <Button className="m-switch">
                          <span className="m-switch-point"></span>
                          <span className="m-switch-inner"></span>
                      </Button>
                  </View> */}
                  <View className="m-row m-row-line m-row-start">
                      <View className="title">收件人</View>
                      <Input type="text" className="edit-addr-input" name="name" placeholder="收件人" onInput={this.handleChange.bind(this,'truename')} value={this.state.truename}></Input>
                  </View>
                  <View className="m-row m-row-line m-row-start">
                      <View className="title">联系电话</View>
                      <Input type="number" className="edit-addr-input" name="phone" placeholder="联系电话" onInput={this.handleChange.bind(this,'phone')} value={this.state.phone}></Input>
                  </View>
                  <View className="m-row m-row-line m-row-start">
                      <View className="title">所在地区</View>
                      {/* <Input type="text" className="edit-addr-input" placeholder="请选择省、市、区、乡镇/街道" value=""></Input>
                      <Picker mode="region"></Picker> */}
                      <Picker mode="region" className="picker_box" onChange={this.bindRegionChange.bind(this)} value={this.state.region} custom-item={this.state.customItem}>
                        <View className="picker">
                          <Text className='text'>{this.state.region[0]}</Text>
                          <Text className='text'>{this.state.region[1]}</Text>
                          <Text className='text'>{this.state.region[2]}</Text>
                        </View>
                      </Picker>
                      <View className="edit-addr-location iconfont icon-dingwei theme-color font28">
                          <Text>定位</Text>
                      </View>
                  </View>
                  <View className="m-row m-row-line m-row-start">
                      <View className="title">详细地址</View>
                      <Input className="edit-addr-input" name="address" onInput={this.handleChange.bind(this,'addressOtherText')} placeholder="道路，楼牌号等" value={this.state.addressOtherText}></Input>
                  </View>
                  <View className="m-row  m-row-start">
                      <View className="title">邮编</View>
                      <Input type="text" className="edit-addr-input" onInput={this.handleChange.bind(this,'postalCode')} name="postalCode" placeholder="邮政编码（选填）" value={this.state.postalCode}></Input>
                  </View>
            </View>
            <View className="edit-addr-default-box">
                  <View className="m-row  m-row-between">
                      <Text>设为默认地址</Text>
                      <View onClick={this.changeSelected.bind(this)} className={'edit-addr-default-icon iconfont '+(this.state.selected?'theme-color icon-xuanzhong':'c4c4c4 icon-weixuanzhong')}></View>
                  </View>
            </View>
            <View className="edit-addr-save font36 theme-bgc" onClick={this.saveAddress.bind(this)}>保存</View>
            <View className=" fixed-btn-group iphoneXMB">
                <View className="btn btn-hide"><span className="iconfont icon-fixed-top color-6"></span></View>
            </View>
        </View>
    )
  }
}
export default AddressEdit as ComponentClass;
