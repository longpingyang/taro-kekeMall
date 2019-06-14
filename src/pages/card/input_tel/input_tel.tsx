import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Form, Text,Input } from '@tarojs/components'

import { AtInput, AtForm } from 'taro-ui'
import './input_tel.scss'
const api = require('../../../config/api.js');
// #region 书写注意
// 
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion


class Index extends Component {

    /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
    config: Config = {
    navigationBarTitleText: '首页'
  }

  componentWillReceiveProps (nextProps) {
    
  }
  state = {
    phoneNo:'',
    getText:'获取验证码',
    code:'',
    passwd:"",
    getChange: true
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }
  getCodeFn () {
    var getChange = this.state.getChange
    var n = 59;
    var that = this;
    var phone = this.state.phoneNo;
    var user = Taro.getStorageSync('user');
    if (!(/^1[34578]\d{9}$/.test(phone))) {
      Taro.showToast({
        title: '手机号有误',
        icon: 'none',
        duration: 2000
      })
    } else {
      if (getChange) {
        this.setState({
          getChange: false
        })
        var time = setInterval(function () {
          var str = '(' + n + ')' + '重新获取'
          that.setState({
            getText: str
          })
          if (n <= 0) {
            that.setState({
              getChange: true,
              getText: '重新获取'
            })
            clearInterval(time);
          }
          n--;
        }, 1000);
        Taro.request({
          url: api.memberSendsmsPath,
          data: {
            phone: phone,
            bizType:1
          },
          method: 'POST',
          success: function (res) {
          }
        })
      }
    }
  }
  //立即激活
  activateFn(){
    if (this.state.code == '') {
      Taro.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    if (this.state.code.length != 6) {
      Taro.showToast({
        title: '验证码格式不对',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    Taro.showLoading({
      title: '激活中',
    })
    //激活
    Taro.request({
      url: api.memberBindcardPath,
      method: 'POST',
      data: {
        cardNo:'',
        wxOpenid:Taro.getStorageSync('wxOpenid'),
        passwd:'',
        shopId:'0',
        phone: this.state.phoneNo,
        smsCode: this.state.code
      },
      success: (res) => {
        Taro.hideLoading();
        Taro.navigateBack();
      }
    })
  }

  login(){
    Taro.showLoading({
      title: '登录中',
    })
    Taro.request({
      url:api.memberLoginPath,
      method:"POST",
      data:{
        passwd:this.state.passwd,
        phone:this.state.phoneNo,
        smsCode:""
      }
    }).then((res)=>{
      Taro.hideLoading();
      if(res.data.success){
        Taro.setStorageSync('token',res.data.data.token);
        Taro.setStorageSync('userMember',res.data.data.member);
        Taro.switchTab({
          url: '/pages/index/index'
        })
      }else{
        Taro.showToast({
          title: res.data.errorInfo,
          icon: 'none',
          duration: 2000
        });
      }
    })
  }


  handleChange (key,e) {
    this.setState({
      [key]:e.detail.value
    })
    return e.detail.value;
  }
  render () {
    return (
      <View className='index'>
        <AtForm>
          <View className='phone_box'>
            <Text className='text'>手机号</Text>
            <Text className='star'>*</Text>
            <Input className='input' type='text' name="input" value={this.state.phoneNo} onInput={this.handleChange.bind(this,'phoneNo')} placeholder="请输入手机号" />              
            <Text className='get_code_btn' onClick={this.getCodeFn}>{this.state.getText}</Text>
          </View>
          <View className='phone_box code_box'>
            <Text className='text'>验证码</Text>
            <Text className='star'>*</Text>
            <Input className='input' type='text' name="input" value={this.state.code} onInput={this.handleChange.bind(this,'code')} placeholder="请输入验证码" />
          </View>
          <View className='phone_box code_box'>
            <Text className='text'>密码</Text>
            <Text className='star'>*</Text>
            <Input className='input' type='text' name="input" value={this.state.passwd} onInput={this.handleChange.bind(this,'passwd')} placeholder="请输入密码" />
          </View>
          <View className='get_card'>
            {/* <Button className='btn' onClick={this.activateFn}>立即激活</Button> */}
            <Button className='btn' onClick={this.login}>登录</Button>
          </View>
        </AtForm>
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

export default Index as ComponentClass
