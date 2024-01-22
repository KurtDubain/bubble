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
        content: inputText.value,
        // method:''
        type: 0
      };
      chatMessages.value.push(newMessage);
      saveChatHistory();
      if (newMessage.isCurrentUser && newMessage.content.includes("历史订单")) {
        const historyOrderReply = {
          isCurrentUser: false,
          content: `您可以点击下面的链接跳转到历史订单进行查看`,
          // method:'点我跳转到历史页面'	
          type: 0
        };
        setTimeout(() => {
          chatMessages.value.push(historyOrderReply);
          saveChatHistory();
          const nextReply = {
            isCurrentUser: false,
            content: "",
            type: 2
          };
          setTimeout(() => {
            chatMessages.value.push(nextReply);
            saveChatHistory();
          }, 500);
        }, 1e3);
      } else if (newMessage.isCurrentUser && newMessage.content.includes("人工")) {
        const serviceReply = {
          isCurrentUser: false,
          content: "正在为您转接人工客服....",
          // method:'人工客服'
          type: 0
        };
        setTimeout(() => {
          chatMessages.value.push(serviceReply);
          saveChatHistory();
          const nextReply = {
            isCurrentUser: false,
            content: "",
            type: 1
          };
          setTimeout(() => {
            chatMessages.value.push(nextReply);
            saveChatHistory();
          }, 500);
        }, 1e3);
      } else if (newMessage.isCurrentUser && newMessage.content.includes("退款")) {
        const refundReply = {
          isCurrentUser: false,
          content: "如果您想对某一订单执行退款操作的话，您可以前往“历史订单”，根据日期选择您想退款的订单来进行退款，点击退款，并进行确认，即可等待反馈。如果有其他问题可以联系人工客服。",
          // method:'继续退款'
          type: 0
        };
        setTimeout(() => {
          chatMessages.value.push(refundReply);
          saveChatHistory();
          const nextReply = {
            isCurrentUser: false,
            content: "",
            type: 2
          };
          setTimeout(() => {
            chatMessages.value.push(nextReply);
            saveChatHistory();
          }, 500);
        }, 1e3);
      } else {
        const genericReply = {
          isCurrentUser: false,
          content: "不好意思，暂时无法理解您的问题，您可以转人工客服进行询问。",
          // method:'人工客服'
          type: 0
        };
        setTimeout(() => {
          chatMessages.value.push(genericReply);
          saveChatHistory();
        }, 1e3);
      }
      inputText.value = "";
    };
    const methodClick = (type) => {
      if (type === 2) {
        common_vendor.index.navigateTo({
          url: "/pages/history/history"
        });
      } else if (type === 3) {
        console.log("开发ing");
      }
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
            c: common_vendor.o(($event) => copyToInput(question))
          };
        }),
        c: common_vendor.f(chatMessages.value, (message, index, i0) => {
          return common_vendor.e({
            a: !message.isCurrentUser
          }, !message.isCurrentUser ? {} : {}, {
            b: message.type === 0
          }, message.type === 0 ? {
            c: common_vendor.t(message.content)
          } : {}, {
            d: message.type === 1
          }, message.type === 1 ? {} : {}, {
            e: message.type === 2
          }, message.type === 2 ? {
            f: common_vendor.o(($event) => methodClick(message.type))
          } : {}, {
            g: message.type === 3
          }, message.type === 3 ? {
            h: common_vendor.o(($event) => methodClick(message.type))
          } : {}, {
            i: message.isCurrentUser
          }, message.isCurrentUser ? {} : {}, {
            j: index,
            k: message.isCurrentUser ? 1 : "",
            l: !message.isCurrentUser ? 1 : ""
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
my.createPage(MiniProgramPage);
