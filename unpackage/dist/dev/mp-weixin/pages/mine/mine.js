"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  (_easycom_uni_icons2 + _easycom_uni_data_select2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_data_select = () => "../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_data_select)();
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
        l: common_vendor.t(curCityArray.value[1].name),
        m: common_vendor.p({
          type: "fire-filled",
          size: "15",
          color: "#cc4143"
        }),
        n: common_vendor.t(curCityArray.value[1].count),
        o: common_vendor.unref(isCount),
        p: common_vendor.t(Math.floor(curCityArray.value[1].time / 60)),
        q: !common_vendor.unref(isCount),
        r: common_vendor.t(curCityArray.value[0].name),
        s: common_vendor.p({
          type: "fire-filled",
          size: "15",
          color: "#cc4143"
        }),
        t: common_vendor.t(curCityArray.value[0].count),
        v: common_vendor.unref(isCount),
        w: common_vendor.t(Math.floor(curCityArray.value[0].time / 60)),
        x: !common_vendor.unref(isCount),
        y: common_vendor.t(curCityArray.value[2].name),
        z: common_vendor.p({
          type: "fire-filled",
          size: "15",
          color: "#cc4143"
        }),
        A: common_vendor.t(curCityArray.value[2].count),
        B: common_vendor.unref(isCount),
        C: common_vendor.t(Math.floor(curCityArray.value[2].time / 60)),
        D: !common_vendor.unref(isCount)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7c2ebfa5"], ["__file", "D:/Git/res/bubble/pages/mine/mine.vue"]]);
wx.createPage(MiniProgramPage);
