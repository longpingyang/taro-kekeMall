import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button,Icon, Text, Image, Input } from '@tarojs/components'
import './invocePage.scss'

class InvocePage extends Component {
  config: Config = {
    navigationBarTitleText: '发票信息'
  }  
  static options = {
    addGlobalClass: true
  }
  state={
    isCompany:false
  }
  changeInvoceType(index){
      if(index==1){
        this.setState({
            isCompany:true
        })
      }else{
        this.setState({
            isCompany:false
        })
      }
      
  }

  render () {    
    return (
        <View className="invocePageWrap iphoneX visible">
        <View className="address-list">
            <View className="invoceSelectWrap">
                <View className='h5'>发票类型</View>
                <View className="invoceSelect flex">
                    <Text className="sinvoceSelecttem text-line1 theme-color theme-bdc">电子普通发票</Text>
                </View>
            </View>
            <View className="invoceSelectWrap">
                <View className='h5'>发票抬头</View>
                <View className="invoceSelect flex">
                    <Text onClick={this.changeInvoceType.bind(this,1)} className={"sinvoceSelecttem text-line1 "+(this.state.isCompany?'theme-color theme-bdc':'')}>个人</Text>
                    <Text onClick={this.changeInvoceType.bind(this,2)} className={"sinvoceSelecttem text-line1 "+(this.state.isCompany?'':'theme-color theme-bdc')}>单位</Text>
                </View>
            </View>
            <View hidden={this.state.isCompany} className="invoceFieldWrap invoice-wrap">
                <View className="custom-form pr-32">
                    <View className="custom-form-item-wrap">
                        <View className="arrow-container">
                            <View className="item-group border-bottom-1px flex ">
                                <View className="arrow-wrap flex-v-center no-icon">
                                    <View className="flex0 group-wrap-tip">
                                        <Text className="group-tip text-line1 item-required">名称</Text>
                                    </View>
                                    <View className="group-wrap-input flex1">
                                        <Input type="text" placeholder="请输入名称" value="" ></Input>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View className="custom-form-item-wrap">
                        <View className="arrow-container">
                            <View className="item-group border-bottom-1px flex ">
                                <View className="arrow-wrap flex-v-center no-icon">
                                    <View className="flex0 group-wrap-tip">
                                        <Text className="group-tip text-line1 item-required">税号</Text>
                                    </View>
                                    <View className="group-wrap-input flex1">
                                        <Input type="text" placeholder="请输入税号" value=""></Input>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <View className="invoceFieldWrap invoice-wrap">
                <View className='h5'>收票人信息</View>
                <View className="custom-form pr-32">
                    <View className="custom-form-item-wrap">
                        <View className="arrow-container">
                            <View className="item-group border-bottom-1px flex ">
                                <View className="arrow-wrap flex-v-center no-icon">
                                    <View className="flex0 group-wrap-tip">
                                        <Text className="group-tip text-line1 item-required">收票人手机</Text>
                                    </View>
                                    <View className="group-wrap-input flex1">
                                        <Input type="number" placeholder="请输入收票人手机" value=""></Input>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View className="custom-form-item-wrap">
                        <View className="arrow-container">
                            <View className="item-group border-bottom-1px flex ">
                                <View className="arrow-wrap flex-v-center no-icon">
                                    <View className="flex0 group-wrap-tip">
                                        <Text className="group-tip text-line1 ">收票人邮箱</Text>
                                    </View>
                                    <View className="group-wrap-input flex1">
                                        <Input type="text" placeholder="请输入收票人邮箱" value=""></Input>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
        <View className="btn-invoce-wrap">
            <View className="invoce-btn theme-bgc">确定</View>
        </View>
    </View>
    )
  }
}
export default InvocePage as ComponentClass;