import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View,Button,Input,Text } from '@tarojs/components'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"
const api = require('../../../config/api.js');

import './amount.scss'
class Amount extends Component {
    /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '余额明显'
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
    this.getMoneyLoglist() 
    if(this.$router.params.type && this.$router.params.type==1){
      // console.log(this.$router.params.rule)
      this.setState({
        czType:this.$router.params.type,
        rule:JSON.parse(this.$router.params.rule)
      },()=>{
        this.OpenCz();
      })      
    }
    if(this.$router.params.type && this.$router.params.type==2){
      // console.log(this.$router.params.rule)
      this.setState({
        czType:this.$router.params.type,
        czAmount:JSON.parse(this.$router.params.amount)
      },()=>{
        this.OpenCz();
      })      
    }

  }
  componentDidHide () { }
  state = {
    userInfo:{
      avatarUrl:'',
      nickName:''
    },
    isCzModal: false,
    czAmount:'0',
    czType:0,
    totalAmount:0,
    rule:{save:'',give:''},
    moneyLogList:[],
    moneyLogListlen:0
  }

  getMoneyLoglist(){
    Taro.request({
      url:api.memberMoneyLoglistPath,
      method:"POST",
      data:{},
      header:{
        token:Taro.getStorageSync('token')
      }      
    }).then((res) =>{
      if(res.data.success){
        this.setState({
          moneyLogList:res.data.data,
          moneyLogListlen:res.data.data.length
        })
      }
    })
  }
  //充值按钮
  OpenCz(){
    this.setState({
      isCzModal:true
    })
  }
  handleChange (key,e) {    
    if(this.state.czType==0){
      this.setState({
        [key]:e.detail.value
      })
      return e.detail.value;
    }
    else if(this.state.czType==1){
      let temp = '';
      if(e.detail.value!='')
      {
        temp = (Math.floor(parseInt(e.detail.value)/parseInt(this.state.rule.save))*parseInt(this.state.rule.give)+parseInt(e.detail.value)).toString();
      }


      this.setState({
        [key]:e.detail.value,
        totalAmount:temp
      })
      return e.detail.value;
    }
    
  }
  recharge(){
    console.log(this.state.czAmount);
    // this.setState({
    //   isCzModal:false
    // })
  }
  selFastAmount(val){
    this.setState({
      czAmount:val,
      totalAmount:Math.floor(parseInt(val)/parseInt(this.state.rule.save))*parseInt(this.state.rule.give)+parseInt(val)
    },()=>{
      this.recharge();
    })
  }

 
  render () {
    const {moneyLogList,moneyLogListlen} = this.state;
    return (
    <View className="integral-detail">
        <View className="integral-header">
            <View className="apoint-wrap">
                <View className="svg-wrap" style="background-image: linear-gradient(0deg, rgb(241, 45, 34) 1%, rgb(255, 255, 255) 100%);">
                    <View className="iconfont icon-dicengtoumingdu theme-color"></View>
                    <View className="iconfont icon-zhongjiancengtoumingdu theme-color"></View>
                    <View className="iconfont icon-dingcengtoumingdu theme-color"></View>
                </View>
                <View className="header-point flex flex-center">
                    <View className="font56">¥0.00</View>
                </View>
            </View>
            <View className="integral-title font30 color666">
                余额明细
                <View className="text-icon theme-bgc"></View>
            </View>
        </View>
        <View className="amount-record-wrap">
            <View></View>
            {
              moneyLogListlen==0 &&<View className="ap-no-record color-9 font26 mr-t-dis">没有产生余额记录哦~</View>
            }            
            <View onClick={this.OpenCz} className="amount-charge-fixed flex fixIphonex">
                <View className="amount--btn half color-white theme-bgc font36">充值</View>
            </View>
        </View>

        <AtModal isOpened={this.state.isCzModal}>
          <AtModalHeader>
            {this.state.czType==0 && <Text>充值</Text>}
            {this.state.czType==1 && <Text>充值送钱</Text>}
            {this.state.czType==2 && <Text>充值送鞋</Text>}
          </AtModalHeader>
          <AtModalContent>
            {
              this.state.czType==0 && <View className='amountModalCon'>
                                        <View className="FastAmount">
                                          <Text className='text' onClick={this.selFastAmount.bind(this,100)}>100</Text>
                                          <Text className='text' onClick={this.selFastAmount.bind(this,200)}>200</Text>
                                          <Text className='text' onClick={this.selFastAmount.bind(this,500)}>500</Text>
                                        </View>
                                        <View className='customAmount'>
                                          <Text className='text'>请输入充值金额：</Text>
                                          <View className='input_box'>
                                            <Text className='unit'>￥</Text>
                                            <Input className='input' type="digit" value={this.state.czAmount=="0"?"":this.state.czAmount} onInput={this.handleChange.bind(this,'czAmount')}></Input>
                                          </View>
                                        </View>
                                      </View>
            }
            {
              this.state.czType==1 && <View className='amountModalCon'>
                                        <View>充值规则：每充值{this.state.rule.save}送{this.state.rule.give},可以累计</View>
                                        <View className="FastAmount">
                                          <Text className='text' onClick={this.selFastAmount.bind(this,100)}>100</Text>
                                          <Text className='text' onClick={this.selFastAmount.bind(this,200)}>200</Text>
                                          <Text className='text' onClick={this.selFastAmount.bind(this,500)}>500</Text>
                                        </View>
                                        <View className='customAmount'>
                                          <Text className='text'>请输入充值金额：</Text>
                                          <View className='input_box'>
                                            <Text className='unit'>￥</Text>
                                            <Input className='input' type="digit" value={this.state.czAmount=="0"?"":this.state.czAmount} onInput={this.handleChange.bind(this,'czAmount')}></Input>
                                          </View>
                                        </View>
                                        <View className=''>
                                          实得金额：{this.state.totalAmount==0?'':this.state.totalAmount}
                                        </View>
                                      </View>
            }
            {
              this.state.czType==2 && <View className='amountModalCon'>                                        
                                        <View className='customAmount'>
                                          <Text className='text'>充值金额：</Text>
                                          <View className='input_box'>
                                            <Text className='unit'>￥</Text>
                                            <Input className='input' disabled type="digit" value={this.state.czAmount}></Input>
                                          </View>
                                        </View>
                                      </View>
            }
          </AtModalContent>
          <AtModalAction> 
            <Button>取消</Button>
            <Button onClick={this.recharge}>确定</Button> 
          </AtModalAction>
        </AtModal>

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

export default Amount as ComponentClass
