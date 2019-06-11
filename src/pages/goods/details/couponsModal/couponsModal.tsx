import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Button, Swiper, Text, Input } from '@tarojs/components'
// import headImg from '../../../../images/goods/1.jpg';
import './couponsModal.scss';

class CouponsModal extends Component {
    constructor(){
        super(...arguments);
        this.state={}
    }


    render(){
        // const { skuData } = this.props;
        return (
            <View className='couponsModal_box select_coupons_wrap'>
                <View className="select_coupons_box">
                    {/* <View className="select_coupons_title">
                        领取优惠券<View className="icon-guanbi iconfont"></View>
                    </View> */}
                    <View className="select_ocupons_cont coupon_pick_wrap">
                        <View className="coupon flex coupon-picker discoloration" style="background-color: rgba(241, 45, 34, 0.6);">
                            <View className="coupon-price flex theme-color flex-col">
                                <View className="price-number">
                                    <View>8</View>
                                    <View className="coupon_fsize">折</View>
                                </View>
                                <Text className="coupon-full">满5元</Text>
                            </View>
                            <View className="coupon-content flex1 flex flex-col">
                                <View className="coupon-dec text-line1">超值折扣券</View>
                                <View className="coupon-date">
                                    领取后100天内有效
                                </View>
                                <View className="coupon-date">全部商品可用</View>
                            </View>
                            <View className="coupon-operate flex" style="background-color: rgb(241, 45, 34);">
                                <View className="btn-pick theme-bdc theme-color font26" data-elementid="领取">领取</View>
                            </View>
                            <View className="border-coupon"></View>
                        </View>
                        <View className="coupon flex coupon-picker discoloration" style="background-color: rgba(241, 45, 34, 0.6);">
                            <View className="coupon-price flex theme-color flex-col">
                                <View className="price-number price-number_3">
                                <View className="unit-name_3">¥</View>
                                    <View>0.5</View>
                                </View>
                                <Text className="coupon-full">满2元</Text>
                            </View>
                            <View className="coupon-content flex1 flex flex-col">
                                <View className="coupon-dec text-line1">超值满减优惠券</View>
                                <View className="coupon-date">领取后100天内有效</View>
                                <View className="coupon-date">全部商品可用</View>
                            </View>
                            <View className="coupon-operate flex" style="background-color: rgb(241, 45, 34);">
                                <View className="btn-pick theme-bdc theme-color font26" data-elementid="领取">领取</View>
                            </View>
                            <View className="border-coupon"></View>
                        </View>
                        <View className="coupon flex coupon-picker discoloration" style="background-color: rgba(241, 45, 34, 0.6);">
                            <View className="coupon-price flex theme-color flex-col">
                                <View className="price-number price-number_3">
                                <View className="unit-name_3">¥</View>
                                    <View>5</View>
                                </View>
                                <Text className="coupon-full">满100元</Text>
                            </View>
                            <View className="coupon-content flex1 flex flex-col">
                                <View className="coupon-dec text-line1">满100减5元</View>
                                <View className="coupon-date">领取后234天内有效</View>
                                <View className="coupon-date">全部商品可用</View>
                            </View>
                            <View className="coupon-operate flex" style="background-color: rgb(241, 45, 34);">
                                <View className="btn-pick theme-bdc theme-color font26" data-elementid="领取">领取</View>
                            </View>
                            <View className="border-coupon"></View>
                        </View>
                        <View className="coupon flex coupon-picker disabled">
                            <View className="coupon-price flex theme-color flex-col">
                                <View className="price-number price-number_3"><View className="unit-name_3">¥</View>
                                    <View>0.01</View>
                                </View>
                                <Text className="coupon-full">满0.01元</Text>
                            </View>
                            <View className="coupon-content flex1 flex flex-col">
                                <View className="coupon-dec text-line1">测试</View>
                                <View className="coupon-date">
                                    2019.01.04 00:00 - 2020.01.31 23:59
                                </View>
                                <View className="coupon-date">全部商品可用</View>
                            </View>
                            <View className="coupon-operate flex">
                                <View className="btn-pick theme-bdc theme-color font26" data-elementid="领取">已领取</View>
                            </View>
                            <View className="border-coupon"></View>
                        </View>
                        <View className="coupon flex coupon-picker discoloration" style="background-color: rgba(241, 45, 34, 0.6);">
                            <View className="coupon-price flex theme-color flex-col">
                                <View className="price-number price-number_3"><View className="unit-name_3">¥</View>
                                    <View>100</View>
                                </View>
                                <Text className="coupon-full">满0.01元</Text>
                            </View>
                            <View className="coupon-content flex1 flex flex-col">
                                <View className="coupon-dec text-line1">沃尔玛演示</View>
                                <View className="coupon-date">领取后100天内有效</View>
                                <View className="coupon-date">全部商品可用</View>
                            </View>
                            <View className="coupon-operate flex" style="background-color: rgb(241, 45, 34);">
                                <View className="btn-pick theme-bdc theme-color font26" data-elementid="领取">领取</View>
                            </View>
                            <View className="border-coupon"></View>
                        </View>
                        <View className="coupon flex coupon-picker discoloration" style="background-color: rgba(241, 45, 34, 0.6);">
                            <View className="coupon-price flex theme-color flex-col">
                                <View className="price-number price-number_3"><View className="unit-name_3">¥</View>
                                    <View>50</View>
                                </View>
                                <Text className="coupon-full">满500元</Text>
                            </View>
                            <View className="coupon-content flex1 flex flex-col">
                                <View className="coupon-dec text-line1">双11热力促销</View>
                                <View className="coupon-date">领取7天后30天内有效</View>
                                <View className="coupon-date">全部商品可用</View>
                            </View>
                            <View className="coupon-operate flex" style="background-color: rgb(241, 45, 34);">
                                <View className="btn-pick theme-bdc theme-color font26" data-elementid="领取">领取</View>
                            </View>
                            <View className="border-coupon"></View>
                        </View>
                        <View className="height-48"></View>
                    </View>
                </View>
            </View>
        )
    }
}
export default CouponsModal;