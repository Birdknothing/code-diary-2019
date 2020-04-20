import "./one"

import WalletSDK from "@sdp.nd/pbl-sdk-wallet"

const One = window.SDP.One
const { omsPlugin, requestPlugin, ucPlugin } = One

let one = {};
let walletSDK = {};

let SdpWalletSDK = {};
SdpWalletSDK.init = async (data) => {
  if (!data) {
    console.log('SdpWalletSDK init failed...');
    return;
  }

  console.log('One init ....');
  one = new One.default({
    env: data.Env,
    plugins: {
      request: requestPlugin({
        transformRequest:config=>{
          config.headers['sdp-app-id']=data.SdpAppId
          return config
        }
      }),
      uc: ucPlugin(),
      oms: omsPlugin()
    }
  });

  console.log('One uc loginByToken : ' + JSON.stringify(data));
  await one.uc.loginByToken({
    "account_type": "person",
    "account_id": data.AccountId,
    "user_id": "",
    "access_token": data.AccessToken, // 必传
    "refresh_token": "",
    "mac_algorithm": "hmac-sha-256",
    "mac_key": data.MacKey,  // 必传
    "expires_at": "",
    "server_time": "",
    "region": "",
    "source_token_account_type": "person",
    "diff": data.TimeStamp  // 服务器时间 - 本地时间
  });
  
  walletSDK = new WalletSDK({
    lang: data.Language,
    one: one,
    sdpAppId: data.SdpAppId
  });

  await walletSDK.init();
};

SdpWalletSDK.getProductList = async (productCode, page, rows) => {
  console.log('getProductList, productCode : ' + productCode + ', page:' + page + ', rows:' + rows);
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
  console.log('getPayChannel, source_component_id : ' + source_component_id + ', app_product_service_id:' + app_product_service_id + ', order_id:' + order_id + ', pay_type :' + pay_type + ', payment_channels:' + payment_channels + ', ignore_channels:' + ignore_channels);
  return await walletSDK.service.getPayChannel({
    source_component_id: source_component_id,
    app_product_service_id: app_product_service_id,
    order_id: order_id,
    pay_type: pay_type,
    payment_channels: payment_channels,
    ignore_channels: ignore_channels
  });
};

SdpWalletSDK.createChargeOrder = async (uid, pay_source, channel, good_id, amount) => {
  console.log('openPay, uid : ' + uid + ', pay_source:' + pay_source + ', channel:' + channel + ', good_id:' + good_id + ', amount:' + amount);
  return await walletSDK.service.createChargeOrder({
    uid: uid,
    client_ip: "127.0.0.1",
    pay_source: pay_source,
    channel: channel,
    good_id: good_id,
    amount: amount
  });
};

SdpWalletSDK.payOrder = async (uid, payOrderParams, mode) => {
  console.log('get order success, uid : ' + uid + 'payOrderParams:' + JSON.stringify(payOrderParams) + 'mode:' + mode);
  return await walletSDK.payOrder({
    uid:uid,
    payOrderParams:payOrderParams,
  });
};

SdpWalletSDK.queryCurrency=async(componentId, appProductServiceId) => {
  return await walletSDK.service.queryCurrency({
    componentId:componentId,
    appProductServiceId:appProductServiceId
  });
};

SdpWalletSDK.getBalance=async(code, $count)=>{
  console.log('getBanlance code : ' + code + ' $count : ' + $count);
  return await walletSDK.service.getBalance({
    code:code,
    $count:$count
  });
};

export default SdpWalletSDK