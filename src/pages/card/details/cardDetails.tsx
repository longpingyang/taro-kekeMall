import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View,  Text,Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { add, minus, asyncAdd } from '../../../actions/counter'

import './cardDetails.scss'

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

interface CardDetails {
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
class CardDetails extends Component {

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

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }
  componentWillMount(){
    Taro.getStorage({key:'userInfo'}).then(rst => {   //从缓存中获取用户信息
      this.setState({
        userInfo: rst.data
      })
    })
  }
  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }
  
  state = {
    userInfo:{
      avatarUrl:''
    }
  }

  goUserInfoPage = () =>{
    //pages/card/input_tel/input_tel
    Taro.navigateTo({
      url: '/pages/user/userInfo/userInfo'
    })
  }
  render () {
    return (
      <View>
        <View className='top'>
          <Image className='big_image' src={this.state.userInfo.avatarUrl}></Image>
          {/* <View className='bg'></View> */}
          <Image className='small_image' onClick={this.goUserInfoPage} src={this.state.userInfo.avatarUrl}></Image>
        </View>
        <View className='top_bottom'>
          <View>积分：<Text>999</Text></View>
          <View>金币：<Text>999</Text></View>
          <View>储值：<Text>999</Text></View>
        </View>
        <View className='center_con'> 
          <View>
          <Text>特权说明</Text>
          享受优惠
          </View>
          <View>
          <Text>使用须知</Text>
          享受优惠
          </View>
          <View>
          <Text>客服电话</Text>
          享受优惠
          </View>
          <View>
          <Text>有效期</Text>
          永久有效
          </View>
          <View>
          <Text>有效期</Text>
          永久有效
          </View>
          <View>
          <Text>有效期</Text>
          永久有效
          </View>
          <View>
          <Text>有效期</Text>
          永久有效
          </View>
          <View>
          <Text>有效期</Text>
          永久有效
          </View>
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

export default CardDetails as ComponentClass<PageOwnProps, PageState>
