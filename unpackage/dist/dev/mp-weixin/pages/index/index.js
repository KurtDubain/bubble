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
    const showQRScan = common_vendor.ref(false);
    const playing = common_vendor.ref(false);
    const isEnd = common_vendor.ref(false);
    const startTime = common_vendor.ref(null);
    const totalSecond = common_vendor.ref(0);
    const totalMin = common_vendor.ref(0);
    const totalCost = common_vendor.ref(0);
    const showPlayOptions = common_vendor.ref(false);
    const countDown = common_vendor.ref(600);
    const playType = common_vendor.ref(0);
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
    const clickPlay = () => {
      common_vendor.index.showLoading({
        title: "正在请求数据"
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        showPlayOptions.value = true;
      }, 500);
    };
    const startBilling = () => {
      const timer = setInterval(() => {
        totalSecond.value = Math.floor((/* @__PURE__ */ new Date() - startTime.value) / 1e3);
        totalMin.value = Math.ceil(totalSecond.value / 60);
        totalCost.value = totalMin.value * 2;
      }, 1e3);
      watch(playing, (newVal) => {
        if (!newVal) {
          clearInterval(timer);
        }
      });
    };
    const startPlaying = (option) => {
      showPlayOptions.value = false;
      startTime.value = /* @__PURE__ */ new Date();
      playing.value = true;
      if (option === 0) {
        playType.value = 0;
        common_vendor.index.showLoading({
          title: "正在请求支付"
        });
        setTimeout(() => {
          common_vendor.index.hideLoading();
          startCountDown();
        }, 2e3);
      } else {
        playType.value = 1;
        startBilling();
      }
    };
    const startCountDown = () => {
      const timer = setInterval(() => {
        countDown.value--;
        if (countDown.value <= 0) {
          clearInterval(timer);
          playing.value = false;
          isEnd.value = true;
          countDown.value = 600;
          totalCost.value = 5;
          totalMin.value = 10;
        }
      }, 1e3);
    };
    const stopPlayingAhead = () => {
      playing.value = false;
      isEnd.value = true;
      totalCost.value = 5;
      totalMin.value = Math.ceil((600 - countDown.value) / 60);
      countDown.value = 600;
    };
    const clickStop = () => {
      isEnd.value = true;
      playing.value = false;
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
        i: common_vendor.p({
          type: "info",
          size: "16"
        }),
        j: common_vendor.t("开始游玩"),
        k: common_vendor.o(($event) => clickPlay()),
        l: !isEnd.value && !playing.value,
        m: common_vendor.o(($event) => startPlaying(0)),
        n: common_vendor.o(($event) => startPlaying(1)),
        o: showPlayOptions.value,
        p: common_vendor.p({
          type: "paperplane-filled",
          size: "14"
        }),
        q: common_vendor.o(($event) => clickClose()),
        r: common_vendor.p({
          type: "closeempty",
          size: "18"
        }),
        s: common_vendor.t(`${Math.floor(countDown.value / 60)}:${countDown.value % 60}`),
        t: common_vendor.p({
          type: "info",
          size: "16"
        }),
        v: common_vendor.o(($event) => stopPlayingAhead()),
        w: !isEnd.value && playing.value && playType.value === 0,
        x: common_vendor.p({
          type: "paperplane-filled",
          size: "14"
        }),
        y: common_vendor.o(($event) => clickClose()),
        z: common_vendor.p({
          type: "closeempty",
          size: "18"
        }),
        A: common_vendor.t(`已使用${totalMin.value}分钟，花费${totalCost.value}元`),
        B: common_vendor.p({
          type: "info",
          size: "16"
        }),
        C: common_vendor.t("结束游玩"),
        D: common_vendor.o(($event) => clickStop()),
        E: !isEnd.value && playing.value && playType.value === 1,
        F: common_vendor.p({
          type: "paperplane-filled",
          size: "14"
        }),
        G: common_vendor.o(($event) => clickClose()),
        H: common_vendor.p({
          type: "closeempty",
          size: "18"
        }),
        I: common_vendor.t(`共使用${totalMin.value}分钟，花费${totalCost.value}元`),
        J: common_vendor.p({
          type: "info",
          size: "16"
        }),
        K: common_vendor.o(($event) => clickClose()),
        L: isEnd.value,
        M: !showQRScan.value
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"], ["__file", "D:/Git/res/bubble/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
