const baseUrl = 'https://api.kknx6.com:9393/';
const memberCheckPath = baseUrl + 'member/check'; //检查微信号是否绑定会员卡
const memberSendsmsPath = baseUrl + 'member/sendsms';//发送短信验证码
const memberBindcardPath = baseUrl + 'member/bindcard'; //绑定微信和会员卡
const memberLoginPath = baseUrl + 'member/login'; //用户登录，验证码 和 密码 任一正确都可
const memberSummaryPath = baseUrl + 'member/summary';//刷新用户摘要信息
const memberDetailPath = baseUrl + 'member/detail';//用户明细信息查询
const memberSavedetailPath = baseUrl + 'member/savedetail';//保存用户明细信息
const memberMoneyLoglistPath = baseUrl + 'member/money/loglist';//用户账户余额变动历史列表
const memberMoneySavePath = baseUrl + 'member/money/save';//用户账户储值操作
const memberScoreLoglistPath = baseUrl + 'member/score/loglist';//用户账户积分变动历史列表
const memberDeliveryListPath = baseUrl + 'member/delivery/list';//用户常用地址列表 查询
const memberDeliverySavePath = baseUrl + 'member/delivery/save';//保存或创建用户常用地址
const memberDeliveryDelPath = baseUrl + 'member/delivery/del';//删除用户常用地址
const memberDeliverySetdefaultPath = baseUrl + 'member/delivery/setdefault';//设置默认地址
const memberShopListPath = baseUrl + 'member/shop/list';//查询门店列表
const goodsIndexCategorygoodsPath =  baseUrl + 'goods/index/categorygoods';//首页显示分类及分类商品列表
const goodsListPath = baseUrl + 'goods/goods/list';//查询商品列表
const goodsDetailPath = baseUrl + 'goods/goods/detail';//查询商品明细
const goodsPromotionpath = baseUrl + 'goods/promotion';//查询指定商品相关的促销活动
const goodsRecommendPath = baseUrl + 'goods/recommend';//查询商品推荐信息列表
const goodsCategoryListPath = baseUrl + 'goods/goods/category/list';//查询商品分类列表
const orderShopcartListPath = baseUrl + 'order/shopcart/list';//查询购物车信息
const orderShopcartSavePath = baseUrl + 'order/shopcart/save';//保存购物车信息
const orderShopcartDelPath = baseUrl + 'order/shopcart/del';//删除购物车信息
const orderShopcartModifyPath = baseUrl + 'order/shopcart/modify';//修改购物车数量
const orderListPath = baseUrl + 'order/list';//查询订单列表
const orderDetailPath = baseUrl + 'order/detail';//查询订单明细
const orderCreatePath = baseUrl + 'order/create';//下单
const orderWxPaycallbackPath = baseUrl + 'order/wx/paycallback';//微信在线支付的回调
const orderAliPaycallbackPath = baseUrl + 'order/ali/paycallback';//支付宝在线支付的回调
const activityQueryPath = baseUrl + 'activity/query';//针对登录用户所在默认门店
const couponListPath = baseUrl + 'coupon/list';//查询登录用户所拥有的全部优惠券列表
const couponGetPath = baseUrl + 'coupon/get';//领取奖券
const activityIndexAdPath = baseUrl + 'activity/index/ad';//首页的轮播广告查询



module.exports = {
  memberCheckPath:memberCheckPath,
  memberSendsmsPath:memberSendsmsPath,
  memberBindcardPath:memberBindcardPath,
  memberLoginPath:memberLoginPath,
  memberSummaryPath:memberSummaryPath,
  memberDetailPath:memberDetailPath,
  memberSavedetailPath:memberSavedetailPath,

  memberMoneyLoglistPath:memberMoneyLoglistPath,
  memberMoneySavePath:memberMoneySavePath,
  memberScoreLoglistPath:memberScoreLoglistPath,

  memberDeliveryListPath:memberDeliveryListPath,
  memberDeliverySavePath:memberDeliverySavePath,
  memberDeliveryDelPath:memberDeliveryDelPath,
  memberDeliverySetdefaultPath:memberDeliverySetdefaultPath,
  memberShopListPath:memberShopListPath,

  goodsIndexCategorygoodsPath:goodsIndexCategorygoodsPath,
  goodsListPath:goodsListPath,
  goodsDetailPath:goodsDetailPath,
  goodsPromotionpath:goodsPromotionpath,
  goodsRecommendPath:goodsRecommendPath,
  goodsCategoryListPath:goodsCategoryListPath,

  orderShopcartListPath:orderShopcartListPath,
  orderShopcartSavePath:orderShopcartSavePath,
  orderShopcartDelPath:orderShopcartDelPath,
  orderShopcartModifyPath:orderShopcartModifyPath,
  orderListPath:orderListPath,
  orderDetailPath:orderDetailPath,
  orderCreatePath:orderCreatePath,
  orderWxPaycallbackPath:orderWxPaycallbackPath,
  orderAliPaycallbackPath:orderAliPaycallbackPath,

  activityQueryPath:activityQueryPath,
  couponListPath:couponListPath,
  couponGetPath:couponGetPath,
  activityIndexAdPath:activityIndexAdPath














}