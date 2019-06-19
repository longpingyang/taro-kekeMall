import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Form, Text,Input,Picker } from '@tarojs/components'

const api = require('../../../config/api.js');
import { AtInput, AtForm } from 'taro-ui'
import './login.scss'
class Login extends Component {
    /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '登录/注册'
  }
  static options = {
    addGlobalClass: true
  } 

  componentWillReceiveProps (nextProps) {
  }

  componentWillUnmount () {
  }
  componentWillMount(){
    Taro.login({
      success:(res) =>{
        Taro.request({
          url:'https://api.weixin.qq.com/sns/jscode2session?appid=wxa4028bf5e14b501a&secret=cc66408d416e1152f7c6ee16abf25860&js_code=' + res.code,
          header:{
            'content-type':'json'
          },
          success:(data)=>{
            console.log("wxOpenid:"+data.data.openid);
            Taro.setStorage({key:'wxOpenid',data:data.data.openid})
            Taro.request({
              url:api.memberCheckPath,
              data:{
                wxOpenid:data.data.openid
              },
              method: 'POST',
              success:(obj) =>{
                if(obj.data.success){
                  if(obj.data.data.verifyResult){
                    Taro.request({
                      url:api.memberShopListPath,
                      method:"POST",
                      header:{
                        token:Taro.getStorageSync('token')
                      } 
                    }).then((res) =>{
                      if(res.data.success){
                        this.setState({
                          shopSelector:res.data.data
                        })
                      }
                    })
                  }
                  if(obj.data.data.memberSummary){
                    this.setState({
                      isCard:obj.data.data.verifyResult, //1新用户;2未登录;3已登录
                      cardNo:obj.data.data.memberSummary.cardNo
                    })
                  }else{
                    this.setState({
                      isCard:obj.data.data.verifyResult //1新用户;2未登录;3已登录
                    })
                  }
                  
                }
              }
            })
            
          }
        })

      }
    })  
  }
  componentDidShow () { }
  componentDidHide () { }

  state = {
    userInfo:{
      avatarUrl:'',
      nickName:''      
    },
    isCard:0,
    cardNo:"",
    phoneNo:'',
    shopSelector:[{shopId:1,name:"成都自营店"}],
    shopIndex:0,
    loginType:0,
    selectorCheckedName:"",
    getText:'获取验证码',
    code:'',
    passwd:"",
    getChange: true
  }

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
        smsCode:this.state.code,
        wxOpenid: Taro.getStorageSync('wxOpenid')
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
  //选择门店
  onShopChange = e => {
    this.setState({
      shopIndex: e.detail.value
    })
  }
  //注册
  registerFn(){
    Taro.request({
      url:api.memberBindcardPath,
      method:"POST",
      data:{
        "cardNo": this.state.cardNo,
        "password":this.state.passwd,
        "phone": this.state.phoneNo,
        "shopId": this.state.shopSelector[this.state.shopIndex].shopId ,
        "smsCode": this.state.code,
        "wxOpenid": Taro.getStorageSync('wxOpenid')
      },
      // header:{
      //   token:Taro.getStorageSync('token')
      // }
    }).then((res)=>{
      if(res.data.success){
        Taro.setStorageSync('token',res.data.data.token);
        Taro.setStorageSync('userMember',res.data.data.member);
        Taro.switchTab({
          url: '/pages/index/index'
        })
      }
    })
  }
  loginType(type){
    this.setState({
      loginType:type
    })
  }
  render () {
    return (
      <View className='login_page'>        
        <View className='index register_box' hidden={this.state.isCard==0 || this.state.isCard==2 || this.state.isCard==3}>
          <AtForm>
          <View className='phone_box'>
            <View className='text'><Text className='star'>*</Text>手机号：</View>
            
            <Input className='input' type="number" name="input" value={this.state.phoneNo} onInput={this.handleChange.bind(this,'phoneNo')} placeholder="请输入手机号" />              
            <Text className='get_code_btn' onClick={this.getCodeFn}>{this.state.getText}</Text>
          </View>
          <View className='phone_box code_box'>
            <View className='text'><Text className='star'>*</Text>验证码：</View>
            
            <Input className='input' type='text' name="input" value={this.state.code} onInput={this.handleChange.bind(this,'code')} placeholder="请输入验证码" />
          </View>
          <View className='phone_box code_box'>
            <View className='text'><Text className='star'>*</Text>密码：</View>
            
            <Input className='input' type='number' name="input" value={this.state.passwd} onInput={this.handleChange.bind(this,'passwd')} placeholder="请输入登录密码" />
          </View>
          {/* <View className='phone_box code_box'>
            <Text className='text'>确认密码</Text>
            <Text className='star'>*</Text>
            <Input className='input' type='number' name="input" value={this.state.passwd} onInput={this.handleChange.bind(this,'passwd')} placeholder="请输入密码" />
          </View> */}
          <View className="phone_box">
            <Picker mode='selector' value={this.state.shopIndex} range={this.state.shopSelector}  range-key="name" onChange={this.onShopChange}>
              <View className='picker'>
                <View className='text'><Text className='star'>*</Text>选择门店：</View>{this.state.shopSelector[this.state.shopIndex].name}
              </View>
            </Picker>
          </View>
          <View className='get_card'>
            <Button className='btn' onClick={this.registerFn.bind(this)}>注册</Button>
          </View>
          {/* <View className='get_card fast_login'>
            <Button className='btn'>微信一键登录</Button>
          </View> */}
        </AtForm>
        </View>
        <View className='loginType_box' hidden={this.state.isCard==0 ||this.state.isCard==1 || this.state.loginType==1 || this.state.loginType==2}>
          <View className='get_card'>
            <Button className='btn' onClick={this.loginType.bind(this,1)}>密 码  登 录</Button>
          </View>
          <View className='get_card fast_login'>
            <Button className='btn' onClick={this.loginType.bind(this,2)}>验证码登录</Button>
          </View>
        </View>
        <View className='index passwdlogin_box' hidden={this.state.loginType==0 || this.state.loginType==2}>
          <AtForm>
            <View className='phone_box'>
              <View className='text'><Text className='star'>*</Text>手机号</View>
              <Input className='input' type="number" name="input" value={this.state.phoneNo} onInput={this.handleChange.bind(this,'phoneNo')} placeholder="请输入手机号" />              
              {/* <Text className='get_code_btn' onClick={this.getCodeFn}>{this.state.getText}</Text> */}
            </View>
            <View className='phone_box code_box'>
              <View className='text'><Text className='star'>*</Text>密码</View>
              
              <Input className='input' type="number" password={true} name="input" value={this.state.passwd} onInput={this.handleChange.bind(this,'passwd')} placeholder="请输入登录密码" />
            </View>
            <View className='get_card'>
              <Button className='btn' onClick={this.login.bind(this)}>登录</Button>
            </View>
          </AtForm>
        </View>
        <View className='index code_box' hidden={this.state.loginType==0 || this.state.loginType==1}>
          <AtForm>
            <View className='phone_box'>
              <View className='text'><Text className='star'>*</Text>手机号</View>
              <Input className='input' type="number" name="input" value={this.state.phoneNo} onInput={this.handleChange.bind(this,'phoneNo')} placeholder="请输入手机号" />              
              <Text className='get_code_btn' onClick={this.getCodeFn}>{this.state.getText}</Text>
            </View>
            <View className='phone_box code_box'>
              <View className='text'><Text className='star'>*</Text>验证码</View>
              <Input className='input' type='text' name="input" value={this.state.code} onInput={this.handleChange.bind(this,'code')} placeholder="请输入验证码" />
            </View>
            <View className='get_card'>
              <Button className='btn' onClick={this.login.bind(this)}>登录</Button>
            </View>
          </AtForm>
        </View>
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

export default Login as ComponentClass
