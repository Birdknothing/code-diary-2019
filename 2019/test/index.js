import One, { requestPlugin, ucPlugin, omsPlugin } from '@sdp.nd/one'
import WalletSDK from '@sdp.nd/pbl-sdk-wallet'
// window.WalletSDK = WalletSDK;
const one = {};
const walletSDK = {};

const SdpWalletSDK = {};
SdpWalletSDK.init = async (env, lang, sdpAppId) => {
    one = new One({
        env: "preproduction",
        plugins: {
            request: requestPlugin(),
            uc: ucPlugin(),
            oms: omsPlugin()
        }
    });

    walletSDK = new WalletSDK({
        env: env,
        lang: lang,
        one: one,
        sdpAppId: sdpAppId
    });

    await walletSDK.init();
};

SdpWalletSDK.getProductList = async (productCode, page, rows) => {
    return await walletSDK.service.getProductList(productCode, { page, rows });
};

SdpWalletSDK.getPayChannel = async (
    source_component_id,
    app_product_service_id,
    order_id,
    pay_type,
    payment_channels,
    ignore_channels
) => {
    return await walletSDk.service.getPayChannel({
        source_component_id: source_component_id,
        app_product_service_id: app_product_service_id,
        order_id: order_id,
        pay_type: pay_type,
        payment_channels: payment_channels,
        ignore_channels: ignore_channels
    });
};

SdpWalletSDK.openPay = async (uid, pay_source, channel, good_id, amount) => {
    let order = await walletSDK.service.createChargeOrder({
        uid: uid,
        client_ip: "127.0.0.1",
        pay_source: pay_source,
        channel: channel,
        good_id: good_id,
        amount: amount
    });

    await walletSDK.payOrder({
        uid: uid,
        payOrderParams: {
            payment_channel: order.payment_channel,
            order_id: order.order_id
        },
        mode: Mode
    });
};
window.SdpWalletSDK = SdpWalletSDK;

// const one = new One({
//   env: 'preproduction',
//   plugins: {
//     request: requestPlugin(),
//     uc: ucPlugin(),
//     oms: omsPlugin()
//   }
// })
// const walletSDK = new WalletSDK({
//     lang: 'zh-CN',
//     one: One,
//     sdpAppId
//   })
//   (async function(){

//   await walletSDK.init()
  
//   // 1、获取充值商品列表
//   await walletSDK.service.getProductList(productCode, {page, rows})
  
//   // 2、获取支付渠道列表
//   await walletSDk.service.getPayChannel({
//     source_component_id?: string // 业务组件ID-客户端
//     app_product_service_id: string // 商户ID
//     order_id?: string // 订单ID
//     pay_type: PayTypes // 币种 'CHANNEL_CASH': 人民币(CNY)   'CASH_USD': 美元(USD)
//     payment_channels?: Array<PaymentChannel>  'CHANNEL_WECHAT_PUB_QR' // 微信扫码支付 'CHANNEL_ALIPAY_QR' // 支付宝扫码支付 'CHANNEL_PAYPAL_WEB' // 海外paypal web支付
//     // 支付渠道
//     ignore_channels?: Array // 不需要显示的支付渠道
//   })
  
// //   // 返回值
// //   [
// //     {
// //       channel_name: 'CHANNEL_ALIPAY',
// //       desc: '支付宝支付',
// //       channel_pic_enable: 'general_pay_mall_alipay',
// //       channel_pic_disable: ''
// //     }
// //   ]
//   // 3、创建充值订单
//   await walletSDK.service.createChargeOrder({
//     "uid": "703169",                                                    // 必填,uid
//     "client_ip": "127.0.0.1",                                           // 必填，客户端ip
//     "pay_source": 2,                                                    // 必填，支付来源
//     "channel": "CHANNEL_ALIPAY",                                        // 必填，支付渠道
//     "good_id": "56e694739e332765b4396d84",                              // 必填，商品id
//     "amount": "",                                                       // 非必填,充值金额
//   })
  
// //   //返回值: {                                                                              
// //       "status_code": "30070001",                                                 // 业务订单状态码
// //       "msg": "",                                                                 // 业务消息
// //       "success": true,                                                           // 创建订单成功标记
// //       "order_id": "REC703169881464328951701287",                                 // 钱包流水号
// //       "order_no": "",                                                            // 业务方订单号
// //       "payment_channel": "CHANNEL_ALIPAY",                                      // 支付渠道
// //       "exempt": true,                                                            // 是否免密
// //       "public_key": "ABCDEFJKLM0088792994793JDJALJLDDJL...",                     // 加密公钥
// //       "wallet_sign": ""                                                          // 钱包凭证签名信息
// //   }
  
//   // 4、调用支付方法
  
//   await walletSDK.payOrder({
//      uid: string
//      payOrderParams: PayOrderParams
//      mode?: Mode
//   })
  
// //   export interface PayOrderParams {
// //     payment_channel: 'CHANNEL_WECHAT_PUB_QR' | 'CHANNEL_ALIPAY_BANK' | 'CHANNEL_PAYPAL_WEB'
// //     order_id: string
// //     public_key?: string
// //     wallet_sign?: string
// //   }
  
//   // 返回值：
// //   {
// //     code: 'PBL_WALLET/PAY_ORDER_SUCCESS',
// //       'PBL_WALLET/PAY_ORDER_TIMEOUT',
// //       'PBL_WALLET/PAY_ORDER_UNKNOWN',
// //       'PBL_WALLET/PAY_ORDER_WAITING',  // 取消支付
// //       'PBL_WALLET/PAY_ORDER_FAILED'
// //     message: 
// //   }
// })()
