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
    const curDeviceNum = common_vendor.ref("");
    const deviceDetail = common_vendor.ref({
      dropName: "",
      deviceStatus: 1
    });
    const token = common_vendor.ref("");
    common_vendor.onMounted(() => {
      common_vendor.index.login({
        success(data) {
          console.log(data);
        }
      });
      getUserLocation();
      makeSureLog();
    });
    common_vendor.onLoad((opstions) => {
      scanQRQuery(opstions.scene);
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
    const scanQRQuery = (param) => {
      if (param) {
        curDeviceNum.value = param;
        getDeviceMsgByDeviceNum();
        if (deviceDetail.value.deviceStatus === 1) {
          showQRScan.value = false;
        } else {
          common_vendor.index.showToast({
            title: "当前设备已经在启动了",
            icon: "error"
          });
        }
      } else {
        common_vendor.index.showToast({
          title: "扫描设备码开始游玩",
          icon: "none"
        });
      }
      const launchOptions = common_vendor.index.getEnterOptionsSync();
      console.log(`扫描到了登录参数，他们分别是deviceNum:${curDeviceNum.value}`, launchOptions);
    };
    const toQRScanClick = () => {
      makeSureLog();
      if (isLogIn.value) {
        common_vendor.index.scanCode({
          success(res) {
            const url = decodeURIComponent(res.path);
            url.split("?")[1].split("=")[1];
            common_vendor.index.reLaunch({
              url: `/${url}`,
              fail() {
                common_vendor.index.showToast({
                  title: "二维码异常"
                });
              }
            });
            console.log("扫码成功：");
          }
        });
      } else {
        common_vendor.index.showToast({
          title: "请先登录并且绑定手机号",
          icon: "none"
        });
      }
    };
    const getDeviceMsgByDeviceNum = async () => {
      try {
        const res = await common_vendor.index.request({
          url: `https://allmetaahome.com:2333/equipment/detail?equipment=${curDeviceNum.value}`,
          method: "GET"
        });
        deviceDetail.value.deviceStatus = res.data.data.deviceDetail.status;
        deviceDetail.value.dropName = res.data.data.deviceDetail.dropName;
        playType.value = res.data.data.deviceDetail.mode;
      } catch (error) {
        console.error("设备详情获取失败", error);
      }
    };
    const makeSureLog = () => {
      const logIn = common_vendor.index.getStorageSync("isLogIn");
      const binding = common_vendor.index.getStorageSync("isBinding");
      if (binding && logIn) {
        token.value = common_vendor.index.getStorageSync("Token");
        isLogIn.value = true;
      } else {
        isLogIn.value = false;
        common_vendor.index.showToast({
          title: "请先登录并且绑定手机号",
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
        k: common_vendor.t(curDeviceNum.value),
        l: common_vendor.o(($event) => toFeedbackClick()),
        m: common_vendor.p({
          type: "info",
          size: "16"
        }),
        n: common_vendor.o(($event) => toFeedbackClick()),
        o: common_vendor.o(($event) => clickPlay()),
        p: !isEnd.value && !playing.value,
        q: common_vendor.o(($event) => clickCloseOptions()),
        r: common_vendor.p({
          type: "closeempty",
          size: "18"
        }),
        s: common_vendor.o(($event) => startPlaying(0)),
        t: common_vendor.o(($event) => startPlaying(1)),
        v: showPlayOptions.value,
        w: common_vendor.p({
          type: "paperplane-filled",
          size: "14"
        }),
        x: common_vendor.o(($event) => clickClose()),
        y: common_vendor.p({
          type: "closeempty",
          size: "18"
        }),
        z: common_vendor.t(`${Math.floor(countDown.value / 60)}:${countDown.value % 60}`),
        A: common_vendor.t(curDeviceNum.value),
        B: common_vendor.o(($event) => toFeedbackClick()),
        C: common_vendor.p({
          type: "info",
          size: "16"
        }),
        D: common_vendor.o(($event) => toFeedbackClick()),
        E: common_vendor.t("付款成功，设备已启动"),
        F: !isEnd.value && playing.value && playType.value === 0,
        G: common_vendor.p({
          type: "paperplane-filled",
          size: "14"
        }),
        H: common_vendor.o(($event) => clickClose()),
        I: common_vendor.p({
          type: "closeempty",
          size: "18"
        }),
        J: common_vendor.t(`已使用${totalMin.value}分钟，花费${totalCost.value}元`),
        K: common_vendor.o(($event) => toFeedbackClick()),
        L: common_vendor.p({
          type: "info",
          size: "16"
        }),
        M: common_vendor.o(($event) => toFeedbackClick()),
        N: common_vendor.t("结束游玩"),
        O: common_vendor.o(($event) => clickStop()),
        P: !isEnd.value && playing.value && playType.value === 1,
        Q: common_vendor.p({
          type: "paperplane-filled",
          size: "14"
        }),
        R: common_vendor.o(($event) => clickClose()),
        S: common_vendor.p({
          type: "closeempty",
          size: "18"
        }),
        T: common_vendor.t(`共使用${totalMin.value}分钟，花费${totalCost.value}元`),
        U: common_vendor.o(($event) => toFeedbackClick()),
        V: common_vendor.p({
          type: "info",
          size: "16"
        }),
        W: common_vendor.o(($event) => toFeedbackClick()),
        X: common_vendor.o(($event) => clickClose()),
        Y: isEnd.value,
        Z: !showQRScan.value
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"], ["__file", "D:/Git/res/bubble/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
