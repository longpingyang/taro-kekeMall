import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View,Image,Input,Text,Button } from '@tarojs/components'
import { AtInput, AtForm } from 'taro-ui'
const api = require('../../../config/api.js');
import './login.scss'
class DyLogin extends Component {
  config: Config = {
    navigationBarTitleText: '店员登录'
  }
  static options = {
    addGlobalClass: true
  } 
  state = {
    phoneNo:'',
    passwd:'',
  }
  componentWillReceiveProps (nextProps) {
  }
  componentWillUnmount () {
  }
  componentWillMount(){    
  }
  componentDidShow () { 
  }
  componentDidHide () { }
  handleChange (key,e) {
    this.setState({
      [key]:e.detail.value
    })
    return e.detail.value;
  }
  login(){
    Taro.showLoading({
      title: '登录中',
    })
    Taro.request({
      url:api.opLoginPath+"?phone="+this.state.phoneNo+"&password="+this.state.passwd,
      method:"POST",
    }).then((res)=>{
      Taro.hideLoading();
      if(res.data.success){
        Taro.setStorageSync('dy_token',res.data.data.token);
        Taro.navigateTo({
          url: '/pages/dianyuan/home/home'
        })
      }else{
        Taro.showToast({
          title: res.data.errorInfo,
          icon: 'none',
          duration: 1500
        });
      }
    })
    
  }
  render () {
    return (
        <View className='index passwdlogin_box'>
            <AtForm>
            <View className='phone_box'>
                <View className='text'><Text className='star'>*</Text>手机号：</View>
                <Input className='input' type="number" name="input" value={this.state.phoneNo} onInput={this.handleChange.bind(this,'phoneNo')} placeholder="请输入手机号" />              
                {/* <Text className='get_code_btn' onClick={this.getCodeFn}>{this.state.getText}</Text> */}
            </View>
            <View className='phone_box code_box'>
                <View className='text'><Text className='star'>*</Text>密&emsp;码：</View>
                
                <Input className='input' type="number" password={true} name="input" value={this.state.passwd} onInput={this.handleChange.bind(this,'passwd')} placeholder="请输入登录密码" />
            </View>
            <View className='get_card'>
                <Button className='btn' onClick={this.login.bind(this)}>登录</Button>
            </View>
            </AtForm>
        </View>
    )
  }
}

export default DyLogin as ComponentClass
