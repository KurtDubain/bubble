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
  __name: "index",
  setup(__props) {
    const _mapContext = common_vendor.index.createMapContext("map");
    const map = common_vendor.ref({
      marks: []
    });
    const showQRScan = common_vendor.ref(true);
    const playing = common_vendor.ref(false);
    const isEnd = common_vendor.ref(false);
    const startTime = common_vendor.ref(null);
    const totalSecond = common_vendor.ref(0);
    const totalMin = common_vendor.ref(0);
    const totalCost = common_vendor.ref(0);
    const marks = [{
      latitude: 34.220009,
      longitude: 108.875175
      //iconPath: "../../static/location/on_arrow.png"
    }];
    common_vendor.onMounted(() => {
      common_vendor.index.login({
        success(data) {
          console.log(data);
        }
      });
      common_vendor.index.getLocation({
        type: "wgs84",
        success: function(res) {
          console.log(res.latitude);
          console.log(res.longitude);
          goMoveToLocation(res.longitude, res.latitude);
        }
      });
      map.value.marks = marks;
    });
    function goMoveToLocation(longitude, latitude) {
      _mapContext.moveToLocation({
        longitude,
        latitude,
        success() {
        }
      });
    }
    const clickClose = () => {
      if (!playing.value) {
        showQRScan.value = true;
        return;
      }
      common_vendor.index.showToast({
        title: "请先结束游玩"
      });
    };
    const clickPlayAndStop = () => {
      common_vendor.index.showLoading({
        title: "正在请求数据"
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        if (!playing.value) {
          startTime.value = /* @__PURE__ */ new Date();
          playing.value = true;
          startBilling();
        } else {
          playing.value = false;
          isEnd.value = true;
        }
      }, 500);
    };
    const startBilling = () => {
      const timer = setInterval(() => {
        totalSecond.value = Math.floor((/* @__PURE__ */ new Date() - startTime.value) / 1e3);
        totalMin.value = Math.ceil(totalSecond.value / 60);
        totalCost.value = Math.ceil(totalMin.value / 10) * 5;
      }, 1e3);
      watch(playing, (newVal) => {
        if (!newVal) {
          clearInterval(timer);
        }
      });
    };
    const toQRScanClick = () => {
      common_vendor.index.scanCode({
        success(res) {
          console.log("扫码成功：" + res.result);
          showQRScan.value = false;
        }
      });
    };
    const toMineClick = () => {
      common_vendor.index.navigateTo({
        url: "/pages/mine/mine"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: map.value.marks,
        b: common_vendor.p({
          type: "person",
          size: "26",
          color: "#000000"
        }),
        c: common_vendor.o(($event) => toMineClick()),
        d: common_vendor.o(($event) => toQRScanClick()),
        e: showQRScan.value,
        f: common_vendor.p({
          type: "paperplane-filled",
          size: "14"
        }),
        g: common_vendor.o(($event) => clickClose()),
        h: common_vendor.p({
          type: "closeempty",
          size: "18"
        }),
        i: common_vendor.t(playing.value ? `已使用${totalMin.value}分钟，共计${totalCost.value}元` : "5元/10分钟"),
        j: common_vendor.p({
          type: "info",
          size: "16"
        }),
        k: common_vendor.t(playing.value ? `停止游玩` : "开始游玩"),
        l: common_vendor.o(($event) => clickPlayAndStop()),
        m: !isEnd.value,
        n: common_vendor.p({
          type: "paperplane-filled",
          size: "14"
        }),
        o: common_vendor.o(($event) => clickClose()),
        p: common_vendor.p({
          type: "closeempty",
          size: "18"
        }),
        q: common_vendor.t(`共使用${totalMin.value}分钟，花费${totalCost.value}元`),
        r: common_vendor.p({
          type: "info",
          size: "16"
        }),
        s: common_vendor.o(($event) => clickClose()),
        t: isEnd.value,
        v: !showQRScan.value
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"], ["__file", "C:/Users/zealen/Desktop/前端实习（临时）/bubble/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
