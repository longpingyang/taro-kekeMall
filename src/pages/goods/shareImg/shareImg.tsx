import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View,Image,Button } from '@tarojs/components'
import './shareImg.scss'
const api = require('../../../config/api.js');
class ShareImg extends Component {
  config: Config = {
    navigationBarTitleText: '分享商品'
  }
  static options = {
    addGlobalClass: true
  } 
  state = {
      ImgUrl:''
  }
  componentWillReceiveProps (nextProps) {
  }
  componentWillUnmount () {
  }
  componentWillMount(){    
  }
  componentDidShow () { 
    Taro.showLoading({
        title: '生存中...',
    })
    Taro.request({
        url:api.siteShareGoodsPath+"?goodsId="+this.$router.params.id,
        method:"POST",
        header:{
            token:Taro.getStorageSync('token')
        }
      }).then(res =>{
        Taro.hideLoading();
        if(res.data.success){
            this.setState({
                ImgUrl:res.data.data
            })
        }
      })
  }
  saveImg(url){
    Taro.getSetting({
        success(res){
            if (!res.authSetting['scope.writePhotosAlbum']) {
                Taro.authorize({
                    scope: 'scope.writePhotosAlbum',
                    success(){
                        Taro.downloadFile({
                            url:url,
                            success:function(res){
                              let path = res.tempFilePath
                              Taro.saveImageToPhotosAlbum({
                                filePath: path,
                                success(res) {
                                }
                              })
                            },fail:function(res){
                            }
                        })
                    }
                })
            }else{
                Taro.downloadFile({
                    url:url,
                    success:function(res){
                      let path = res.tempFilePath
                      Taro.saveImageToPhotosAlbum({
                        filePath: path,
                        success(res) {
                        }
                      })
                    },fail:function(res){
                    }
                })
            }
        }
    })
  }
  componentDidHide () { }
  render () {
    return (
        <View className='shareImg_box'>
            <Image className='shareImg' mode='scaleToFill' src={api.baseUrl+this.state.ImgUrl}></Image>
            {/* <Image className='shareImg' mode='scaleToFill' src='http://www.kknx6.com/demo/opr/dy_tongji.jpg'></Image> */}
            <View className='get_card'>
              <Button className='btn' onClick={this.saveImg.bind(this,api.baseUrl+this.state.ImgUrl)}>保存</Button>
            </View>
        </View>
    )
  }
}

export default ShareImg as ComponentClass
