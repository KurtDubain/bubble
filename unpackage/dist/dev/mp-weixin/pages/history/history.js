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
    const orderList = common_vendor.ref([
      {
        orderNum: "dasho",
        playDate: "08.29 16:00",
        playLocation: "xx省xx市xx县xx村A",
        playCost: "50"
      },
      {
        orderNum: "idsad",
        playDate: "08.30 14:30",
        playLocation: "xx省xx市xx县xx村B",
        playCost: "60"
      }
    ]);
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
          playDate: item.time,
          playLocation: item.dropName,
          playCost: item.money
        }));
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
          url: `https://allmetaahome.com:2333/order/refund`,
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
      } catch (error) {
        console.log("退款申请异常", error);
      }
    };
    const cancelRefund = () => {
      backMoneyForm.value = false;
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(orderList.value, (order, index, i0) => {
          return {
            a: common_vendor.t(order.playDate),
            b: "b2d018fa-0-" + i0,
            c: common_vendor.t(order.playLocation),
            d: common_vendor.t(order.playCost),
            e: "b2d018fa-1-" + i0,
            f: common_vendor.o(($event) => showBackMoneyForm(order), index),
            g: index
          };
        }),
        b: common_vendor.p({
          type: "paperplane-filled",
          size: "14"
        }),
        c: common_vendor.p({
          type: "help",
          size: "17",
          color: "white"
        }),
        d: backMoneyForm.value
      }, backMoneyForm.value ? {
        e: common_vendor.t(backMoneyDetail.value.playDate),
        f: common_vendor.t(backMoneyDetail.value.playCost),
        g: common_vendor.t(backMoneyDetail.value.playLocation),
        h: refundReason.value,
        i: common_vendor.o(($event) => refundReason.value = $event.detail.value),
        j: common_vendor.o(applyForRefund),
        k: common_vendor.o(cancelRefund)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b2d018fa"], ["__file", "D:/Git/res/bubble/pages/history/history.vue"]]);
wx.createPage(MiniProgramPage);
