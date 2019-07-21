import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Button, Swiper, SwiperItem, Radio, RadioGroup, Text } from '@tarojs/components'

import { AtFloatLayout } from "taro-ui"

// import SkuModal from './skuModal/skuModal'
import CouponsModal from './couponsModal/couponsModal'

import headImg from '../../../images/goods/1.jpg';

import './details.scss'
const api = require('../../../config/api.js');

class Index extends Component {

    /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
    config: Config = {
    navigationBarTitleText: '商品详情'
  }
  state = {
    goodsId:'',
    goodsDetail: {},
    background: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    items: [
      { name: '0', value: '商家配送', checked: true },
      { name: '1', value: '到店自提' }
    ],
    couponsModalShow: false,
    couponlist:[],
    skuModalShow:false,
    skuData: [],
    buyType:1,//购买类型1是立即购买 2 加入购物车 3 充值购买
    buyParam:{
      "colorId": "",
      "count": '1',
      "goodsId": "",
      "sizeId": ""
    },
    selText:'请选择',
    selArrtText:[],
    shareModalIsShow: false
  }

  componentWillReceiveProps (nextProps) {
  }
  componentWillMount(){
      this.getDoodsDetails();
  }
  componentWillUnmount () { }

  componentDidShow () {

  }
  getDoodsDetails(){
    Taro.request({
      url:api.goodsDetailPath,
      method:'POST',
      data:{
        goodsId:this.$router.params.id
      },
      header:{
        token:Taro.getStorageSync('token')
      }
    }).then((res)=>{
      if(res.data.success){
        let colorArr:any = [];
        res.data.data.colorList.forEach(element => {
          colorArr.push({'key':element.colorId,'value':element.name})
        });
        let sizeArr:any = [];
        res.data.data.sizeList.forEach(element => {
          sizeArr.push({'key':element.sizeId,'value':element.name})
        });   
        //优惠券 信息筛选
        let tempList=Taro.getStorageSync('allCouponList');        
        let tempArr = [];
        tempList.forEach(element => {
            tempArr=[...tempArr,...element.coupons];
        });
        let couponlist=[];
        tempArr.forEach(ele => {
          if(ele.isGoods==1){
            if(ele.goodsId.indexOf(this.$router.params.id)>-1){
              couponlist.push(ele);
            }        
          }else{
            couponlist.push(ele);
          }
        });    
        this.setState({
          couponlist:couponlist,
          goodsDetail:res.data.data,
          goodsId:this.$router.params.id,
          selArrtText:['颜色','尺码'],
          buyParam:{
            ...this.state.buyParam,
            goodsId:this.state.goodsId
          },
          background:JSON.parse(res.data.data.picList),
          skuData:[
            {
              id:1,
              "name": "颜色",
              "attrValueList":colorArr
            },
            {
              id:2,
              "name": "尺码",
              "attrValueList":sizeArr
            }
          ]
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

  componentDidHide () { }

  addCartFn(){
    this.setState((data)=>{
      data['skuModalShow']=true;
      data['couponsModalShow']=false;
      data['buyType']=2;
    },()=>{
    })
  }

  checkedAttr(pindex,sIndex,value){
        this.setState((data) =>{            
            data['skuData'][pindex].attrValueList.forEach(element => {
                element['checked']=false;
            });
            data['skuData'][pindex].attrValueList[sIndex]['checked']=true;
            data['selText']='已选择';
            data['selArrtText'][pindex]=data['skuData'][pindex].attrValueList[sIndex].value;
            if(pindex==0){
                data['buyParam'].colorId=value;
            }else{
                data['buyParam'].sizeId=value;
            }


        })
    }
    editCartCount(type){
        if(type=='jian'){
          if(parseInt(this.state.buyParam.count)>1){
            this.setState((preState)=>{
                preState['buyParam'].count=(parseInt(this.state.buyParam.count)-1).toString();
            })
          }
        }else{
            this.setState((preState)=>{
                preState['buyParam'].count=(parseInt(this.state.buyParam.count)+1).toString();
            })
        }
  }
  saveParam(){
    if(this.state.buyType==3){
      Taro.setStorageSync("orderCreate",{goodsList:[{
        "colorId": this.state.buyParam.colorId,
        "colorName":"",
        "count": this.state.buyParam.count,
        "goodsId": this.state.goodsId,
        "sizeId": this.state.buyParam.sizeId,
        "sizeName":"",
        "mainPic":this.state.background[0],
        "price":this.state.goodsDetail.price
      }],amount:this.state.goodsDetail.price,saveTimes:5,basePrice:50});
      Taro.navigateTo({
        url: '/pages/cart/ordercreate/ordercreate?orderType=5'
      })
    }else{
      Taro.request({
          url:api.orderShopcartSavePath,
          method:"POST",
          data:{
              "colorId": this.state.buyParam.colorId,
              "count": this.state.buyParam.count,
              "goodsId": this.state.goodsId,
              "sizeId": this.state.buyParam.sizeId
          },
          header:{
              token:Taro.getStorageSync('token')
          }
      }).then((res)=>{
          Taro.showToast({
              title: '添加成功',
              icon: 'none',
              duration: 1500
          });
          Taro.switchTab({
              url: '/pages/cart/cart'
          })
      })
    }
  }

  buyNowFn(){
    this.setState({
      skuModalShow:true,
      couponsModalShow:false,
      buyType:1
    })
  }

  buyRechargeFn(){
    this.setState({
      skuModalShow:true,
      couponsModalShow:false,
      buyType:3
    })
    
  }


  //选择的参数
  getskudata(data){
  }


  //更多优惠卷
  couponsMoreFn(){   
    this.setState({
      skuModalShow:false,
      couponsModalShow: true
    })
  }

  evaluationListPage(){
    Taro.navigateTo({
      url: '/pages/goods/evaluation/evaluationList'
    })
  }
  //商品页面
  goGoodsPageFn(){
    Taro.switchTab({
      url: '/pages/goods/goods'
    })
  }
  //我的 
  goMinePageFn(){
    Taro.switchTab({
      url: '/pages/user/user'
    })
  }
  //购物车
  goCartPage(){
    Taro.switchTab({
      url: '/pages/cart/cart'
    })
  }
  //首页
  goIndexPage(){
    Taro.switchTab({
      url: '/pages/index/index'
    })
  }
  //分享
  openShareModalFn(){
    this.setState({
      shareModalIsShow: true
    })
  }
  closeShareModalFn(){
    this.setState({
      shareModalIsShow: false
    })
  }
  //
  shareToFriendFn(){

  }
  render () {
    const {skuData,couponlist} =this.state;
    console.log(couponlist);
    return (
      <View className='goods_details_page'>
        {/* <button open-type='share'>分享</button> */}
        <View className="share_btn" onClick={this.openShareModalFn.bind(this)}>分享</View>
        <View className="goods_detail_box">
            <View className="goodsImg_box">        
                <Swiper
                    indicator-dots={this.state.indicatorDots} autoplay={this.state.autoplay} circular={this.state.circular} vertical={this.state.vertical}
                    interval={this.state.interval} duration={this.state.duration} previous-margin={this.state.previousMargin+'px'} next-margin={this.state.nextMargin+'px'}>
                    {
                        this.state.background.map((item,index)=>{
                            return (
                            <SwiperItem key={item}>
                                <Image mode='center' src={item}></Image>
                            </SwiperItem>)
                        })
                    }
                </Swiper>
            </View>
            <View className='goodsTitle_box'>
            <Text>{this.state.goodsDetail.goodsName}</Text>
            </View>
            <View className='goodsPrice_box'>
            <Text>销售价：￥</Text><Text>{this.state.goodsDetail.dispPrice}</Text>
            <View className='memberPrice'>
                <Text>会员价：￥</Text><Text>{this.state.goodsDetail.price}</Text>
                <Text className='xiaoliang'>销量：17件</Text>
            </View>
            </View>
            <View className="peisong_box">
                <Text className='text'>配送</Text>
                <RadioGroup className="radio-group">
                    {
                        this.state.items.map((item,index)=>{
                            return (
                            <Radio color='#f12e24' className="radio" key={index} value={item.name} checked={item.checked}>
                                <Text>{item.value}</Text>
                            </Radio>)
                        })
                    }
                </RadioGroup>
            </View>
            {/* <View className='lingquan_box'>
              <Text className='text'>领券</Text>
              <View className="lable_box" onClick={this.couponsMoreFn}>
                  <Text className='lable'>超值折扣券</Text>
                  <Text className='lable'>满100减20</Text>
                  <Text className='lable'>测试</Text>
                  <Text className='lable'>超值满减优惠券</Text>
              </View>
            </View> */}
            <View className="wrap-promotion" onClick={this.couponsMoreFn}>
              <View className="promotion-item flex  arrows">
                  <View className="promo-title promo-title-color flex0">领券</View>
                  <View className="promo-cont flex1 text-line1">
                    {
                      couponlist.map((item) =>{
                        return (
                          <Text key={item.couponId} className="coupon-circle act-color act-bdc">{item.name}</Text>
                        )
                      })
                    }
                  </View>
              </View>
            </View>
            <View className='xuanze_box' onClick={this.addCartFn}>
              <Text className='title'>请选择</Text>
              <Text className='text'>颜色 型号 数量</Text>
            </View>
            {/* <View className='temp_box'>
              <Image mode='widthFix' src={require('../../../images/001.jpg')}></Image>
            </View> */}
            <View className="wrap-promotion">
              <View className="promotion-item arrows comment-title flex">
                  <View className="promotion-title color2">商品评价</View>
                  <View className="comment-amount color4" onClick={this.evaluationListPage}>3条评价</View>
              </View>
              <View className="promotion-item comment-container">
                  <View className="comment-wrap">
                      <View className="comment-item">
                          <View className="flex">
                              <View className="comment-discription">
                                  <View className="comment-user flex">
                                      <Image className='image' src="https://image-c.weimobwmc.com/ec-uc/aaff7206d48949839c2d2fd5faacbea0.png"></Image>
                                      <Text className="text font26 color2">这个世界真无奈</Text>
                                  </View>
                                  <View className="comment-text font24 color4">用户超时未评，系统自动好评。</View>
                              </View>0
                          </View>
                      </View>
                      <View className="comment-item">
                          <View className="flex">
                              <View className="comment-discription">
                                  <View className="comment-user flex">
                                      <Image className='image' src="https://image-c.weimobwmc.com/ec-uc/aaff7206d48949839c2d2fd5faacbea0.png"></Image>
                                      <Text className="text font26 color2">这个世界真无奈</Text>
                                  </View>
                                  <View className="comment-text font24 color4">用户超时未评，系统自动好评。</View>
                              </View>0
                          </View>
                      </View>
                      <View className="comment-item">
                          <View className="flex">
                              <View className="comment-discription">
                                  <View className="comment-user flex">
                                      <Image className='image' src="http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLDg0jDuVoliaPfmib8uvZ2D7haO2FyQWeAAoweFvjvtYIQGAzvoyiayOsc8yqc4cC5mXzJ5pwXltibiaQ/132"></Image>
                                      <Text className="text font26 color2">这个世界真无奈</Text>
                                  </View>
                                  <View className="comment-text font24 color4">不错</View>
                              </View>0
                          </View>
                      </View>
                      <View className="comment-item comment-more font24 color-4">更多评论</View>
                  </View>
              </View>
            </View>


            <View className="wrap-shopinfo">
              <View className="wrap-shop flex border-bottom-1px">
                  <View className="shop-logo flex0">
                      {/* <i className="imgCover" style="background-image: url(&quot;http://image-c.weimobwmc.com/bc-web/cfa429e32f80442eb023676948f6fdb7.png?imageMogr2/thumbnail/200x&quot;);"></i> */}
                      <Image className="imgCover" mode='widthFix' src={require('../../../images/goods.png')}></Image>
                  </View>
                  <View className="shop-info flex1">
                      <View className="shop-name f15 flex">
                          <Text className="flex1 flex flex-between">克克智慧零售演示账号</Text>
                      </View>
                      <View className="shop-identify f12">
                          <View className="wechat-idfy">
                              <View className="iconfont icon-weixinrenzheng"></View><Text>店铺认证</Text>
                          </View>
                          <View className="wechat-idfy">
                              <View className="iconfont icon-weixinrenzheng"></View><Text>微信认证</Text>
                          </View>
                      </View>
                  </View>
              </View>
              <View className="wrap-shop-nav flex flex-center f14 font26">
                  <View className="shop-nav border-right-1px flex flex-center" onClick={this.goGoodsPageFn}>
                      <View className="iconfont icon-allgoods color-97"></View>全部商品
                  </View>
                  <View className="shop-nav flex flex-center theme-color theme-bdc" onClick={this.goIndexPage}>
                      <View className="iconfont icon-jinrudianpu"></View> 进入店铺
                  </View>
              </View>
          </View>
            <View className='more_box'>
            <View className='title'>
                <Text>图文详情</Text>
            </View>
            <View className='con'>
              {
                this.state.background.map((item)=>{
                  return  <Image key={item} mode='widthFix' src={item}></Image>
                })
              }                
            </View>
            </View>
            <View className='bottom_box'></View>
            <View className='gouwuBtn_box'>
                {/* <Image mode='widthFix' src={require('../../../images/002.jpg')}></Image> */}
                <View className="footer-cont flex">
                  <View className="wrap-icons flex custom-nav">
                    <View className='wrap-icon item' onClick={this.goMinePageFn}><View className='iconfont icon-gerenzhongxin'></View>我的</View>
                    <View className='wrap-icon item' onClick={this.goCartPage}>
                      <View className="tag-cart-num amounts">3</View>
                      <View className='iconfont icon-gouwuche'></View>购物车
                    </View>
                    <View className='wrap-icon item' onClick={this.goIndexPage}><View className='iconfont icon-shouye-copy'></View>店铺</View>
                  </View>
                  <View className="wrap-btns flex flex1">
                    <View onClick={this.addCartFn} className="flex1 theme-bgcart">加入购物车</View>
                    <View onClick={this.buyNowFn} className="flex1 btn-tobuy theme-bgc">立即购买</View>
                    <View onClick={this.buyRechargeFn} className="flex1 theme-bgCz">充值购买</View>
                  </View>
                </View>
            </View>
        </View>
        <AtFloatLayout isOpened={this.state.skuModalShow}>
            {/* <SkuModal skuData={this.state.skuInfos} goodsid={this.state.goodsId} ></SkuModal> */}
            <View className='sku-modal_box'>
              <View className='sku-modal'>
                  <View className="sku-head">
                      <View className="flex">
                          {/* <View  style={{backgroundImage: `url(${headImg})`}}>
                          </View> */}
                          <Image className="sku-good-img" mode='widthFix' src={this.state.background[0]}></Image>
                          <View className="sku-header-info flex1">
                              <View>
                                  <View className="sku-price PriceSwitch theme-color">
                                      <Text>会员¥<Text className="sku-price-1">0.03</Text></Text>
                                  </View>
                                  <View className="sku-inventery font26 color999">
                                      库存89864件
                                  </View>
                              </View>
                              <View className="sku-item-tip font26 color999">
                                  <View className="text-line2">
                                      {this.state.selText}
                                      {
                                          selArrtText.map((item)=>{
                                              return <Text key={item}>"{item}"</Text>
                                          })
                                      }
                                  </View>
                              </View>
                          </View>
                      </View>
                  </View>
                  <View className="sku-cont">
                      <View className="sku-list">
                          {
                              skuData.map((item,index) =>{
                                  return (
                                  <View key={item.id} className="sku-choose border-bottom-1px">
                                      <View className="sku-title font30">{item.name}</View>
                                      <View className="sku-options flex">
                                          {
                                              item.attrValueList.map((sItem,sIndex)=>{
                                                  return <View key={sItem.key} onClick={this.checkedAttr.bind(this,index,sIndex,sItem.key)}  className={"sku-item "+(sItem.checked?"theme-color theme-bdc":"")}>{sItem.value}</View>
                                              })
                                          }
                                      </View>
                                  </View>)
                              })
                          }
                          <View className="sku-summary-wrap">
                              <View className=" flex flex-between flex-v-center">
                                  <View className="sku-title font30">数量</View>
                                  <View>
                                      <View className="sku-summary flex flex-end">
                                          <View className="sku-minu  iconfont icon-jian1 disable" onClick={this.editCartCount.bind(this,'jian')}>
                                          </View><Input type="number" className="sku-input" value={this.state.buyParam.count}></Input>
                                          <View className="sku-plus iconfont icon-jia1 " onClick={this.editCartCount.bind(this,'jia')}></View>
                                      </View>
                                  </View>
                              </View>
                          </View>
                      </View>
                  </View>
                  <View className="sku-form" onClick={this.saveParam.bind(this)}>
                      <Text className="btn-confirm">确认</Text>
                  </View>
              </View>
          </View>
        </AtFloatLayout>

        <AtFloatLayout title="领取优惠券" isOpened={this.state.couponsModalShow}>
            <CouponsModal couponlist={this.state.couponlist} />
        </AtFloatLayout>
        <AtFloatLayout title="" isOpened={this.state.shareModalIsShow}>
          <View className="share_dialog_box">
            <View className="share_con_box">
                <View className="item" onClick={this.shareToFriendFn.bind(this)}>
                  <Button className='btn' open-type="share">
                    <Image className="img" src="http://www.kknx6.com/goods/mainPic/11.jpg"></Image>
                    <Text className="text">发给好友</Text>
                  </Button>
                </View>
                <View className="item">
                    <Image className="img" src="http://www.kknx6.com/goods/mainPic/11.jpg"></Image>
                    <Text className="text">生成图片</Text>
                </View>
            </View>
            <View className='close_btn' onClick={this.closeShareModalFn.bind(this)}>取消</View>
          </View>
        </AtFloatLayout>                          
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

export default Index as ComponentClass
