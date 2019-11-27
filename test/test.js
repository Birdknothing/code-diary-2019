import One, { requestPlugin, ucPlugin, omsPlugin } from "@sdp.nd/one/lib";
import WalletSDK from "@sdp.nd/pbl-sdk-wallet";

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
