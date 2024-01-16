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
    const lastOrder = common_vendor.ref({
      cost: 0,
      min: 0
    });
    const countDown = common_vendor.ref(10);
    const playType = common_vendor.ref(0);
    const isLogIn = common_vendor.ref(false);
    const _mapContext = common_vendor.index.createMapContext("myMap");
    const latitude = common_vendor.ref(null);
    const longitude = common_vendor.ref(null);
    const markers = common_vendor.ref(0);
    let timer = null;
    const curDeviceNum = common_vendor.ref("");
    const orderNum = common_vendor.ref("");
    const deviceDetail = common_vendor.ref({
      dropName: "",
      deviceStatus: 1,
      deviceId: null
    });
    const token = common_vendor.ref("");
    common_vendor.onMounted(async () => {
      common_vendor.index.login({
        success(data) {
          console.log(data);
        }
      });
      getUserLocation();
      makeSureLog();
      if (curDeviceNum.value !== "") {
        await getDeviceMsgByDeviceNum();
      }
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
        startEquipment();
      } else {
        common_vendor.index.showToast({
          title: "请先登录"
        });
      }
    };
    const startBilling = () => {
      timer = setInterval(() => {
        totalSecond.value = Math.floor((/* @__PURE__ */ new Date() - startTime.value) / 1e3);
        totalMin.value = Math.ceil(totalSecond.value / 60);
        totalCost.value = totalMin.value * 2;
      }, 1e3);
    };
    common_vendor.watch(playing, (newVal) => {
      if (!newVal) {
        console.log(newVal);
        clearInterval(timer);
        console.log(timer);
      }
    });
    const startPlaying = async (option) => {
      makeSureLog();
      if (isLogIn.value) {
        startTime.value = /* @__PURE__ */ new Date();
        playing.value = true;
        if (option === 0) {
          playType.value = 0;
          common_vendor.index.showLoading({
            title: "正在请求支付"
          });
          setTimeout(() => {
            common_vendor.index.hideLoading();
          }, 1e3);
          await handlePaymentByPlayBackup();
          startCountDown();
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
      const timer2 = setInterval(() => {
        countDown.value--;
        if (countDown.value <= 0) {
          clearInterval(timer2);
          playing.value = false;
          isEnd.value = true;
          countDown.value = 60;
          totalCost.value = 5;
          totalMin.value = 10;
          lastOrder.value.cost = 5;
          lastOrder.value.min = 10;
        }
      }, 1e3);
    };
    const clickStop = async () => {
      await closeEquipment();
      await handlePaymentOrderByPlayAhead();
      await handlePaymentByPlayAhead();
      lastOrder.value.cost = totalCost.value;
      lastOrder.value.min = totalMin.value;
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
          url: `https://allmetaahome.com:2333/equipment/detail?equipmentNum=${curDeviceNum.value}`,
          method: "GET"
        });
        deviceDetail.value.deviceStatus = res.data.data.deviceDetail.status;
        deviceDetail.value.dropName = res.data.data.deviceDetail.dropName;
        playType.value = res.data.data.deviceDetail.mode;
      } catch (error) {
        console.error("设备详情获取失败", error);
      } finally {
        playType.value = 1;
        console.log("初始化", playType.value);
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
    const startEquipment = async () => {
      try {
        const res = await common_vendor.index.request({
          url: `https://allmetaahome.com:2333/equipment/startEquipment?equipmentNum=${curDeviceNum.value}`,
          method: "GET",
          header: {
            satoken: token.value
          },
          success(res2) {
            if (res2.data.code === 200 && res2.data.message === "success") {
              common_vendor.index.showToast({
                title: "设备启动成功",
                icon: "success"
              });
              startPlaying(playType.value);
            } else {
              common_vendor.index.showToast({
                title: "设备启动失败"
                // icon:"exception"
              });
            }
          },
          fail(error) {
            console.error("设备启动失败", error);
            common_vendor.index.showToast({
              title: "设备启动失败"
            });
          }
        });
      } catch (error) {
        console.error("设备启动失败", error);
      }
    };
    const closeEquipment = async () => {
      try {
        const res = await common_vendor.index.request({
          url: `https://allmetaahome.com:2333/equipment/closeEquipmentByUser?equipmentNum=${curDeviceNum.value}`,
          method: "POST",
          header: {
            satoken: token.value
          }
        });
        if (res.data.code == 200 && res.data.message == "success") {
          common_vendor.index.showToast({
            title: "已结束游玩",
            icon: "success"
          });
          isEnd.value = true;
          playing.value = false;
        }
      } catch (error) {
        console.error("结束设备失败", error);
      }
    };
    const handlePaymentOrderByPlayAhead = async () => {
      try {
        const res = await common_vendor.index.request({
          url: `https://allmetaahome.com:2333/order/playBeforePay`,
          method: "POST",
          data: {
            "equipmentId": 1
          },
          header: {
            satoken: token.value
          }
        });
        orderNum.value = res.data.data;
      } catch (error) {
        console.log("订单发送失败", error);
      }
    };
    const handlePaymentByPlayAhead = async () => {
      try {
        const res = await common_vendor.index.request({
          url: "https://allmetaahome.com:2333/order/requestPayOrder",
          method: "POST",
          data: {
            "orderNum": orderNum.value,
            "amount": 10,
            "times": 10
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
          },
          fail(error) {
            console.log("支付遇到了一点问题", error);
          }
        });
      } catch (error) {
        console.error("支付失败", error);
      }
    };
    const handlePaymentByPlayBackup = async () => {
      try {
        const res = await common_vendor.index.request({
          url: `https://allmetaahome.com:2333/order/payBeforePlay`,
          method: "POST",
          data: {
            "equipmentId": 1,
            "amount": 0.1,
            "timetamp": 10
          },
          header: {
            satoken: token.value
          }
        });
        orderNum.value = res.data.data;
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
          },
          fail(error) {
            console.log("支付遇到了一点问题", error);
          }
        });
      } catch (error) {
        console.error("支付失败", error);
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
        k: common_vendor.t(curDeviceNum.value),
        l: common_vendor.o(($event) => toFeedbackClick()),
        m: common_vendor.p({
          type: "info",
          size: "16"
        }),
        n: common_vendor.o(($event) => toFeedbackClick()),
        o: common_vendor.o(($event) => clickPlay()),
        p: !isEnd.value && !playing.value,
        q: common_vendor.p({
          type: "paperplane-filled",
          size: "14"
        }),
        r: common_vendor.o(($event) => clickClose()),
        s: common_vendor.p({
          type: "closeempty",
          size: "18"
        }),
        t: common_vendor.t(`${Math.floor(countDown.value / 60)}:${countDown.value % 60}`),
        v: common_vendor.t(curDeviceNum.value),
        w: common_vendor.o(($event) => toFeedbackClick()),
        x: common_vendor.p({
          type: "info",
          size: "16"
        }),
        y: common_vendor.o(($event) => toFeedbackClick()),
        z: common_vendor.t("付款成功，设备已启动"),
        A: !isEnd.value && playing.value && playType.value === 0,
        B: common_vendor.p({
          type: "paperplane-filled",
          size: "14"
        }),
        C: common_vendor.o(($event) => clickClose()),
        D: common_vendor.p({
          type: "closeempty",
          size: "18"
        }),
        E: common_vendor.t(`已使用${totalMin.value}分钟，花费${totalCost.value}元`),
        F: common_vendor.o(($event) => toFeedbackClick()),
        G: common_vendor.p({
          type: "info",
          size: "16"
        }),
        H: common_vendor.o(($event) => toFeedbackClick()),
        I: common_vendor.t("结束游玩"),
        J: common_vendor.o(($event) => clickStop()),
        K: !isEnd.value && playing.value && playType.value === 1,
        L: common_vendor.p({
          type: "paperplane-filled",
          size: "14"
        }),
        M: common_vendor.o(($event) => clickClose()),
        N: common_vendor.p({
          type: "closeempty",
          size: "18"
        }),
        O: common_vendor.t(`共使用${lastOrder.value.min}分钟，花费${lastOrder.value.cost}元`),
        P: common_vendor.o(($event) => toFeedbackClick()),
        Q: common_vendor.p({
          type: "info",
          size: "16"
        }),
        R: common_vendor.o(($event) => toFeedbackClick()),
        S: common_vendor.o(($event) => clickClose()),
        T: isEnd.value,
        U: !showQRScan.value
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"], ["__file", "D:/Git/res/bubble/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
