import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View,  Text, Icon, Image, Input, ScrollView } from '@tarojs/components'
import { AtDrawer } from 'taro-ui'

import './filterModel.scss'



class FilterModel extends Component {
    /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  static options = {
    addGlobalClass: true
  }
  config: Config = {
    navigationBarTitleText: '筛选'    
  }
  
  

  componentWillReceiveProps (nextProps) {
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }
  state = {
    show: false,
    filterModel:false,
    posts: [
      { id:1,imgurl: '../../images/goods/1.jpg', title: '气质白气质白色连衣裙气质白色连衣裙色连衣裙', lump:1},
      { id:2,imgurl: '../../images/goods/7.jpg', title: '气质白气质白色连衣衣衣衣裙气质白色连衣裙色连衣裙', lump: 2 },
      { id:3,imgurl: '../../images/goods/1.jpg', title: '气质白气质白色连衣裙气质白色连衣裙色连衣裙', lump: 1 },
      { id:4,imgurl: '../../images/goods/7.jpg', title: '气质白气质白色连衣裙气质白色连衣裙色连衣裙', lump: 3 },
      { id:5,imgurl: '../../images/goods/1.jpg', title: '气质白色连衣裙', lump: 2 },
      { id:6,imgurl: '../../images/goods/7.jpg', title: '气质白色连衣裙', lump: 1 }
    ]
  }
  render () {
      return (
        <View className="mask_wrap no-keyboard filterShow">
            <View className="mask-wrap-content iphoneX">
                <View className="interval-price">价格区间</View>
                <View className="price-wrap flex">
                    <View id="fieldWrap" className="field-wrap">
                        <View className="number-conatiner">
                            <View className="number-wrap">
                                <View className="number__input lowPrice">
                                    {/* <View className="number__placeholder price-input__placeholder">最高价格</View>
                                    <View className="number__cursor theme-bgc"></View> */}
                                    <Input className="number__placeholder price-input__placeholder" type='number' placeholder='最低价格'></Input>
                                </View>
                            </View>
                        </View>
                        <View className="divider"></View>
                        <View className="number-conatiner">
                            <View className="number-wrap">
                                <View className="number__input lowPrice">
                                    {/* <View className="number__placeholder price-input__placeholder">最高价格</View>
                                    <View className="number__cursor theme-bgc"></View> */}
                                    <Input className="number__placeholder price-input__placeholder" type='number' placeholder='最低价格'></Input>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View className="classfiy">
                    <View className="classfiy-list">
                        <View className="recommended">
                            <View className="prop-title text-line-1">属性测试</View>
                            <View className="save-block theme-color"></View>
                        </View>
                        <View className="filter-wrap flex">
                            <View className="property color333">测试1</View>
                            <View className="property color333">测试2</View>
                            <View className="property color333">测试3</View>
                        </View>
                    </View>
                </View>
            </View>
            <View className="flex menu-btn iphoneX">
                <View className="reset theme-bgcart">重置</View>
                <View className="sure theme-bgc">确定</View>
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

export default FilterModel as ComponentClass
