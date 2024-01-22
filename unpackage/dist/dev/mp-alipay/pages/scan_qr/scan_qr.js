"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "scan_qr",
  setup(__props) {
    common_vendor.ref({
      flash: false
    });
    function scanCode() {
      common_vendor.index.scanCode({
        success(res) {
          console.log("扫码成功：" + res.result);
        }
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => scanCode())
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/Git/res/bubble/pages/scan_qr/scan_qr.vue"]]);
my.createPage(MiniProgramPage);
