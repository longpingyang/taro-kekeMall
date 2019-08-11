import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View,Image,Text,Picker, Button } from '@tarojs/components'
import './qiandao.scss'
const api = require('../../../config/api.js');

class DyQianDao extends Component {
  config: Config = {
    navigationBarTitleText: '签到'
  }
  static options = {
    addGlobalClass: true
  } 
  state={
    addressList:[],
    nowDate:'',
    shopIndex:0,
    shopSelector:[{shopId:1,name:"成都自营店"}],

  }

  getNowDateFn(){
    var date= new Date();
    var year = date.getFullYear();
    var month = (date.getMonth()+1)>=10?(date.getMonth()+1):'0'+(date.getMonth()+1);
    var day = date.getDate()>=10?date.getDate():'0'+date.getDate();
    var hours = date.getHours()>=10?date.getHours():'0'+date.getHours();
    var minutes = date.getMinutes()>=10?date.getMinutes():'0'+date.getMinutes();
    var seconds = date.getSeconds()>=10?date.getSeconds():'0'+date.getSeconds();
    var dateTxt = year+'-'+month+'-'+day+' '+hours+':'+minutes+':'+seconds;
    this.setState({
      nowDate: dateTxt
    });
    
    setInterval(()=>{
      var date= new Date();
      var year = date.getFullYear();
      var month = (date.getMonth()+1)>=10?(date.getMonth()+1):'0'+(date.getMonth()+1);
      var day = date.getDate()>=10?date.getDate():'0'+date.getDate();
      var hours = date.getHours()>=10?date.getHours():'0'+date.getHours();
      var minutes = date.getMinutes()>=10?date.getMinutes():'0'+date.getMinutes();
      var seconds = date.getSeconds()>=10?date.getSeconds():'0'+date.getSeconds();
      var dateTxt = year+'-'+month+'-'+day+' '+hours+':'+minutes+':'+seconds;
      this.setState({
        nowDate: dateTxt
      })
    },1000)
  }



  componentWillReceiveProps (nextProps) {
  }
  componentWillUnmount () {
  }
  componentWillMount(){    
  }
  componentDidShow () { 
    // this.setState({
    //   userInfo: Taro.getStorageSync("userMember")
    // }) 
    this.getNowDateFn()
    Taro.request({
      url:api.shopListPath,
      method:'POST',
      header:{
        token:Taro.getStorageSync('token')
      }
    }).then((res) =>{
      if(res.data.success){ 
        // console.log(res.data.data);
        this.setState({
          shopSelector:res.data.data
        })
      } 
    })
  }
  //选择门店
  onShopChange = e => {
    this.setState({
      shopIndex: e.detail.value
    })
  }
  componentDidHide () { }

  //
  signFn(){
    Taro.request({
      url:api.opSignPath,
      method:'POST',
      data:{
        token:Taro.getStorageSync('dy_token'),
        shopId:this.state.shopSelector[this.state.shopIndex].shopId
      }      
    }).then((res) =>{
      if(res.data.success){ 
        Taro.showToast({
          title: '签到成功',
          icon: 'none',
          duration: 1500
        });
      } 
    })
  }

  render () {
    const {nowDate} = this.state;
    return (
      <View className='dy_box QianDao_box'>
        {/* <Image className='bg_box' mode='scaleToFill' src='http://www.kknx6.com/demo/opr/dy_qiandao.jpg'></Image> */}
        <View className="QD_top">
          <View className="line">
            <Text className='text'>签到人：张三</Text>
          </View>
          <View className="line">
            <Picker mode='selector' value={this.state.shopIndex} range={this.state.shopSelector}  range-key="name" onChange={this.onShopChange}>
              <View className='picker'>
                <Text className='text'>签到门店：</Text>{this.state.shopSelector[this.state.shopIndex].name}
              </View>
            </Picker>
          </View>
          <View className="line">
            <Text className='text'>签到时间：{nowDate}</Text>
          </View>
          <View className="line">
            <Button className='btn' onClick={this.signFn.bind(this)}>签到</Button>
          </View>
        </View>

        <View className="QD_body">
          <View className="list_title">
            <Text className='text'>日期</Text>
            <Text className='text'>签到时间</Text>
          </View>
          <View className="list_box">
            <View className="item">
              <Text className='text'>2019-07-28 10:10:10</Text>
              <Text className='text'>已签到</Text>
            </View>
            <View className="item">
              <Text className='text'>2019-07-28 10:10:10</Text>
              <Text className='text'>已签到</Text>
            </View>
            <View className="item">
              <Text className='text'>2019-07-28 10:10:10</Text>
              <Text className='text'>已签到</Text>
            </View>
          </View>
        </View>


      </View>
    )
  }
}

export default DyQianDao as ComponentClass
