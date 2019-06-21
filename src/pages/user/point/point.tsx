import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'

const api = require('../../../config/api.js');

import './point.scss'
class Point extends Component {
    /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '积分明显'
  }
  static options = {
    addGlobalClass: true
  } 

  componentWillReceiveProps (nextProps) {
  }

  componentWillUnmount () {
  }
  componentWillMount(){    
  }

  componentDidShow () { 
    this.setState({
      userInfo: Taro.getStorageSync("userMember")
    }) 
    this.getScoreLogList();
  }

  componentDidHide () { }

  state = {
    userInfo:{
      avatarUrl:'',
      nickName:''
    },
    scoreLogList:[],
    scoreLogListlen:0
  }
  getScoreLogList(){
    Taro.request({
      url:api.memberScoreLoglistPath,
      method:"POST",
      data:{
        "pageNo": 1,
        "pageSize": 10
      },
      header:{
        token:Taro.getStorageSync('token')
      }      
    }).then((res) =>{
      if(res.data.success){
        this.setState({
          scoreLogList:res.data.data,
          scoreLogListlen:res.data.data.length
        })
      }else{
        if(res.data.errorCode=='E401'){
          Taro.setStorageSync('userMember',null);
          Taro.navigateTo({
            url: '/pages/user/login/login'
          })
        }
      }
    })
  }
 
  render () {
    const { scoreLogList,scoreLogListlen,userInfo} = this.state;
    return (
    <View className="integral-detail">
        <View className="integral-header">
            <View className="apoint-wrap">
                <View className="svg-wrap" style="background-image: linear-gradient(0deg, rgb(241, 45, 34) 1%, rgb(255, 255, 255) 100%);">
                    <View  className="iconfont icon-dicengtoumingdu theme-color"></View>
                    <View  className="iconfont icon-zhongjiancengtoumingdu theme-color"></View>
                    <View  className="iconfont icon-dingcengtoumingdu theme-color"></View>
                </View>
                <View className="header-point flex flex-center">
                {userInfo.scoreCount}
                </View>
                <a className="header-desc line-height1 color333 font26"></a>
            </View>
            <View className="wrap-integral-nav flex flex-v-center font32 border-bottom-1px">
                <View  className="integral-nav border-right-1px flex flex-center">
                    <View className="iconfont icon-jifenshangcheng theme-color"></View>积分商城
                </View>
                <View className="integral-nav flex flex-center">
                    <View className="iconfont icon-duihuanjilu theme-color"></View>兑换记录
                </View>
            </View>
            <View className="integral-title font30 color666">
                积分明细
                <View className="text-icon theme-bgc"></View>
            </View>
        </View>
        <View className="integral-record-wrap">
            {
              scoreLogList.map((item) =>{
                return (
                  <View hidden={item.actionScore==0 || item.actionScore==null} className='logList_item' key={item.ctime}>
                      <View className='log_type'>
                        {
                          item.action==4 && <Text className='log_typetxt'>获取积分</Text>
                        }
                        {
                          item.action==5 && <Text className='log_typetxt'>消费积分</Text>
                        }
                        {
                          (item.action!=5 && item.action!=4) && <Text className='log_typetxt'>其他</Text>
                        }
                        <Text className='log_time'>{item.ctime}</Text>
                      </View>
                      <View className='changeInfo'>
                        <Text className='change'>{item.action==1?'-':'+'}￥{item.actionScore}</Text>
                        <Text className='changeAfter'>总积分：{item.accountScore}</Text>
                      </View>
                    </View>
                )
              })
            }
        </View>
        {
          scoreLogListlen==0 &&<View className="ap-no-record color-9 font26">没有产生积分记录哦~</View>
        }   
        
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

export default Point as ComponentClass
