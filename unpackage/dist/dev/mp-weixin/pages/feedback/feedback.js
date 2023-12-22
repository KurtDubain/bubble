"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "feedback",
  setup(__props) {
    const chatMessages = common_vendor.ref([]);
    const inputText = common_vendor.ref("");
    const toView = common_vendor.ref("");
    let currentUserAvatar = common_vendor.ref("");
    const systemMessage = "欢迎您，有什么可以帮助您的吗？";
    const faqList = [
      "我想询问一下我的历史订单",
      "我想知道泡泡机的收费规则",
      "我希望切换人工客服",
      "泡泡机的操作技巧和注意事项"
    ];
    common_vendor.onMounted(() => {
      const storedChat = common_vendor.index.getStorageSync("chatMessages");
      currentUserAvatar.value = common_vendor.index.getStorageSync("userInfo");
      chatMessages.value = storedChat ? JSON.parse(storedChat) : [];
    });
    const sendMessage = () => {
      if (inputText.value.trim() === "") {
        return;
      }
      const newMessage = {
        isCurrentUser: true,
        content: inputText.value
      };
      chatMessages.value.push(newMessage);
      saveChatHistory();
      const serviceReply = {
        isCurrentUser: false,
        content: "我是在线客服，您可以说您遇到的问题"
      };
      setTimeout(() => {
        chatMessages.value.push(serviceReply);
        saveChatHistory();
      }, 500);
      inputText.value = "";
    };
    const copyToInput = (question) => {
      inputText.value = question;
    };
    const saveChatHistory = () => {
      common_vendor.index.setStorageSync("chatMessages", JSON.stringify(chatMessages.value));
      toView.value = `message${chatMessages.value.length - 1}`;
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(systemMessage),
        b: common_vendor.f(faqList, (question, index, i0) => {
          return {
            a: common_vendor.t(question),
            b: index,
            c: common_vendor.o(($event) => copyToInput(question), index)
          };
        }),
        c: common_vendor.f(chatMessages.value, (message, index, i0) => {
          return common_vendor.e({
            a: !message.isCurrentUser
          }, !message.isCurrentUser ? {} : {}, {
            b: common_vendor.t(message.content),
            c: message.isCurrentUser
          }, message.isCurrentUser ? {
            d: common_vendor.unref(currentUserAvatar)
          } : {}, {
            e: index,
            f: message.isCurrentUser ? 1 : "",
            g: !message.isCurrentUser ? 1 : ""
          });
        }),
        d: inputText.value,
        e: common_vendor.o(($event) => inputText.value = $event.detail.value),
        f: common_vendor.o(sendMessage)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a24b82f2"], ["__file", "D:/Git/res/bubble/pages/feedback/feedback.vue"]]);
wx.createPage(MiniProgramPage);
