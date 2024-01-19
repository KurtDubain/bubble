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
    const playType = common_vendor.ref(null);
    const isLogIn = common_vendor.ref(false);
    const _mapContext = common_vendor.index.createMapContext("myMap");
    const latitude = common_vendor.ref(null);
    const longitude = common_vendor.ref(null);
    const markers = common_vendor.ref(0);
    let timer = null;
    const curDeviceNum = common_vendor.ref("");
    const orderNum = common_vendor.ref("");
    const deviceDetail = common_vendor.ref({
      //设备的详细信息
      dropName: "",
      deviceStatus: null,
      deviceId: null
      // status:null
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
      await getUserIsVaild();
      if (curDeviceNum.value !== "") {
        await getDeviceMsgByDeviceNum();
      }
    });
    common_vendor.onLoad((options) => {
      makeSureLog();
      let url = decodeURIComponent(options.q);
      const reg = /scene=([^&]+)/;
      const match = url.match(reg);
      const scene = match && match[1];
      if (scene !== null) {
        scanQRQuery(scene);
      } else {
        scanQRQuery(options.scene);
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
          // iconPath: '/path/to/marker-icon.png', // 标记点图标路径
          width: 30,
          height: 30,
          callout: {
            content: location.address,
            color: "#000000",
            fontSize: 12,
            borderRadius: 4,
            padding: 3,
            display: "ALWAYS"
          },
          alpha: 0.6
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
        clearInterval(timer);
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
      lastOrder.value.cost = totalCost.value;
      lastOrder.value.min = totalMin.value;
      if (lastOrder.value.cost !== 0) {
        await handlePaymentOrderByPlayAhead();
        await handlePaymentByPlayAhead();
      } else {
        common_vendor.index.showToast({
          title: "游玩时间太短了"
        });
      }
    };
    const scanQRQuery = async (param) => {
      try {
        let passToken = false;
        passToken = await getUserIsVaild();
        if (param && passToken) {
          curDeviceNum.value = param;
          await getDeviceMsgByDeviceNum();
          if (deviceDetail.value.deviceStatus === 1 && playType.value !== null) {
            showQRScan.value = false;
          } else {
            common_vendor.index.showToast({
              title: "设备不可用",
              icon: "error"
            });
          }
        } else {
          common_vendor.index.showToast({
            title: "扫码开始游玩",
            icon: "none"
          });
        }
      } catch (error) {
        console.error("", error);
      }
    };
    const toQRScanClick = () => {
      makeSureLog();
      if (isLogIn.value) {
        common_vendor.index.scanCode({
          success(res) {
            const url = decodeURIComponent(res.result);
            const reg = "https://allmetaahome.com?scene=";
            const params = url.split("?")[1].split("=")[1];
            if (url.split("=")[0].concat("=") === reg) {
              common_vendor.index.reLaunch({
                url: `/pages/index/index?scene=${params}`,
                fail(error) {
                  console.error(error);
                  common_vendor.index.showToast({
                    title: "二维码异常"
                  });
                }
              });
              console.log("扫码成功：");
            } else {
              common_vendor.index.showToast({
                title: "二维码不正确",
                icon: "error"
              });
            }
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
        deviceDetail.value.deviceStatus = res.data.data.status;
        deviceDetail.value.dropName = res.data.data.dropName;
        playType.value = res.data.data.mode;
        deviceDetail.value.deviceId = res.data.data.id;
      } catch (error) {
        console.error("设备详情获取失败", error);
      }
    };
    const getUserIsVaild = async () => {
      try {
        const res = await common_vendor.index.request({
          url: "https://allmetaahome.com:2333/order/getUnpaidOrders",
          method: "GET",
          header: {
            satoken: token.value
          }
        });
        if (res.data.data.length <= 0) {
          return true;
        } else {
          showQRScan.value = true;
          common_vendor.index.showToast({
            title: "请支付上一次的订单",
            icon: "error"
          });
          return false;
        }
      } catch (error) {
        console.error("验证用户失败", error);
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
            "equipmentId": deviceDetail.value.deviceId
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
            "amount": lastOrder.value.cost * 100,
            // "amount":1,
            "times": lastOrder.value.min
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
            "equipmentId": deviceDetail.value.deviceId,
            "amount": 500,
            "timetamp": 10
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
            startCountDown();
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
        i: common_vendor.t(deviceDetail.value.dropName),
        j: common_vendor.o(($event) => clickClose()),
        k: common_vendor.p({
          type: "closeempty",
          size: "18"
        }),
        l: common_vendor.t(curDeviceNum.value),
        m: common_vendor.o(($event) => toFeedbackClick()),
        n: common_vendor.p({
          type: "info",
          size: "16"
        }),
        o: common_vendor.o(($event) => toFeedbackClick()),
        p: common_vendor.o(($event) => clickPlay()),
        q: !isEnd.value && !playing.value,
        r: common_vendor.p({
          type: "paperplane-filled",
          size: "14"
        }),
        s: common_vendor.t(deviceDetail.value.dropName),
        t: common_vendor.o(($event) => clickClose()),
        v: common_vendor.p({
          type: "closeempty",
          size: "18"
        }),
        w: common_vendor.t(`${Math.floor(countDown.value / 60)}:${countDown.value % 60}`),
        x: common_vendor.t(curDeviceNum.value),
        y: common_vendor.o(($event) => toFeedbackClick()),
        z: common_vendor.p({
          type: "info",
          size: "16"
        }),
        A: common_vendor.o(($event) => toFeedbackClick()),
        B: common_vendor.t("付款成功，设备已启动"),
        C: !isEnd.value && playing.value && playType.value === 0,
        D: common_vendor.p({
          type: "paperplane-filled",
          size: "14"
        }),
        E: common_vendor.t(deviceDetail.value.dropName),
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
        P: common_vendor.t(deviceDetail.value.dropName),
        Q: common_vendor.o(($event) => clickClose()),
        R: common_vendor.p({
          type: "closeempty",
          size: "18"
        }),
        S: common_vendor.t(`共使用${lastOrder.value.min}分钟，花费${lastOrder.value.cost}元`),
        T: common_vendor.o(($event) => toFeedbackClick()),
        U: common_vendor.p({
          type: "info",
          size: "16"
        }),
        V: common_vendor.o(($event) => toFeedbackClick()),
        W: common_vendor.o(($event) => clickClose()),
        X: isEnd.value,
        Y: !showQRScan.value
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"], ["__file", "D:/Git/res/bubble/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
