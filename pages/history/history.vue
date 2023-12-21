<template>
  <view>
	  <!-- 分为了上下两部分 -->
    <view class="card" v-for="(order, index) in orderList" :key="index">
      <view class="top-container">
        <text class="play-date">{{ order.playDate }}</text>
        <view >
        	<uni-icons type="paperplane-filled" size="14"></uni-icons>
			<text class="play-location">{{ order.playLocation }}</text>
        </view>
		
      </view>
      <view class="bottom-container">
        <text class="play-cost" style="font-weight: bold;">{{ order.playCost }}元</text>
        <view class="exception-button" @click="handleException"><uni-icons type="help" size="17" color="white"></uni-icons>出现异常？</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const orderList = ref([
  {
    playDate: '08.29 16:00-16:12',
    playLocation: 'xx省xx市xx县xx村A',
    playCost: '50',
  },
  {
    playDate: '08.30 14:30-15:00',
    playLocation: 'xx省xx市xx县xx村B',
    playCost: '60',
  },
]);
// 跳转到异常反馈界面
const handleException = () => {
	uni.navigateTo({
		url: "/pages/feedback/feedback"
	})
	console.log('出现异常？按钮被点击');
};
</script>

<style scoped>
.card {
  margin: 10px;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.top-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.play-date,
.play-location {
  font-size: 12px;
  color: #888888;
}

.bottom-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.play-cost {
  font-size: 16px;
  color: #000000;
}

.exception-button {
	background-color: #cc4143;
	color: #ffffff;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 12px;
    cursor: pointer;
	display: flex;
	justify-content: center;
}
</style>
