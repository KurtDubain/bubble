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
      },
      {
        id: 2,
        city: "天津",
        name: "开平镇",
        count: 99,
        time: 2314
      },
      {
        id: 3,
        city: "天津",
        name: "西青区",
        count: 21,
        time: 56
      },
      {
        id: 4,
        city: "天津",
        name: "万象城",
        count: 12,
        time: 432
      },
      {
        id: 5,
        city: "上海",
        name: "外滩",
        count: 655,
        time: 32432
      },
      {
        id: 6,
        city: "上海",
        name: "SOHO",
        count: 454,
        time: 6874
      },
      {
        id: 7,
        city: "上海",
        name: "浦东",
        count: 96,
        time: 546
      },
      {
        id: 8,
        city: "北京",
        name: "北京站",
        count: 213,
        time: 2312
      },
      {
        id: 9,
        city: "北京",
        name: "海淀黄庄",
        count: 223,
        time: 13
      },
      {
        id: 10,
        city: "北京",
        name: "TBD",
        count: 423,
        time: 132
      },
      {
        id: 11,
        city: "天津",
        name: "冶里村",
        count: 9,
        time: 234
      },
      {
        id: 12,
        city: "天津",
        name: "路北区",
        count: 121,
        time: 562
      },
      {
        id: 13,
        city: "天津",
        name: "唐山一中",
        count: 112,
        time: 4
      },
      {
        id: 14,
        city: "上海",
        name: "11",
        count: 55,
        time: 3232
      },
      {
        id: 15,
        city: "上海",
        name: "22",
        count: 4514,
        time: 687124
      },
      {
        id: 16,
        city: "上海",
        name: "33",
        count: 916,
        time: 51246
      },
      {
        id: 17,
        city: "北京",
        name: "秦皇岛",
        count: 212313,
        time: 23212
      }
    ]);
    let curCity = common_vendor.ref(null);
    let isCount = common_vendor.ref(true);
    const token = common_vendor.ref("");
    const cityData = [
      {
        value: "北京",
        text: "北京"
      },
      {
        value: "天津",
        text: "天津"
      },
      {
        value: "上海",
        text: "上海"
      }
    ];
    const getAllCity = async () => {
      try {
        const cityDataRes = await common_vendor.index.request({
          url: `https://allmetaahome:2333/dropoff/cityList`,
          method: "GET"
        });
      } catch (error) {
        console.error("获取排名数据成功", error);
      }
    };
    const getTotalListByCity = async () => {
      try {
        const cityTotalRes = await common_vendor.index.request({
          url: `https://allmetaahome:2333/order/rankListByCity?city=${curCity}`,
          method: "GET"
        });
      } catch (error) {
        console.error("获取排名数据成功", error);
      }
    };
    const curCityArray = common_vendor.ref([]);
    common_vendor.onMounted(async () => {
      curCity.value = "北京";
      await getAllCity();
      await getTotalListByCity();
      countRank();
      const cachedUserInfo = common_vendor.index.getStorageSync("isLogIn");
      if (cachedUserInfo) {
        await getUserInfo();
        isLogIn.value = true;
      }
    });
    const changeIsCount = () => {
      isCount.value = !isCount.value;
    };
    const timeRank = () => {
      curCityArray.value = totalData.value.filter((item) => item.city === curCity.value);
      curCityArray.value.sort((a, b) => b.time - a.time);
    };
    const countRank = () => {
      curCityArray.value = totalData.value.filter((item) => item.city === curCity.value);
      curCityArray.value.sort((a, b) => b.count - a.count);
    };
    common_vendor.watch(isCount, (newVal) => {
      if (!newVal) {
        timeRank();
      } else {
        countRank();
      }
    });
    common_vendor.watch(curCity, () => {
      if (isCount.value) {
        countRank();
      } else {
        timeRank();
      }
    });
    const userLogin = async () => {
      try {
        const loginRes = await common_vendor.index.login({
          provider: "weixin",
          success: (res) => {
            if (res.code) {
              sendLoginCode(res.code);
            } else {
              console.error("获取用户凭证失败", res.errMsg);
            }
          },
          fail: (err) => {
            console.error("登陆验证失败", err);
          }
        });
      } catch (error) {
        console.log("userLogin执行失败", error);
      }
    };
    const sendLoginCode = async (code) => {
      try {
        const res = await common_vendor.index.request({
          url: "https://allmetaahome.com:2333/wxApp/login",
          method: "POST",
          data: {
            code
          }
        });
        console.log("后端返回的数据", res.data);
        userInfo.value.userName = res.data.data.nickName;
        userInfo.value.avatar = res.data.data.avatar;
        userInfo.value.id = res.data.data.id;
        userInfo.value.bindingPhone = res.data.data.bindingPhone;
        token.value = res.data.data.token;
        console.log(userInfo.value);
        isLogIn.value = true;
        common_vendor.index.setStorageSync("Token", res.data.data.token);
        common_vendor.index.setStorageSync("isLogIn", true);
        common_vendor.index.setStorageSync("isBinding", userInfo.value.bindingPhone);
      } catch (error) {
        console.error("发送code到后端失败", error);
      }
    };
    const getUserPhoneNumber = async (e) => {
      console.log(e);
      try {
        const res = await common_vendor.index.request({
          url: `https://allmetaahome.com:2333/wxApp/bindPhone`,
          method: "POST",
          data: {
            code: e.detail.code,
            id: userInfo.value.id
          }
        });
        console.log(res);
        userInfo.value.phoneNumber = res.data.data.phone;
        isLogIn.value = true;
        common_vendor.index.setStorageSync("isBinding", userInfo.value.bindingPhone);
        common_vendor.index.setStorageSync("isLogIn", true);
      } catch (error) {
        console.error("WeChat login error:", error);
      }
    };
    const getUserInfo = async () => {
      try {
        const res = await common_vendor.index.request({
          url: `https://allmetaahome:2333/wxApp/detail`,
          method: "GET",
          header: {
            satoken: token.value
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
        a: common_vendor.unref(isLogIn) ? `${userInfo.value.avatar}` : `../../static/uni.png`,
        b: common_vendor.t(common_vendor.unref(isLogIn) ? `${userInfo.value.userName}已登录` : `未登录`),
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
          placeholder: "城市",
          localdata: cityData,
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
        r: common_vendor.f(curCityArray.value.slice(0, 5), (item, index, i0) => {
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
        A: common_vendor.o(getUserPhoneNumber),
        B: !userInfo.value.bindingPhone && common_vendor.unref(isLogIn),
        C: common_vendor.o(userLogin),
        D: !common_vendor.unref(isLogIn)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/Git/res/bubble/pages/mine/mine.vue"]]);
wx.createPage(MiniProgramPage);
