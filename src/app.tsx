import '@tarojs/async-await'
import Taro, { Component, Config } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'

import Index from './pages/index'

import configStore from './store'

import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore()

class App extends Component {
  
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      "pages/index/index",
      "pages/goods/goods",
      "pages/goods/details/details",
      "pages/goods/evaluation/evaluationList",
      "pages/card/card",
      "pages/card/input_tel/input_tel",
      "pages/card/details/cardDetails",
      "pages/cart/cart",
      "pages/cart/ordercreate/ordercreate",
      "pages/cart/rechargeGiveShoe/rechargeGiveShoe",
      "pages/user/user",
      "pages/user/userInfo/userInfo",
      "pages/user/couponList/couponList",
      "pages/user/amount/amount",
      "pages/user/login/login",
      "pages/user/point/point",
      "pages/logs/logs",
      "pages/order/order",
      "pages/order/details/details",
      "pages/address/list/list",
      "pages/address/edit/edit",
      "pages/dianyuan/home/home",
      "pages/dianyuan/addHy/addHy",
      "pages/dianyuan/daifa/daifa",
      "pages/dianyuan/msg/msg",
      "pages/dianyuan/order/order",
      "pages/dianyuan/qiandao/qiandao",
      "pages/dianyuan/tongji/tongji",
      "pages/dianyuan/minehuiyuan/minehuiyuan",
      "pages/dianyuan/minehuiyuan/hybq/hybq",
      "pages/dianyuan/minehuiyuan/hylist/hylist",
      "pages/dianyuan/minehuiyuan/hyfx/hyfx",
      "pages/dianyuan/minehuiyuan/hysr/hysr",

      "pages/pintuan/pintuan",
      "pages/kanjia/kanjia",
      "pages/zixun/zixun"
    ],
    window: {
      "backgroundTextStyle": "dark",
      "enablePullDownRefresh": true,
      "navigationBarBackgroundColor": "#f5f5f5",
      "navigationBarTitleText": "kk商城",
      "navigationBarTextStyle": "black"
    },
    tabBar: {
      list: [
        {
          "pagePath": "pages/index/index",
          "text": "首页",
          "iconPath": "./images/footer/index-4.png",
          "selectedIconPath": "./images/footer/index-3.png"
        },
        {
          "pagePath": "pages/goods/goods",
          "text": "全部商品",
          "iconPath": "./images/footer/yuyue-4.png",
          "selectedIconPath": "./images/footer/yuyue-3.png"
        },
        {
          "pagePath": "pages/card/card",
          "text": "会员卡",
          "iconPath": "./images/footer/video-4.png",
          "selectedIconPath": "./images/footer/video-3.png"
        },
        {
          "pagePath": "pages/cart/cart",
          "text": "购物车",
          "iconPath": "./images/footer/cart-4.png",
          "selectedIconPath": "./images/footer/cart-3.png"
        },
        {
          "pagePath": "pages/user/user",
          "text": "我的",
          "iconPath": "./images/footer/my-4.png",
          "selectedIconPath": "./images/footer/my-3.png"
        }
      ]
    }
  }

  componentDidMount () {}
  componentDidShow () {}
  componentDidHide () {}
  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
