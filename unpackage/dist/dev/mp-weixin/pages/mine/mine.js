"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_uni_th2 = common_vendor.resolveComponent("uni-th");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  (_easycom_uni_icons2 + _easycom_uni_data_select2 + _easycom_uni_th2 + _easycom_uni_tr2 + _easycom_uni_td2 + _easycom_uni_table2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_data_select = () => "../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_th = () => "../../uni_modules/uni-table/components/uni-th/uni-th.js";
const _easycom_uni_tr = () => "../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_uni_td = () => "../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_table = () => "../../uni_modules/uni-table/components/uni-table/uni-table.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_data_select + _easycom_uni_th + _easycom_uni_tr + _easycom_uni_td + _easycom_uni_table)();
}
const _sfc_main = {
  __name: "mine",
  setup(__props) {
    common_vendor.ref("");
    let isLogIn = common_vendor.ref(false);
    let isBinding = common_vendor.ref(false);
    const userInfo = common_vendor.ref({});
    const totalData = common_vendor.ref([
      {
        id: 0,
        city: "北京",
        name: "苏州街",
        count: 23,
        time: 123
      },
      {
        id: 1,
        city: "北京",
        name: "通州",
        count: 43,
        time: 532
      }
    ]);
    let curCity = common_vendor.ref(null);
    let isCount = common_vendor.ref(true);
    const token = common_vendor.ref("");
    const cityData = common_vendor.ref([]);
    const getAllCity = async () => {
      try {
        const cityDataRes = await common_vendor.index.request({
          url: `https://allmetaahome.com:2333/dropoff/cityList`,
          method: "GET"
        });
        cityData.value = cityDataRes.data.data.map((item) => ({
          value: item,
          text: item
        }));
      } catch (error) {
        console.error("获取城市数据失败", error);
      }
    };
    const getTotalListByCity = async () => {
      try {
        const cityTotalRes = await common_vendor.index.request({
          url: `https://allmetaahome.com:2333/order/rankListByCity?city=${curCity.value}&type=${isCount.value ? 0 : 1}`,
          method: "GET"
        });
        totalData.value = cityTotalRes.data.data.map((item) => ({
          id: item.dropNum,
          city: item.city,
          name: item.dropName,
          count: item.amount,
          time: item.times
        }));
      } catch (error) {
        console.error("获取排名数据成功", error);
      }
    };
    common_vendor.onMounted(async () => {
      curCity.value = "北京市";
      await getAllCity();
      await getTotalListByCity();
      const logState = common_vendor.index.getStorageSync("isLogIn");
      const bindingState = common_vendor.index.getStorageSync("isBinding");
      if (logState) {
        token.value = common_vendor.index.getStorageSync("Token");
        if (bindingState) {
          isBinding.value = true;
        }
        await getUserInfo();
        isLogIn.value = true;
      }
    });
    const changeIsCount = () => {
      isCount.value = !isCount.value;
    };
    common_vendor.watch(isCount, async () => {
      await getTotalListByCity();
    });
    common_vendor.watch(curCity, async () => {
      await getTotalListByCity();
    });
    const userLogin = async () => {
      try {
        const providerInfo = await common_vendor.index.getProvider({
          service: "oauth"
        });
        console.log(providerInfo.provider);
        if (providerInfo.provider.indexOf("weixin") !== -1) {
          await wxLogin();
        } else if (providerInfo.provider.indexOf("alipay") !== -1) {
          await aliLogin();
        } else {
          console.error("不支持的登陆服务");
        }
      } catch (error) {
        console.error("用户登陆失败", error);
      }
    };
    const wxLogin = async () => {
      try {
        const loginRes = await common_vendor.index.login({
          provider: "weixin",
          success: (res) => {
            if (res.code) {
              sendLoginCode(res.code, "wx");
            } else {
              console.error("获取微信用户code失败");
            }
          },
          fail: (error) => {
            console.error("微信登陆请求异常", error);
          }
        });
      } catch (error) {
        console.error("微信登陆异常", error);
      }
    };
    const aliLogin = async () => {
      try {
        const authRes = await common_vendor.index.login({
          provider: "alipay",
          success: (res) => {
            if (res.code) {
              sendLoginCode(res.code, "ali");
            } else {
              console.error("获取支付宝用户code失败");
            }
          },
          fail: (error) => {
            console.error("支付宝登录请求异常", error);
          }
        });
      } catch (error) {
        console.log("支付宝登录异常", error);
      }
    };
    const sendLoginCode = async (code, platform) => {
      try {
        const res = await common_vendor.index.request({
          url: "https://allmetaahome.com:2333/wxApp/login",
          method: "POST",
          data: {
            code,
            platform
            //或者ali
          }
        });
        console.log("后端返回的数据", res.data);
        userInfo.value.userName = res.data.data.nickName;
        userInfo.value.avatar = res.data.data.avatar;
        userInfo.value.id = res.data.data.id;
        userInfo.value.bindingPhone = res.data.data.bindingPhone;
        userInfo.value.platform = res.data.data.platform;
        token.value = res.data.data.token;
        console.log(userInfo.value);
        isLogIn.value = true;
        common_vendor.index.setStorageSync("Token", res.data.data.token);
        common_vendor.index.setStorageSync("isLogIn", true);
        common_vendor.index.setStorageSync("isBinding", userInfo.value.bindingPhone);
        isBinding.value = userInfo.value.bindingPhone;
      } catch (error) {
        console.error("发送code到后端失败", error);
      }
    };
    const getUserPhoneNumberByWx = async (e) => {
      console.log(e);
      try {
        const res = await common_vendor.index.request({
          url: `https://allmetaahome.com:2333/wxApp/bindPhone`,
          method: "POST",
          data: {
            code: e.detail.code,
            id: userInfo.value.id,
            platform: "wx"
          }
        });
        console.log(res);
        userInfo.value.phoneNumber = res.data.data.phone;
        isLogIn.value = true;
        isBinding.value = true;
        common_vendor.index.setStorageSync("isBinding", userInfo.value.bindingPhone);
        common_vendor.index.setStorageSync("isLogIn", true);
      } catch (error) {
        console.error("WeChat login error:", error);
      }
    };
    const getUserPhoneNumberByAli = async () => {
      try {
        my.getPhoneNumber({
          scopes: "auth_user",
          success: (res) => {
            let resData = JSON.parse(res.response);
            const resPhone = common_vendor.index.request({
              url: `https://allmetaahome.com:2333/wxApp/bindPhone`,
              method: "POST",
              data: {
                code: resData.response,
                id: userInfo.value.id,
                platform: "ali"
              }
            });
            userInfo.value.phoneNumber = resPhone.data.data.phone;
            isLogIn.value = true;
            isBinding.value = true;
            common_vendor.index.setStorageSync("isBinding", userInfo.value.bindingPhone);
            common_vendor.index.setStorageSync("isLogIn", true);
          },
          fail: (err) => {
            console.error("手机号获取异常", err);
          }
        });
      } catch (error) {
        console.error("获取阿里手机号失败", error);
      }
    };
    const getUserInfo = async () => {
      try {
        const res = await common_vendor.index.request({
          url: `https://allmetaahome.com:2333/wxApp/detail`,
          method: "GET",
          header: {
            Authorization: token.value
          }
        });
        userInfo.value.userName = res.data.data.nickName;
        userInfo.value.avatar = res.data.data.avatar;
      } catch (error) {
        console.error("用户信息获取失败", error);
      }
    };
    const toHistoryClick = () => {
      if (isLogIn.value) {
        common_vendor.index.navigateTo({
          url: "/pages/history/history"
        });
      } else {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none"
        });
      }
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
    const logOut = () => {
      userInfo.value = {};
      isLogIn.value = false;
      common_vendor.index.removeStorageSync("isBinding");
      common_vendor.index.removeStorageSync("Token");
      common_vendor.index.removeStorageSync("isLogIn");
      common_vendor.index.removeStorageSync("chatMessages");
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.unref(isLogIn) ? `${userInfo.value.avatar}` : `../../static/未登录头像.png`,
        b: common_vendor.t(common_vendor.unref(isLogIn) ? `${userInfo.value.userName}` : `未登录`),
        c: common_vendor.p({
          type: "email",
          size: "26",
          color: "#cc4143"
        }),
        d: common_vendor.p({
          type: "forward",
          size: "24"
        }),
        e: common_vendor.o(($event) => toHistoryClick()),
        f: common_vendor.p({
          type: "help",
          size: "26",
          color: "#cc4143"
        }),
        g: common_vendor.p({
          type: "forward",
          size: "24"
        }),
        h: common_vendor.o(($event) => toFeedbackClick()),
        i: common_vendor.p({
          type: "list",
          size: "26",
          color: "#cc4143"
        }),
        j: common_vendor.t(common_vendor.unref(isCount) ? "按时长" : "按次数"),
        k: common_vendor.o(($event) => changeIsCount()),
        l: common_vendor.o(($event) => common_vendor.isRef(curCity) ? curCity.value = $event : curCity = $event),
        m: common_vendor.p({
          placeholder: "北京市",
          localdata: cityData.value,
          clear: false,
          modelValue: common_vendor.unref(curCity)
        }),
        n: common_vendor.p({
          width: "50",
          align: "center"
        }),
        o: common_vendor.p({
          width: "120",
          align: "center"
        }),
        p: common_vendor.t(common_vendor.unref(isCount) ? "次数" : "时长"),
        q: common_vendor.p({
          width: "70",
          align: "center"
        }),
        r: common_vendor.f(totalData.value.slice(0, 5), (item, index, i0) => {
          return {
            a: common_vendor.t(index + 1),
            b: "367b2d30-12-" + i0 + "," + ("367b2d30-11-" + i0),
            c: common_vendor.t(item.name),
            d: "367b2d30-13-" + i0 + "," + ("367b2d30-11-" + i0),
            e: common_vendor.t(common_vendor.unref(isCount) ? `${item.count}` : `${item.time}`),
            f: "367b2d30-14-" + i0 + "," + ("367b2d30-11-" + i0),
            g: index,
            h: "367b2d30-11-" + i0 + ",367b2d30-6"
          };
        }),
        s: common_vendor.p({
          align: "center"
        }),
        t: common_vendor.p({
          align: "center"
        }),
        v: common_vendor.p({
          align: "center"
        }),
        w: common_vendor.p({
          loading: _ctx.loading,
          border: true,
          stripe: true
        }),
        x: common_vendor.o(($event) => logOut()),
        y: common_vendor.unref(isLogIn),
        z: common_vendor.p({
          type: "compose",
          size: "26"
        }),
        A: common_vendor.o(getUserPhoneNumberByWx),
        B: !common_vendor.unref(isBinding) && common_vendor.unref(isLogIn),
        C: common_vendor.p({
          type: "compose",
          size: "26"
        }),
        D: common_vendor.o(getUserPhoneNumberByAli),
        E: common_vendor.o((...args) => _ctx.getUserPhoneNumberByAliError && _ctx.getUserPhoneNumberByAliError(...args)),
        F: !common_vendor.unref(isBinding) && common_vendor.unref(isLogIn),
        G: common_vendor.o(userLogin),
        H: !common_vendor.unref(isLogIn)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/Git/res/bubble/pages/mine/mine.vue"]]);
wx.createPage(MiniProgramPage);
