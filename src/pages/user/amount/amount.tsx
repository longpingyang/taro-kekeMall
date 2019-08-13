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
    navigationBarTitleText: '余币明细'
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
    this.getMoneyLoglist() 
    if(this.$router.params.type && this.$router.params.type==1){
      this.setState({
        czType:this.$router.params.type,
        rule:JSON.parse(this.$router.params.rule)
      },()=>{
        this.OpenCz();
      })      
    }
    if(this.$router.params.type && this.$router.params.type==2){
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
      data:{
        "pageNo": 1,
        "pageSize": 20
      },
      header:{
        token:Taro.getStorageSync('token')
      }      
    }).then((res) =>{
      if(res.data.success){
        this.setState({
          moneyLogList:res.data.data,
          moneyLogListlen:res.data.data.length
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
  //充币按钮
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
    Taro.request({
      url:api.payPreorderPath,
      method:"POST",
      data:{
        type:1,
        totalPrice:this.state.czAmount,
        linkOrder:""
      },
      header:{
        token:Taro.getStorageSync('token')
      }
    }).then((res) =>{
      let that = this;
      if(res.data.success){
        let param = {};
        let arr=res.data.data.split("&"); //各个参数放到数组里
          for(var i=0;i < arr.length;i++){
              var num=arr[i].indexOf("=");
               if(num>0){
                  let name=arr[i].substring(0,num);
                  let value=arr[i].substr(num+1);
                  param[name]=value;
               }
          }
        Taro.requestPayment({
          timeStamp: param.timeStamp,
          nonceStr: param.nonceStr,
          package: "prepay_id="+param.prepay_id,
          signType: param.signType,
          paySign: param.paySign,
          success (res) {
            // Taro.request({
            //   url:api.payEndpayPath,
            //   method:"POST",
            //   header:{
            //     token:Taro.getStorageSync('token')
            //   }
            // }).then((res) =>{
            //   console.log(res);
            // }) 
            that.closefn();            
            that.getMoneyLoglist(); 
            that.getUserMember();
          },
          fail (res) {console.log(res); }
        })
      }
    })
  }
  getUserMember(){
    Taro.request({
      url:api.memberSummaryPath,
      method:"POST",
      header:{token:Taro.getStorageSync('token')}
    }).then((res)=>{
      if(res.data.success){
        Taro.setStorageSync('userMember',res.data.data);
        this.setState({
          userInfo: Taro.getStorageSync("userMember")
        })
      }
    })
  }



  selFastAmount(val){
    this.setState({
      czAmount:val,
      totalAmount:Math.floor(parseInt(val)/parseInt(this.state.rule.save))*parseInt(this.state.rule.give)+parseInt(val)
    },()=>{
      // this.recharge();
    })
  }
  closefn(){
    this.setState({
      isCzModal:false
    })
  }
 
  render () {
    const {moneyLogList,moneyLogListlen,userInfo} = this.state;
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
                    <View className="font56">¥{userInfo.moneyBalance}</View>
                </View>
            </View>
            <View className="integral-title font30 color666">
                余币明细
                <View className="text-icon theme-bgc"></View>
            </View>
        </View>
        <View className="amount-record-wrap">
            {
              this.state.moneyLogList.map((item) =>{
                return (
                    <View hidden={item.actionMoney==0 || item.actionMoney==null} className='logList_item' key={item.ctime}>
                      <View className='log_type'>
                        {
                          item.action==1 && <Text className='log_typetxt'>消费</Text>
                        }
                        {
                          item.action==2 && <Text className='log_typetxt'>充币</Text>
                        }
                        {
                          item.action==3 && <Text className='log_typetxt'>赠费</Text>
                        }
                        <Text className='log_time'>{item.ctime}</Text>
                      </View>
                      <View className='changeInfo'>
                        <Text className='change'>{item.action==1?'-':'+'}￥{item.actionMoney}</Text>
                        <Text className='changeAfter'>余币：{item.accountMoney}</Text>
                      </View>
                    </View>
                )
              })
              
            }
            {
              moneyLogListlen==0 &&<View className="ap-no-record color-9 font26 mr-t-dis">没有产生余币记录哦~</View>
            }            
            <View onClick={this.OpenCz} className="amount-charge-fixed flex fixIphonex">
                <View className="amount--btn half color-white theme-bgc font36">充币</View>
            </View>
        </View>

        <AtModal isOpened={this.state.isCzModal}>
          <AtModalHeader>
            {this.state.czType==0 && <Text>充币</Text>}
            {this.state.czType==1 && <Text>充币送钱</Text>}
            {this.state.czType==2 && <Text>充币送鞋</Text>}
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
                                          <Text className='text'>请输入充币金额：</Text>
                                          <View className='input_box'>
                                            <Text className='unit'>￥</Text>
                                            <Input className='input' type="digit" value={this.state.czAmount=="0"?"":this.state.czAmount} onInput={this.handleChange.bind(this,'czAmount')}></Input>
                                          </View>
                                        </View>
                                      </View>
            }
            {
              this.state.czType==1 && <View className='amountModalCon'>
                                        <View>充币规则：每充币{this.state.rule.save}送{this.state.rule.give},可以累计</View>
                                        <View className="FastAmount">
                                          <Text className='text' onClick={this.selFastAmount.bind(this,100)}>100</Text>
                                          <Text className='text' onClick={this.selFastAmount.bind(this,200)}>200</Text>
                                          <Text className='text' onClick={this.selFastAmount.bind(this,500)}>500</Text>
                                        </View>
                                        <View className='customAmount'>
                                          <Text className='text'>请输入充币金额：</Text>
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
                                          <Text className='text'>充币金额：</Text>
                                          <View className='input_box'>
                                            <Text className='unit'>￥</Text>
                                            <Input className='input' disabled type="digit" value={this.state.czAmount}></Input>
                                          </View>
                                        </View>
                                      </View>
            }
          </AtModalContent>
          <AtModalAction> 
            <Button onClick={this.closefn}>取消</Button>
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
