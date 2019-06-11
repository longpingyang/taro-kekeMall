import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View,  Text, Icon, Image, Input, ScrollView } from '@tarojs/components'
import { AtDrawer } from 'taro-ui'
import FilterModel from './filterModel/filterModel'
import './goods.scss'
const api = require('../../config/api.js');


class Index extends Component {

    /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
    config: Config = {
    navigationBarTitleText: '商品列表'
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps);
  }
  componentWillMount(){}

  componentWillUnmount() {}

  componentDidShow () { 
    this.getGoodsList();
    this.getGoodsCategory();
  }

  componentDidHide () { }
  state = {
    show: false,
    filterModel:false,
    isGoodsLine:false,
    posts: [
      // { id:1,imgurl: '../../images/goods/1.jpg', title: '气质白气质白色连衣裙气质白色连衣裙色连衣裙', lump:1},
      // { id:2,imgurl: '../../images/goods/7.jpg', title: '气质白气质白色连衣衣衣衣裙气质白色连衣裙色连衣裙', lump: 2 },
      // { id:3,imgurl: '../../images/goods/1.jpg', title: '气质白气质白色连衣裙气质白色连衣裙色连衣裙', lump: 1 },
      // { id:4,imgurl: '../../images/goods/7.jpg', title: '气质白气质白色连衣裙气质白色连衣裙色连衣裙', lump: 3 },
      // { id:5,imgurl: '../../images/goods/1.jpg', title: '气质白色连衣裙', lump: 2 },
      // { id:6,imgurl: '../../images/goods/7.jpg', title: '气质白色连衣裙', lump: 1 },
      {"goodsId": "1",
      "dispPrice": 200,
      "price": null,
      "goodsName": "",
      "mainPic": null,
      "tag": null}
    ],
    goodsParam:{
      key:'',
      categoryId:'',
      priceMin:'',
      priceMax:'',
      sortType:'0'//(0.默认;1.销量;2新品;3价格升序;4价格降序)
    },
    goodsCategory:[]
  }

  changeSortType(value){
    if(value==3){
      this.setState({
        goodsParam:{
          ...this.state.goodsParam,
          sortType:this.state.goodsParam.sortType=='3'?'4':'3'
        },
        show:false,filterModel:false
      },()=>{
        this.getGoodsList();
      })
    }else{
      this.setState({
        goodsParam:{
          ...this.state.goodsParam,
          sortType:value
        },
        show:false,filterModel:false
      },()=>{
        this.getGoodsList();
      })
    }        
  }
  getGoodsList(){
    Taro.request({
      url:api.goodsListPath,
      method:'POST',
      data:{
        "categoryId": this.state.goodsParam.categoryId,
        "key": this.state.goodsParam.key,
        "pageInfo": {
          "pageCount": 0,
          "pageNo": 1,
          "pageRec": 10,
          "pageSize": 10
        },
        "priceMax": this.state.goodsParam.priceMin,
        "priceMin": this.state.goodsParam.priceMax,
        "sortType": this.state.goodsParam.sortType
      },
      header:{
        token:Taro.getStorageSync('token')
      }
    }).then((res) =>{
      if(res.data.success){  
        this.setState({
          posts:res.data.data
        })
      }
    })
  }

  getGoodsCategory(){
    Taro.request({
      url:api.goodsCategoryListPath,
      method:"POST",
      header:{
        token:Taro.getStorageSync('token')
      }
    }).then((res) =>{
      if(res.data.success){
        this.setState({
          goodsCategory:res.data.data
        })
      }
    })
  }

  setGoodsCategory(value){
    this.setState({
      goodsParam:{
        // key:this.state.goodsParam.key,
        // priceMin:this.state.goodsParam.priceMin,
        // priceMax:this.state.goodsParam.priceMax,
        // sortType:this.state.goodsParam.sortType,
        ...this.state.goodsParam,
        categoryId:value,
        
      },
      show:false,filterModel:false
    },()=>{
      this.getGoodsList();
    })
  }
  setGoodsParamKey(e){
    this.setState({
      goodsParam:{
        ...this.state.goodsParam,
        key:e.detail.value,
      },
      show:false,filterModel:false
    })    
    return e.detail.value;
  }


  onClose(){
  }
  showAtDrawer(){
    this.setState({show:true,filterModel:false})
  }
  showFilterModel(){
    this.setState({filterModel:true,show:false})
  }
  changeStyleFn(){
    this.setState({
      isGoodsLine:!this.state.isGoodsLine,
      show:false,filterModel:false
    })
  }
  goDetailPage(id){
    Taro.navigateTo({
      url: '/pages/goods/details/details?id='+id
    })
  }
  render () {
    const { posts,goodsCategory } = this.state
    const goodsItem = posts.map((post) =>{
    return  <View className={'goodsItem '+(this.state.isGoodsLine?'itemLine':'')} key={post.id} onClick={this.goDetailPage.bind(this,post.goodsId)}>
              <Image className='goods_img' mode='aspectFill' src={post.mainPic}></Image>     
              <View className='goodsText'>         
                <View className={'title '+(post.lump==1?'lump':'')}>{post.goodsName}</View>
                <View className='lump' hidden={post.lump!=1}>
                  <Text className='text'>拼团</Text>
                </View>
                <View className='bottom'>
                  <Text className='vip'>会员</Text>
                  <Text className='b'>￥</Text>
                  <Text className='span'>{post.dispPrice}</Text>
                  <Image className='image' src={require('../../images/index03.jpg')}></Image>
                </View>
              </View>
          </View>
    })
    return (
      <View className='index'>
        <ScrollView className='goods_box'>
          <AtDrawer 
            show={this.state.show} 
            mask 
            width='268rpx'
            onClose={this.onClose.bind(this)} 
          >
            <View className='goods_menu'>
              <Text className='h3' onClick={this.setGoodsCategory.bind(this,'')}>全部商品</Text>
              {
                goodsCategory.map((item,index) =>{
                  return (
                    <View className="item_box" key={index}>
                      <Text onClick={this.setGoodsCategory.bind(this,item.categoryId)} className={'h3 '+(this.state.goodsParam.categoryId==item.categoryId?"active":"")}>{item.name}</Text>
                      <View className='item'>
                        {
                          item.childList.map((itemC,indexC) =>{
                            return <Text key={indexC} onClick={this.setGoodsCategory.bind(this,itemC.categoryId)} className={'text '+(this.state.goodsParam.categoryId==itemC.categoryId?"active":"")}>{itemC.name}</Text>
                          })
                        }
                      </View>
                    </View>
                  )
                })
              }
            </View>
          </AtDrawer>
          {/* <View className='serach_box'>
            <View onClick={this.showAtDrawer} className='show_typebox_btn'>
              <Image className='image' mode='aspectFill' src={require('../../images/index01.jpg')}></Image>
              <Text className='text'>分类</Text>
            </View>
            
            <View className='serach_body'>
              <Icon className='icon' type='search' size='40PX'></Icon>
              <Input type='text' confirm-type="search" placeholder='请输入搜索的商品'></Input>
            </View>
            <View className='serach_right'>
              <Image className='image' src={require('../../images/index02.jpg')}></Image>
              <Text  className='text'>列表</Text>
            </View>
          </View>
          <View className='filter_box'>
              <View>综合</View>
              <View>销量</View>
              <View>新品</View>
              <View>价格</View>
          </View> */}
          <View className="header">
            <View className="headers flex">
                <View onClick={this.showAtDrawer.bind(this)} className="classify">
                  <Text className="iconfont icon-fenlei1"></Text>分类
                </View>
                <View className="searchs flex1">
                        {/* <Input type="hidden" name="id" className="hidden" value="0"></Input>
                        <Input type="hidden" name="classifyname" className="hidden" value="全部商品"></Input> */}
                        <Input type="text" confirm-type="search" onConfirm={this.getGoodsList} onInput={this.setGoodsParamKey.bind(this)} name="search" placeholder="请输入搜索的商品" value={this.state.goodsParam.key}></Input>
                    <View className="iconsearch iconfont icon-sousuo"></View>
                </View>
                <View className="mode" onClick={this.changeStyleFn.bind(this)}>
                  <Text className={'iconfont '+(this.state.isGoodsLine?'icon-fenlei':'icon-liebiao')}></Text>列表
                </View>
            </View>
            <View className="nav flex">
                <View onClick={this.changeSortType.bind(this,0)} className={"flex1 color666 "+(this.state.goodsParam.sortType=='0'?'theme-color':'')}>
                    <Text>综合</Text>
                </View>
                <View onClick={this.changeSortType.bind(this,1)} className={"flex1 color666 "+(this.state.goodsParam.sortType=='1'?'theme-color':'')}>
                    <Text>销量</Text>
                </View>
                <View onClick={this.changeSortType.bind(this,2)} className={"flex1 color666 "+(this.state.goodsParam.sortType=='2'?'theme-color':'')}>
                    <Text>新品</Text>
                </View>
                <View onClick={this.changeSortType.bind(this,3)} className={"flex1 flex flex-center "+(this.state.goodsParam.sortType=='3' || this.state.goodsParam.sortType=='4'?'theme-color':'color666')}>
                    <View>价格</View>
                    <View className="flex-col flex-center">
                        <View className={"asc iconfont icon-xiangshang "+(this.state.goodsParam.sortType=='3'?'':'color999')}></View>
                        <View className={"desc iconfont icon-xiangxia "+(this.state.goodsParam.sortType=='4'?'':'color999')}></View>
                    </View>
                </View>
                <View onClick={this.showFilterModel} className="flex1 flex shaixuan color666">
                    <Text className="filter-line"></Text>
                    <View className="filter-btn">筛选</View>
                    <Text className="iconfont icon-shaixuan"></Text>
                </View>
            </View>
        </View>
        <AtDrawer 
            show={this.state.filterModel} 
            right 
            mask 
            width='658rpx'
            onClose={this.onClose.bind(this)} 
          >
            <FilterModel></FilterModel>
          </AtDrawer>      
          <View className={'goodsList_box '+(this.state.isGoodsLine?'itemLine_box':'')}>
          {goodsItem}
          </View>
        </ScrollView>
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
