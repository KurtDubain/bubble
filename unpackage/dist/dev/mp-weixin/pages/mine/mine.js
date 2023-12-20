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
    const curCityArray = common_vendor.ref([]);
    common_vendor.onMounted(() => {
      curCity.value = "北京";
      countRank();
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
      if (isCount) {
        countRank();
      } else {
        timeRank();
      }
    });
    const loginWithWechat = () => {
      common_vendor.index.getUserProfile({
        desc: "必须授权",
        success: (res) => {
          const user = res.userInfo;
          common_vendor.index.setStorageSync("user", user);
          console.log("用户信息", user);
          userInfo.value = user;
          common_vendor.index.cloud.callFunction({
            name: "getopenid",
            success: (res2) => {
              console.log("获取openid成功", res2.result.openid);
              const openId = res2.result.openid;
              common_vendor.index.cloud.database().collection("user").where({
                _openid: openId
              }).get().then((res3) => {
                const data = res3.data;
                if (data.length === 0) {
                  console.log("用户不存在，进行数据库插入操作");
                  common_vendor.index.cloud.database().collection("user").add({
                    data: {
                      nickName: user.nickName,
                      avatarUrl: user.avatarUrl
                    }
                  });
                }
              });
            },
            fail: (err) => {
              console.error("调用云函数失败", err);
            }
          });
        },
        fail: (res) => {
          console.log("授权失败", res);
        }
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          type: "compose",
          size: "26"
        }),
        b: common_vendor.o(loginWithWechat),
        c: common_vendor.p({
          type: "email",
          size: "26",
          color: "#cc4143"
        }),
        d: common_vendor.p({
          type: "forward",
          size: "24"
        }),
        e: common_vendor.p({
          type: "help",
          size: "26",
          color: "#cc4143"
        }),
        f: common_vendor.p({
          type: "forward",
          size: "24"
        }),
        g: common_vendor.p({
          type: "list",
          size: "26",
          color: "#cc4143"
        }),
        h: common_vendor.t(common_vendor.unref(isCount) ? "按时长" : "按次数"),
        i: common_vendor.o(($event) => changeIsCount()),
        j: common_vendor.o(($event) => common_vendor.isRef(curCity) ? curCity.value = $event : curCity = $event),
        k: common_vendor.p({
          placeholder: "城市",
          localdata: cityData,
          clear: false,
          modelValue: common_vendor.unref(curCity)
        }),
        l: common_vendor.p({
          width: "50",
          align: "center"
        }),
        m: common_vendor.p({
          width: "120",
          align: "center"
        }),
        n: common_vendor.p({
          width: "70",
          align: "center"
        }),
        o: common_vendor.p({
          width: "70",
          align: "center"
        }),
        p: common_vendor.f(curCityArray.value, (item, index, i0) => {
          return {
            a: common_vendor.t(index + 1),
            b: "7c2ebfa5-14-" + i0 + "," + ("7c2ebfa5-13-" + i0),
            c: common_vendor.t(item.name),
            d: "7c2ebfa5-15-" + i0 + "," + ("7c2ebfa5-13-" + i0),
            e: common_vendor.t(item.count),
            f: "7c2ebfa5-16-" + i0 + "," + ("7c2ebfa5-13-" + i0),
            g: common_vendor.t(item.time),
            h: "7c2ebfa5-17-" + i0 + "," + ("7c2ebfa5-13-" + i0),
            i: index,
            j: "7c2ebfa5-13-" + i0 + ",7c2ebfa5-7"
          };
        }),
        q: common_vendor.p({
          align: "center"
        }),
        r: common_vendor.p({
          align: "center"
        }),
        s: common_vendor.p({
          align: "center"
        }),
        t: common_vendor.p({
          align: "center"
        }),
        v: common_vendor.p({
          loading: _ctx.loading,
          border: true,
          stripe: true
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7c2ebfa5"], ["__file", "D:/Git/res/bubble/pages/mine/mine.vue"]]);
wx.createPage(MiniProgramPage);
