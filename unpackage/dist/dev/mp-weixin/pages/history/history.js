"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "history",
  setup(__props) {
    const token = common_vendor.ref();
    const backMoneyForm = common_vendor.ref(false);
    const backMoneyDetail = common_vendor.ref("");
    const refundReason = common_vendor.ref("");
    const orderList = common_vendor.ref([]);
    common_vendor.onMounted(async () => {
      const Token = common_vendor.index.getStorageSync("Token");
      if (Token) {
        token.value = Token;
      }
      await getUserHistroyList();
    });
    const getUserHistroyList = async () => {
      try {
        const res = await common_vendor.index.request({
          url: `https://allmetaahome.com:2333/order/historyListByUser`,
          method: "GET",
          header: {
            satoken: token.value
          }
        });
        orderList.value = res.data.data.map((item) => ({
          orderNum: item.orderNum,
          playDate: formattedDateTime(item.time),
          playLocation: item.dropName,
          playCost: item.money / 100,
          status: item.status
        })).sort((a, b) => new Date(b.playDate) - new Date(a.playDate));
      } catch (error) {
        console.error("用户历史订单获取失败", error);
      }
    };
    const showBackMoneyForm = (order) => {
      backMoneyForm.value = true;
      backMoneyDetail.value = order;
    };
    const applyForRefund = async () => {
      try {
        const res = await common_vendor.index.request({
          url: `https://allmetaahome.com:2333/order/refundMini`,
          method: "POST",
          header: {
            satoken: token.value
          },
          data: {
            orderNum: backMoneyDetail.value.orderNum,
            refundReason: refundReason.value
          }
        });
        backMoneyForm.value = false;
        if (res.data.code === 200) {
          common_vendor.index.showToast({
            title: "退款申请发送成功",
            icon: "success"
          });
        } else {
          common_vendor.index.showToast({
            title: "退款失败",
            icon: "error"
          });
        }
        await getUserHistroyList();
      } catch (error) {
        console.log("退款申请异常", error);
      }
    };
    const orderPayment = async (order) => {
      try {
        const res = await common_vendor.index.request({
          url: "https://allmetaahome.com:2333/order/requestPayOrder",
          method: "POST",
          data: {
            "orderNum": order.orderNum,
            "amount": order.playCost * 100,
            "times": order.time
          },
          header: {
            satoken: token.value
          }
        });
        let orderInfo = {
          appId: "wx8c9cc8582d153543",
          timeStamp: res.data.data.timeStamp,
          nonceStr: res.data.data.nonceStr,
          // package: "Sign=WXPay",
          package: res.data.data.packageX,
          signType: res.data.data.signType,
          paySign: res.data.data.paySign
        };
        await common_vendor.index.requestPayment({
          "provider": "wxpay",
          ...orderInfo,
          success(res2) {
            console.log("支付成功", res2);
            getUserHistroyList();
          },
          fail(error) {
            console.log("支付遇到了一点问题", error);
          }
        });
      } catch (error) {
        console.error("支付失败", error);
      }
    };
    const formattedDateTime = (time) => {
      const dateTime = new Date(time);
      const month = (dateTime.getMonth() + 1).toString().padStart(2, "0");
      const day = dateTime.getDate().toString().padStart(2, "0");
      const hours = dateTime.getHours().toString().padStart(2, "0");
      const minutes = dateTime.getMinutes().toString().padStart(2, "0");
      return `${month}-${day} ${hours}:${minutes}`;
    };
    const cancelRefund = () => {
      backMoneyForm.value = false;
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(orderList.value, (order, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(order.playDate),
            b: "b2d018fa-0-" + i0,
            c: common_vendor.t(order.playLocation),
            d: common_vendor.t(order.playCost),
            e: order.status == 1
          }, order.status == 1 ? {
            f: "b2d018fa-1-" + i0,
            g: common_vendor.p({
              type: "help",
              size: "17",
              color: "white"
            }),
            h: common_vendor.o(($event) => showBackMoneyForm(order), index)
          } : {}, {
            i: order.status == -1
          }, order.status == -1 ? {
            j: "b2d018fa-2-" + i0,
            k: common_vendor.p({
              type: "help",
              size: "17",
              color: "white"
            })
          } : {}, {
            l: order.status == 0
          }, order.status == 0 ? {
            m: "b2d018fa-3-" + i0,
            n: common_vendor.p({
              type: "help",
              size: "17",
              color: "white"
            }),
            o: common_vendor.o(($event) => orderPayment(order), index)
          } : {}, {
            p: order.status == 2
          }, order.status == 2 ? {
            q: "b2d018fa-4-" + i0,
            r: common_vendor.p({
              type: "help",
              size: "17",
              color: "white"
            })
          } : {}, {
            s: index
          });
        }),
        b: common_vendor.p({
          type: "paperplane-filled",
          size: "14"
        }),
        c: backMoneyForm.value
      }, backMoneyForm.value ? {
        d: common_vendor.t(backMoneyDetail.value.playDate),
        e: common_vendor.t(backMoneyDetail.value.playCost),
        f: common_vendor.t(backMoneyDetail.value.playLocation),
        g: refundReason.value,
        h: common_vendor.o(($event) => refundReason.value = $event.detail.value),
        i: common_vendor.o(applyForRefund),
        j: common_vendor.o(cancelRefund)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b2d018fa"], ["__file", "D:/Git/res/bubble/pages/history/history.vue"]]);
wx.createPage(MiniProgramPage);
