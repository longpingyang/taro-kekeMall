import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Input, Text,Button,Picker } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { add, minus, asyncAdd } from '../../../actions/counter'
const api = require('../../../config/api.js');
import './userInfo.scss'

// #region 书写注意
// 
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion

type PageStateProps = {
  counter: {
    num: number
  }
}

type PageDispatchProps = {
  add: () => void
  dec: () => void
  asyncAdd: () => any
}

type PageOwnProps = {}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  add () {
    dispatch(add())
  },
  dec () {
    dispatch(minus())
  },
  asyncAdd () {
    dispatch(asyncAdd())
  }
}))
class Index extends Component {

    /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
    config: Config = {
    navigationBarTitleText: '个人信息'
  }
  state ={
    userInfo:{
      memberId:"",
      headUrl:'',
      nickName:'',
      phone:'',
      trueName:"",
      birthday:""
    }
  }

  componentWillReceiveProps (nextProps) {
    
  }
  componentWillMount(){
    // Taro.getStorage({key:'userInfo'}).then(rst => {   //从缓存中获取用户信息
    //   this.setState({
    //     userInfo: rst.data
    //   })
    // })
  }
  componentWillUnmount () { }

  componentDidShow () {
    let info = Taro.getStorageSync("userMember");
    this.setState((data) =>{
      data['userInfo'].headUrl = info.headUrl;
      data['userInfo'].nickName = info.nickName;
      data['userInfo'].memberId = info.memberId;
    })

  }

  componentDidHide () { }
  changeHeadImgFn(){
    Taro.chooseImage({
      count:1,
      success: (res)=> {
        // this.state.userInfo.headUrl = res.tempFilePaths[0];
        // this.setState({
        //   userInfo: this.state.userInfo
        // })
        this.setState((data) =>{
          data['userInfo'].headUrl = res.tempFilePaths[0];
        })
      },
    })
  }
  logoutFn(){
    Taro.setStorageSync("userMember",null);
    Taro.setStorageSync("token",null);
    Taro.navigateTo({
      url: '/pages/user/login/login'
    })
  }
  //保存用户信息
  saveMember(){
    Taro.request({
      url:api.memberSavedetailPath,
      method:"POST",
      data:{
        "birthday": this.state.userInfo.birthday,
        "headUrl": this.state.userInfo.headUrl,
        "memberId": this.state.userInfo['memberId'],
        "nickname": this.state.userInfo.nickName,
        "phone": this.state.userInfo.phone,
        "trueName": this.state.userInfo.trueName
      },
      header:{
        token:Taro.getStorageSync('token')
      }
    }).then((res)=>{
      if(res.data.success){
        Taro.showToast({
          title: '保存成功',
          icon: 'none',
          duration: 1500
        });
      }
    })
  }
  handleChange (key,e) {
    this.setState((data)=>{      
      data['userInfo'][key]= e.detail.value;
    })
    return e.detail.value;
  }

  render () {
    return (
      <View className='userInfo'>
        <View className='phone_box headImg'>
          <View className='text'>我的头像</View>
          <Image onClick={this.changeHeadImgFn} src={this.state.userInfo.headUrl}></Image>
        </View>
        <View className="phone_box">
          <View className='text'>我的昵称：</View>
          <Input className='input' placeholder="请输入昵称" value={this.state.userInfo.nickName} onInput={this.handleChange.bind(this,'nickName')}></Input>
        </View>
        <View className="phone_box">
          <View className='text'>真实姓名：</View>
          <Input className='input' placeholder="请输入真实姓名" value={this.state.userInfo.trueName} onInput={this.handleChange.bind(this,'trueName')}></Input>
        </View>
        <View className="phone_box">
          <Text></Text>
          <View className='text'>手机号：</View>
          <Input className='input' placeholder="请输入手机号" value={this.state.userInfo.phone} onInput={this.handleChange.bind(this,'phone')}></Input>
        </View>
        <View className="phone_box">
          <Picker mode='date' onChange={this.handleChange.bind(this,'birthday')}>
            <View className='picker'>
              <View className='text'>生日：</View>{this.state.userInfo.birthday}
            </View>
          </Picker>
          {/* <Input value={this.state.userInfo.birthday} onInput={this.handleChange.bind(this,'birthday')}></Input> */}
        </View>
        <View className="save_box">
          <Button onClick={this.saveMember.bind(this)} className='btn-max-w' type='primary'>保存</Button>
        </View>
        <View className="logout_box">
          <Button onClick={this.logoutFn} className='btn-max-w' type='primary'>退出登录</Button>
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

export default Index as ComponentClass<PageOwnProps, PageState>
