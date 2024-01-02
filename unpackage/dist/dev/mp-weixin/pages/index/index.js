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
    const showQRScan = common_vendor.ref(true);
    const playing = common_vendor.ref(false);
    const isEnd = common_vendor.ref(false);
    const startTime = common_vendor.ref(null);
    const totalSecond = common_vendor.ref(0);
    const totalMin = common_vendor.ref(0);
    const totalCost = common_vendor.ref(0);
    const showPlayOptions = common_vendor.ref(false);
    const countDown = common_vendor.ref(600);
    const playType = common_vendor.ref(0);
    const isLogIn = common_vendor.ref(false);
    const _mapContext = common_vendor.index.createMapContext("myMap");
    const latitude = common_vendor.ref(0);
    const longitude = common_vendor.ref(0);
    const markers = common_vendor.ref(0);
    common_vendor.onMounted(() => {
      common_vendor.index.login({
        success(data) {
          console.log(data);
        }
      });
      getUserLocation();
      const cachedUserInfo = common_vendor.index.getStorageSync("userInfo");
      if (cachedUserInfo) {
        isLogIn.value = true;
      } else {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none"
        });
      }
    });
    const getUserLocation = () => {
      common_vendor.index.getLocation({
        // type:'wgs84',
        success: (res) => {
          latitude.value = res.latitude;
          longitude.value = res.longitude;
          goMoveToLocation(longitude.value, latitude.value);
          getClawMachineLocations(latitude.value, longitude.value);
        },
        fail: (error) => {
          latitude.value = 39.916527;
          longitude.value = 116.397128;
          console.log("出错了", error);
          getClawMachineLocations(latitude.value, longitude.value);
        }
      });
    };
    const getClawMachineLocations = async (latitude2, longitude2) => {
      try {
        const res = await common_vendor.index.request({
          url: `https://allmetaahome.com:2333/wxApp/getMachineAround?latitude=${latitude2.value}&longitude=${longitude2.value}`,
          method: "GET"
        });
        const clawMachineLocations = res.data.locations;
        markers.value = clawMachineLocations.map((location) => ({
          id: location.title,
          latitude: location.latitude,
          longitude: location.longitude,
          title: location.title,
          iconPath: "/path/to/marker-icon.png",
          // 标记点图标路径
          width: 30,
          height: 30
        }));
      } catch (error) {
        console.error("获取娃娃机位置失败了", error);
      }
    };
    function goMoveToLocation(longitude2, latitude2) {
      _mapContext.moveToLocation({
        longitude: longitude2,
        latitude: latitude2,
        success() {
          console.log("wohuill");
        }
      });
    }
    const clickClose = () => {
      if (!playing.value) {
        showQRScan.value = true;
        isEnd.value = false;
        return;
      }
      common_vendor.index.showToast({
        title: "请先结束游玩"
      });
    };
    const clickPlay = () => {
      if (isLogIn.value) {
        common_vendor.index.showLoading({
          title: "正在请求数据"
        });
        setTimeout(() => {
          common_vendor.index.hideLoading();
          showPlayOptions.value = true;
        }, 500);
      } else {
        getUserInfo();
      }
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
          countDown.value = 60;
          totalCost.value = 5;
          totalMin.value = 10;
        }
      }, 1e3);
    };
    const clickStop = () => {
      isEnd.value = true;
      playing.value = false;
    };
    const toQRScanClick = () => {
      if (isLogIn.value) {
        common_vendor.index.scanCode({
          success(res) {
            console.log("扫码成功：" + res.result);
            showQRScan.value = false;
          }
        });
      } else {
        common_vendor.index.navigateTo({
          url: "/pages/mine/mine"
        });
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none"
        });
      }
    };
    const toMineClick = () => {
      common_vendor.index.navigateTo({
        url: "/pages/mine/mine"
      });
    };
    const toFeedbackClick = () => {
      if (isLogIn.value) {
        common_vendor.index.navigateTo({
          url: "/pages/feedback/feedback"
        });
      } else {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none"
        });
      }
    };
    return (_ctx, _cache) => {
      return {
        a: latitude.value,
        b: longitude.value,
        c: markers.value,
        d: common_vendor.p({
          type: "person",
          size: "26",
          color: "#000000"
        }),
        e: common_vendor.o(($event) => toMineClick()),
        f: common_vendor.o(($event) => toQRScanClick()),
        g: showQRScan.value,
        h: common_vendor.p({
          type: "paperplane-filled",
          size: "14"
        }),
        i: common_vendor.o(($event) => clickClose()),
        j: common_vendor.p({
          type: "closeempty",
          size: "18"
        }),
        k: common_vendor.o(($event) => toFeedbackClick()),
        l: common_vendor.p({
          type: "info",
          size: "16"
        }),
        m: common_vendor.o(($event) => toFeedbackClick()),
        n: common_vendor.o(($event) => clickPlay()),
        o: !isEnd.value && !playing.value,
        p: common_vendor.o(($event) => startPlaying(0)),
        q: common_vendor.o(($event) => startPlaying(1)),
        r: showPlayOptions.value,
        s: common_vendor.p({
          type: "paperplane-filled",
          size: "14"
        }),
        t: common_vendor.o(($event) => clickClose()),
        v: common_vendor.p({
          type: "closeempty",
          size: "18"
        }),
        w: common_vendor.t(`${Math.floor(countDown.value / 60)}:${countDown.value % 60}`),
        x: common_vendor.o(($event) => toFeedbackClick()),
        y: common_vendor.p({
          type: "info",
          size: "16"
        }),
        z: common_vendor.o(($event) => toFeedbackClick()),
        A: common_vendor.t("设备运行中，开始游玩吧"),
        B: !isEnd.value && playing.value && playType.value === 0,
        C: common_vendor.p({
          type: "paperplane-filled",
          size: "14"
        }),
        D: common_vendor.o(($event) => clickClose()),
        E: common_vendor.p({
          type: "closeempty",
          size: "18"
        }),
        F: common_vendor.t(`已使用${totalMin.value}分钟，花费${totalCost.value}元`),
        G: common_vendor.o(($event) => toFeedbackClick()),
        H: common_vendor.p({
          type: "info",
          size: "16"
        }),
        I: common_vendor.o(($event) => toFeedbackClick()),
        J: common_vendor.t("结束游玩"),
        K: common_vendor.o(($event) => clickStop()),
        L: !isEnd.value && playing.value && playType.value === 1,
        M: common_vendor.p({
          type: "paperplane-filled",
          size: "14"
        }),
        N: common_vendor.o(($event) => clickClose()),
        O: common_vendor.p({
          type: "closeempty",
          size: "18"
        }),
        P: common_vendor.t(`共使用${totalMin.value}分钟，花费${totalCost.value}元`),
        Q: common_vendor.o(($event) => toFeedbackClick()),
        R: common_vendor.p({
          type: "info",
          size: "16"
        }),
        S: common_vendor.o(($event) => toFeedbackClick()),
        T: common_vendor.o(($event) => clickClose()),
        U: isEnd.value,
        V: !showQRScan.value
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"], ["__file", "D:/Git/res/bubble/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
