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
      "我希望切换成人工客服",
      "我想要申请某一订单退款"
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
      if (newMessage.isCurrentUser && newMessage.content.includes("历史订单")) {
        const historyOrderReply = {
          isCurrentUser: false,
          content: `您可以点击下面的链接跳转到历史订单进行查看<br/><a href="/pages/index/index">点击跳转到历史订单页面</a>`
        };
        setTimeout(() => {
          chatMessages.value.push(historyOrderReply);
          saveChatHistory();
        }, 1e3);
      } else if (newMessage.isCurrentUser && newMessage.content.includes("人工")) {
        const serviceReply = {
          isCurrentUser: false,
          content: "正在为您转接人工客服...."
        };
        setTimeout(() => {
          chatMessages.value.push(serviceReply);
          saveChatHistory();
        }, 1e3);
      } else if (newMessage.isCurrentUser && newMessage.content.includes("退款")) {
        const refundReply = {
          isCurrentUser: false,
          content: "如果您想对某一订单执行退款操作的话，您可以前往“历史订单”，根据日期选择您想退款的订单来进行退款，点击退款，并进行确认，即可等待反馈。如果有其他问题可以联系人工客服。"
        };
        setTimeout(() => {
          chatMessages.value.push(refundReply);
          saveChatHistory();
        }, 1e3);
      } else {
        const genericReply = {
          isCurrentUser: false,
          content: "不好意思，暂时无法理解您的问题，您可以转人工客服进行询问。"
        };
        setTimeout(() => {
          chatMessages.value.push(genericReply);
          saveChatHistory();
        }, 1e3);
      }
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
            b: message.content,
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
