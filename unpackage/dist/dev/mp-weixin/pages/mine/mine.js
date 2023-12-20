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
        name: "苏州街投放点",
        count: 23,
        time: 123
      },
      {
        id: 1,
        city: "北京",
        name: "通州投放点",
        count: 43,
        time: 532
      },
      {
        id: 2,
        city: "天津",
        name: "开平镇投放点",
        count: 99,
        time: 2314
      },
      {
        id: 3,
        city: "天津",
        name: "西青区投放点",
        count: 21,
        time: 56
      },
      {
        id: 4,
        city: "天津",
        name: "万象城投放点",
        count: 12,
        time: 432
      },
      {
        id: 5,
        city: "上海",
        name: "外滩投放点",
        count: 655,
        time: 32432
      },
      {
        id: 6,
        city: "上海",
        name: "SOHO投放点",
        count: 454,
        time: 6874
      },
      {
        id: 7,
        city: "上海",
        name: "浦东投放点",
        count: 96,
        time: 546
      },
      {
        id: 8,
        city: "北京",
        name: "北京站投放点",
        count: 213,
        time: 2312
      },
      {
        id: 9,
        city: "北京",
        name: "海淀黄庄投放点",
        count: 223,
        time: 13
      },
      {
        id: 10,
        city: "北京",
        name: "TBD投放点",
        count: 423,
        time: 132
      },
      {
        id: 11,
        city: "天津",
        name: "冶里村投放点",
        count: 9,
        time: 234
      },
      {
        id: 12,
        city: "天津",
        name: "路北区投放点",
        count: 121,
        time: 562
      },
      {
        id: 13,
        city: "天津",
        name: "唐山一中投放点",
        count: 112,
        time: 4
      },
      {
        id: 14,
        city: "上海",
        name: "11投放点",
        count: 55,
        time: 3232
      },
      {
        id: 15,
        city: "上海",
        name: "22投放点",
        count: 4514,
        time: 687124
      },
      {
        id: 16,
        city: "上海",
        name: "33投放点",
        count: 916,
        time: 51246
      },
      {
        id: 17,
        city: "北京",
        name: "秦皇岛投放点",
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
    const changeUserInfo = () => {
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => changeUserInfo()),
        b: common_vendor.p({
          type: "compose",
          size: "26"
        }),
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
          return common_vendor.e({
            a: index < 3
          }, index < 3 ? {
            b: index < 3 ? `../../static/rank_icon/${index + 1}.png` : ""
          } : {}, {
            c: common_vendor.t(index < 3 ? "" : index + 1),
            d: "7c2ebfa5-14-" + i0 + "," + ("7c2ebfa5-13-" + i0),
            e: common_vendor.t(item.name),
            f: "7c2ebfa5-15-" + i0 + "," + ("7c2ebfa5-13-" + i0),
            g: common_vendor.t(item.count),
            h: "7c2ebfa5-16-" + i0 + "," + ("7c2ebfa5-13-" + i0),
            i: common_vendor.t(item.time),
            j: "7c2ebfa5-17-" + i0 + "," + ("7c2ebfa5-13-" + i0),
            k: index,
            l: "7c2ebfa5-13-" + i0 + ",7c2ebfa5-7"
          });
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
