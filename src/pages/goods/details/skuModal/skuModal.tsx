import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Button, Swiper, Text, Input } from '@tarojs/components'
import PropTypes from 'prop-types';
import headImg from '../../../../images/goods/1.jpg';
import './skuModal.scss';
const api = require('../../../../config/api.js');
class SkuModal extends Component {
    static options = {
        addGlobalClass: true
    }
    
    constructor(props){
        super(...arguments); 
        console.log("asdasd");
    }
    
    state={
        buyParam:{
            "colorId": "",
            "count": '1',
            "sizeId": ""
        },
        selText:'请选择',
        selArrtText:[],
    }
    componentWillReceiveProps(nextProps) {
        console.log(nextProps,123);
        let selArrtText=[];
        nextProps.skuData.forEach(element => {
            selArrtText.push(element.name)
        });
        this.setState({
            skuData: nextProps.skuData,
            selArrtText:selArrtText        
        });
    }

    saveParam(){
        Taro.request({
            url:api.orderShopcartSavePath,
            method:"POST",
            data:{
                "colorId": this.state.buyParam.colorId,
                "count": this.state.buyParam.count,
                "goodsId": this.props.goodsid,
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
    componentDidMount(){}
    render(){        
        const { skuData,selArrtText } = this.state;
        console.log(this.props,321);
        return (
        <View className='sku-modal_box'>
            <View className='sku-modal'>
                <View className="sku-head">
                    <View className="flex">
                        <View className="sku-good-img" style={{backgroundImage: `url(${headImg})`}}>
                        </View>
                        <View className="sku-header-info flex1">
                            <View>
                                <View className="sku-price PriceSwitch theme-color">
                                    <Text>会员¥<Text className="sku-price-1">0</Text>.03x</Text>
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
                                                console.log(sItem);
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
                <View className="sku-form">
                    <Text className="btn-confirm" onClick={this.saveParam.bind(this)}>确认</Text>
                </View>
            </View>
        </View>)
    }
}

SkuModal.propTypes={
    skuData:PropTypes.array.isRequired,
    goodsid:PropTypes.string.isRequired,
    // pfn:PropTypes.func.isRequired
}

export default SkuModal;

