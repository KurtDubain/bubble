<template>
  <view class="feedback-page">
    <!-- 聊天区域 -->
    <view class="chat-container">
      <scroll-view class="chat-scroll" scroll-y scroll-into-view="{{toView}}" scroll-with-animation>
        <view class="system-message">{{ systemMessage }}</view>
		<!-- 快捷处理 -->
		<view class="faq-container">
		  <view class="faq-card" v-for="(question, index) in faqList" :key="index" @click="copyToInput(question)">
			{{ question }}
		  </view>
		</view>
		
        <view v-for="(message, index) in chatMessages" :key="index" :class="{ 'user-message': message.isCurrentUser, 'service-message': !message.isCurrentUser }">
          <image v-if="!message.isCurrentUser" class="avatar" src="../../static/uni.png"></image>
          <view class="message-content" v-html="message.content"></view>
          <image v-if="message.isCurrentUser" class="avatar" :src="currentUserAvatar"></image>
        </view>
		
      </scroll-view>
    </view>

    <!-- 常见问题列表 -->
    

    <!-- 文本输入框和发送按钮 -->
    <view class="input-container">
      <textarea v-model="inputText" auto-focus="true" placeholder="输入你想反馈或投诉的内容"></textarea>
      <view class="send-button" @click="sendMessage">发送</view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const chatMessages = ref([]);//聊天总数据
const inputText = ref('');//输入框内容
const toView = ref('');//最新数据，用于滚动页面
let currentUserAvatar = ref('')//当前用户头像

const systemMessage = '欢迎您，有什么可以帮助您的吗？';
// 快捷消息
const faqList = [
  '我想询问一下我的历史订单',
  '我希望切换成人工客服',
  '我想要申请某一订单退款'
];

onMounted(() => {
	// 初始化聊天数据
	const storedChat = uni.getStorageSync('chatMessages');
	currentUserAvatar.value = uni.getStorageSync('userInfo')
	chatMessages.value = storedChat ? JSON.parse(storedChat) : [];
});
// 发送数据
const sendMessage = () => {
  if (inputText.value.trim() === '') {
    return;
  }
// 用户发消息
  const newMessage = {
    isCurrentUser: true,
    content: inputText.value,
  };
  chatMessages.value.push(newMessage);
  saveChatHistory();
  if(newMessage.isCurrentUser&&newMessage.content.includes('历史订单')){
	  const historyOrderReply = {
		  isCurrentUser:false,
		  content:`您可以点击下面的链接跳转到历史订单进行查看<br/><a href="/pages/index/index">点击跳转到历史订单页面</a>`
	  }
	  setTimeout(()=>{
	  		chatMessages.value.push(historyOrderReply)
	  		saveChatHistory()  
	  },1000)
	  
  }else if(newMessage.isCurrentUser&&newMessage.content.includes('人工')){
	  const serviceReply = {
		isCurrentUser:false,
		content:'正在为您转接人工客服....'
	  }
	  setTimeout(()=>{
	  	chatMessages.value.push(serviceReply)
	  	saveChatHistory()	  
	  },1000)
	  
  }else if(newMessage.isCurrentUser&&newMessage.content.includes('退款')){
	  const refundReply = {
		  isCurrentUser:false,
		  content:'如果您想对某一订单执行退款操作的话，您可以前往“历史订单”，根据日期选择您想退款的订单来进行退款，点击退款，并进行确认，即可等待反馈。如果有其他问题可以联系人工客服。'
	  }
	  setTimeout(()=>{
		chatMessages.value.push(refundReply)
		saveChatHistory()
	  },1000)
	  
  }else{
	  const genericReply = {
	        isCurrentUser: false,
	        content: '不好意思，暂时无法理解您的问题，您可以转人工客服进行询问。',
	      };
		  setTimeout(()=>{
			  chatMessages.value.push(genericReply);
			  saveChatHistory();
		  },1000)  
  }

  // 客服回复
  // const serviceReply = {
  //   isCurrentUser: false,
  //   content: '我是在线客服，您可以说您遇到的问题',
  // };

  // setTimeout(() => {
  //   chatMessages.value.push(serviceReply);
  //   saveChatHistory();
  // }, 500);

  inputText.value = '';
};
// 将快捷消息搞到输入框
const copyToInput = (question) => {
  inputText.value = question;
};
// 保存聊天记录到缓存中
const saveChatHistory = () => {
  
  uni.setStorageSync('chatMessages', JSON.stringify(chatMessages.value));

  
  toView.value = `message${chatMessages.value.length - 1}`;
};
</script>

<style scoped>
.feedback-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.chat-container {
  flex: 1;
  overflow: hidden;
}

.chat-scroll {
  height: 100%;
}

.system-message {
  text-align: center;
  color: #888888;
  margin-top: 10px;
}

.user-message {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
}

.service-message {
  display: flex;
  align-items: center;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin: 0 10px;
}

.message-content {
  background-color: #f0f0f0;
  padding: 8px;
  border-radius: 8px;
  margin: 5px;
  max-width: 70%;
}

.faq-container {
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx;
  border: 1px solid #e0e0e0;
  border-radius: 10rpx;
  box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
  margin: 30rpx;
}

.faq-card {
  background-color: #e0e0e0;
  padding: 10px;
  border-radius: 8px;
  margin: 5px;
  cursor: pointer;
}

.input-container {
  display: flex;
  align-items: center;
  padding: 10rpx;
  background-color: #f5f5f5; /* Background color for the input container */
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

textarea {
  flex: 1;
  resize: none;
  padding: 10rpx;
  border: none;
  border-radius: 8px;
  margin-right: 10rpx; 
  height: 60rpx; 
  /* font-size: 14rpx; */
  background-color: #ffffff; 
}

.send-button {
  background-color: #cc4143;
  color: #ffffff;
  padding: 10rpx;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>
