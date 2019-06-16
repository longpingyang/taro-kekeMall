import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Button, Swiper, Text, Input } from '@tarojs/components'
// import headImg from '../../../../images/goods/1.jpg';
import './couponsModal.scss';
const api = require('../../../../config/api.js');
class CouponsModal extends Component {
    constructor(){
        super(...arguments);
    }
    componentWillReceiveProps(nextProps){
    }
    getCoupon(id){
        Taro.request({
            url:api.couponGetPath,
            method:"POST",
            data:{couponId:id},
            header:{token:Taro.getStorageSync('token')}
        }).then((res)=>{
            if(res.data.success){
                Taro.showToast({
                    title: '领取成功',
                    icon: 'none',
                    duration: 1500
                });
            }else{
                Taro.showToast({
                    title: res.data.errorInfo,
                    icon: 'none',
                    duration: 1500
                });
            }
        })
    }

    render(){
        const { couponlist } = this.props;
        return (
            <View className='couponsModal_box select_coupons_wrap'>
                <View className="select_coupons_box">
                    <View className="select_ocupons_cont coupon_pick_wrap">
                        {
                            couponlist.map((item)=>{
                                return (
                            <View key={item.couponId} className="coupon flex coupon-picker discoloration" style="background-color: rgba(241, 45, 34, 0.6);">
                                <View className="coupon-price flex theme-color flex-col">
                                    <View className={"price-number "+(item.type==1?"price-number_3":"")}>
                                        {item.type==1 && <View className="unit-name_3">¥</View>}                                        
                                        <View>{item.value}</View>
                                        {item.type==2 && <View className="coupon_fsize">折</View>}
                                    </View>
                                    <Text className="coupon-full">满{item.reqAmt}元</Text>
                                </View>
                                <View className="coupon-content flex1 flex flex-col">
                                    {item.type==1 && <View className="coupon-dec text-line1">满{item.reqAmt}减{item.value}元</View>}
                                    {item.type==2 && <View className="coupon-dec text-line1">{item.type==1?"超值满减券":"超值折扣券"}</View>}
                                    <View className="coupon-date">
                                        {item.date1} - {item.date2}
                                    </View>
                                    <View className="coupon-date">{item.isGoods==1?"部分商品可用":"全部商品可用"}</View>
                                </View>
                                <View onClick={this.getCoupon.bind(this,item.couponId)} className="coupon-operate flex" style="background-color: rgb(241, 45, 34);">
                                    <View  className="btn-pick theme-bdc theme-color font26">领取</View>
                                </View>
                                <View className="border-coupon"></View>
                            </View>
                                )
                            })
                        }
                        <View className="height-48"></View>
                    </View>
                </View>
            </View>
        )
    }
}
export default CouponsModal;