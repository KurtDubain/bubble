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
    const orderList = common_vendor.ref([
      {
        playDate: "08.29 16:00-16:12",
        playLocation: "xx省xx市xx县xx村A",
        playCost: "50"
      },
      {
        playDate: "08.30 14:30-15:00",
        playLocation: "xx省xx市xx县xx村B",
        playCost: "60"
      }
    ]);
    const handleException = () => {
      common_vendor.index.navigateTo({
        url: "/pages/feedback/feedback"
      });
      console.log("出现异常？按钮被点击");
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(orderList.value, (order, index, i0) => {
          return {
            a: common_vendor.t(order.playDate),
            b: "b2d018fa-0-" + i0,
            c: common_vendor.t(order.playLocation),
            d: common_vendor.t(order.playCost),
            e: "b2d018fa-1-" + i0,
            f: common_vendor.o(handleException, index),
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
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b2d018fa"], ["__file", "D:/Git/res/bubble/pages/history/history.vue"]]);
wx.createPage(MiniProgramPage);
