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
    const latitude = common_vendor.ref(null);
    const longitude = common_vendor.ref(null);
    const markers = common_vendor.ref(0);
    common_vendor.onMounted(() => {
      common_vendor.index.login({
        success(data) {
          console.log(data);
        }
      });
      getUserLocation();
      makeSureLog();
      const launchOptions = common_vendor.index.getLaunchOptionsSync();
      const deviceId = launchOptions.query.deviceId;
      const location = launchOptions.query.location;
      const status = launchOptions.query.status;
      console.log(`扫描到了登录参数，他们分别是deviceId:${deviceId},location:${location},status:${status}`);
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
          url: `https://allmetaahome.com:2333/dropoff/around?latitude=${latitude2}&longitude=${longitude2}`,
          method: "GET"
        });
        const clawMachineLocations = res.data;
        console.log(clawMachineLocations);
        markers.value = clawMachineLocations.data.map((location) => ({
          id: location.id,
          latitude: location.latitude,
          longitude: location.longitude,
          title: location.address,
          iconPath: "/path/to/marker-icon.png",
          // 标记点图标路径
          width: 30,
          height: 30,
          callout: {
            content: location.address,
            color: "#000000",
            fontSize: 14,
            borderRadius: 4,
            bgColor: "rgba(255, 255, 255, 0.5)",
            padding: 8,
            display: "ALWAYS"
          }
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
          console.log("我回来了");
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
      makeSureLog();
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
      makeSureLog();
      if (isLogIn.value) {
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
      } else {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none"
        });
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
      makeSureLog();
      if (isLogIn.value) {
        common_vendor.index.scanCode({
          success(res) {
            console.log("扫码成功：" + res.result);
            showQRScan.value = false;
          }
        });
      } else {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none"
        });
      }
    };
    const makeSureLog = () => {
      const cachedUserInfo = common_vendor.index.getStorageSync("userInfo");
      if (cachedUserInfo) {
        isLogIn.value = true;
      } else {
        isLogIn.value = false;
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
    const clickCloseOptions = () => {
      showPlayOptions.value = false;
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
        p: common_vendor.o(($event) => clickCloseOptions()),
        q: common_vendor.p({
          type: "closeempty",
          size: "18"
        }),
        r: common_vendor.o(($event) => startPlaying(0)),
        s: common_vendor.o(($event) => startPlaying(1)),
        t: showPlayOptions.value,
        v: common_vendor.p({
          type: "paperplane-filled",
          size: "14"
        }),
        w: common_vendor.o(($event) => clickClose()),
        x: common_vendor.p({
          type: "closeempty",
          size: "18"
        }),
        y: common_vendor.t(`${Math.floor(countDown.value / 60)}:${countDown.value % 60}`),
        z: common_vendor.o(($event) => toFeedbackClick()),
        A: common_vendor.p({
          type: "info",
          size: "16"
        }),
        B: common_vendor.o(($event) => toFeedbackClick()),
        C: common_vendor.t("设备运行中，开始游玩吧"),
        D: !isEnd.value && playing.value && playType.value === 0,
        E: common_vendor.p({
          type: "paperplane-filled",
          size: "14"
        }),
        F: common_vendor.o(($event) => clickClose()),
        G: common_vendor.p({
          type: "closeempty",
          size: "18"
        }),
        H: common_vendor.t(`已使用${totalMin.value}分钟，花费${totalCost.value}元`),
        I: common_vendor.o(($event) => toFeedbackClick()),
        J: common_vendor.p({
          type: "info",
          size: "16"
        }),
        K: common_vendor.o(($event) => toFeedbackClick()),
        L: common_vendor.t("结束游玩"),
        M: common_vendor.o(($event) => clickStop()),
        N: !isEnd.value && playing.value && playType.value === 1,
        O: common_vendor.p({
          type: "paperplane-filled",
          size: "14"
        }),
        P: common_vendor.o(($event) => clickClose()),
        Q: common_vendor.p({
          type: "closeempty",
          size: "18"
        }),
        R: common_vendor.t(`共使用${totalMin.value}分钟，花费${totalCost.value}元`),
        S: common_vendor.o(($event) => toFeedbackClick()),
        T: common_vendor.p({
          type: "info",
          size: "16"
        }),
        U: common_vendor.o(($event) => toFeedbackClick()),
        V: common_vendor.o(($event) => clickClose()),
        W: isEnd.value,
        X: !showQRScan.value
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"], ["__file", "D:/Git/res/bubble/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
