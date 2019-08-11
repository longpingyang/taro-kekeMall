import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View,Image,Input,Text } from '@tarojs/components'
import './hylist.scss'
const api = require('../../../../config/api.js');
class Dyhylist extends Component {
  config: Config = {
    navigationBarTitleText: '会员列表'
  }
  static options = {
    addGlobalClass: true
  } 
  state = {
    memberList:[]
  }
  componentWillReceiveProps (nextProps) {
  }
  componentWillUnmount () {
  }
  componentWillMount(){    
  }
  componentDidShow () { 
    Taro.request({
      url:api.opMemberPath+"?token="+Taro.getStorageSync('dy_token'),
      method:'POST',
    }).then((res) =>{
      if(res.data.success){ 
        // console.log(res.data.data);
        this.setState({
          memberList:res.data.data
        })
      } 
    })
  }
  componentDidHide () { }
  render () {
    return (
      <View className='zitiShop_box'>
        <View className="mention-list-header flex bkg-white" >
            <View className="mention-list-header-search flex1 flex flex-v-center">
                <View className="iconfont icon-sousuo"></View>
                <Input className="flex1" type="text" placeholder="输入搜索关键词" value=""></Input>
            </View>
        </View>
        <View className="hyList_box">
            {
              this.state.memberList.map((item,index) =>{
                return (
                  <View className="hyList-item bkg-white" key={index}>
                    <Image className='headImg' src={item['headUrl']}></Image>
                    <View className='right_con flex1'>
                      <Text className='text font24'>{item['nickname']}</Text>
                      <Text className='text font24'>{item['cardNo']}</Text>
                    </View>
                  </View>
                )
              })
            }
            <View className="no-more">没有更多了~</View>
        </View>
      </View>
    )
  }
}

export default Dyhylist as ComponentClass
