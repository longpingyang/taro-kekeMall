import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Text, Image } from '@tarojs/components'
import './evaluationList.scss'

// #region 书写注意
// 
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion


class Card extends Component {
    /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
    config: Config = {
    navigationBarTitleText: '评价列表'
  }

  componentDidShow () { }

  componentDidHide () { }
  render () {
    return (
        <View className="comments-page-container fixIphonex">
            <View className="comments-page-item">
                <View className="comment-page-header flex">
                    <View className="comment-page-user font30 color2 flex">
                        <Image className='image' src="https://image-c.weimobwmc.com/ec-uc/aaff7206d48949839c2d2fd5faacbea0.png"></Image>
                        <Text className='text'>这个世界真无奈</Text>
                    </View>
                    <View className="comment-page-date font24 color4">2018.12.17</View>
                </View>
                <View className="comment-page-text font28 color2">用户超时未评，系统自动好评。</View>
                <View className="comment-page-img-container flex"></View>
                <View className="comment-page-tag font24 color4">黑色/S</View>
            </View>
            <View className="comments-page-item">
                <View className="comment-page-header flex">
                    <View className="comment-page-user font30 color2 flex">
                        <Image className='image' src="https://image-c.weimobwmc.com/ec-uc/aaff7206d48949839c2d2fd5faacbea0.png"></Image>
                        <Text className='text'>这个世界真无奈</Text>
                    </View>
                    <View className="comment-page-date font24 color4">2018.12.17</View>
                </View>
                <View className="comment-page-text font28 color2">用户超时未评，系统自动好评。</View>
                <View className="comment-page-img-container flex"></View>
                <View className="comment-page-tag font24 color4">黑色/S</View>
            </View>
            <View className="comments-page-item">
                <View className="comment-page-header flex">
                    <View className="comment-page-user font30 color2 flex">
                        <Image className='image' src="http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLDg0jDuVoliaPfmib8uvZ2D7haO2FyQWeAAoweFvjvtYIQGAzvoyiayOsc8yqc4cC5mXzJ5pwXltibiaQ/132"></Image>
                        <Text className='text'>这个世界真无奈</Text>
                    </View>
                    <View className="comment-page-date font24 color4">2018.12.11</View>
                </View>
                <View className="comment-page-text font28 color2">不错</View>
                <View className="comment-page-img-container flex"></View>
                <View className="comment-page-tag font24 color4">黑色/M</View>
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

export default Card as ComponentClass
