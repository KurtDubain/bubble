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
        <view class="exception-button" @click="showBackMoneyForm(order)"><uni-icons type="help" size="17" color="white"></uni-icons>申请退款</view>
		<view class="exception-button" ><uni-icons type="help" size="17" color="white"></uni-icons>已退款</view>
		<view class="exception-button" @click="orderPayment(order)"><uni-icons type="help" size="17" color="white"></uni-icons>待支付</view>
		
	  </view>
    </view>
	<view v-if="backMoneyForm" class="overlay">
	      <view class="modal">
			  <view class="form-header">
			  	<text class="form-header-text">确认订单信息</text>
			  </view>
			  <view class="form-item">
			  	<text class="form-label">订单日期:</text>
			  	<text class="form-value">{{ backMoneyDetail.playDate }}</text>
			  </view>
			  <view class="form-item">
			  	<text class="form-label">订单金额:</text>
			  	<text class="form-value">{{ backMoneyDetail.playCost }}元</text>
			  </view>
			  <view class="form-item">
			  	<text class="form-label">订单地点:</text>
			  	<text class="form-value">{{ backMoneyDetail.playLocation }}</text>
			  </view>
	        
		    	<text class="form-label">退款理由:</text>        
		    <view class="form-item-textarea">
		        
				<textarea v-model="refundReason" placeholder="请输入退款理由" class="form-textarea"></textarea>
		    </view>	        
			<view class="modal-buttons">
	          <button class="modal-button" @click="applyForRefund">申请退款</button>
              <button class="modal-button" @click="cancelRefund">取消</button>
	        </view>
	      </view>
	    </view>
  </view>
</template>

<script setup>
import { onMounted, ref } from 'vue';
const token = ref()
const backMoneyForm = ref(false)
const backMoneyDetail = ref('')
const refundReason = ref('')
const orderList = ref([]);
onMounted(async()=>{
	const Token = uni.getStorageSync('Token');
	if (Token) {
	    token.value = Token;
	}
	await getUserHistroyList()
})
// 获取历史订单
const getUserHistroyList = async()=>{
	try{
		const res = await uni.request({
			url:`https://allmetaahome.com:2333/order/historyListByUser`,
			method:"GET",
			header:{
				satoken:token.value
			}
		})
		orderList.value = res.data.data.map((item)=>({
			orderNum:item.orderNum,
			playDate:formattedDateTime(item.time),
			playLocation:item.dropName,
			playCost:item.money,
		})).sort((a,b)=>new Date(b.playDate) - new Date(a.playDate))
		
	}catch(error){
		console.error('用户历史订单获取失败',error)
	}
}
// 控制退款表单的显示
const showBackMoneyForm = (order)=>{
	backMoneyForm.value = true
	backMoneyDetail.value = order
}
// 发起退款申请
const applyForRefund = async()=>{
	try{
		const res = await uni.request({
			url:`https://allmetaahome.com:2333/order/refundMini/`,
			method:"POST",
			header:{
				satoken:token.value
			},
			data:{
				orderNum:backMoneyDetail.value.orderNum,
				refundReason:refundReason.value
			}
		})
		backMoneyForm.value = false
		if(res.data.code===200){
			uni.showToast({
				title:"退款申请发送成功",
				icon:'success'
			})
		}else{
			uni.showToast({
				title:"退款失败",
				icon:'error'
			})
		}
	}catch(error){
		console.log('退款申请异常',error)
	}
}
// 对未支付的订单发起付款操作
const orderPayment = async(order)=>{
	try{
		const res = await uni.request({
			url:'https://allmetaahome.com:2333/order/requestPayOrder',
			method:"POST",
			data:{
				"orderNum":order.orderNum ,
				"amount": order.money,
			    "times": order.time
			},
			header:{
				satoken:token.value
			}
		})
		let orderInfo = {
			appId: "wx8c9cc8582d153543",
			timeStamp: res.data.data.timeStamp,
			nonceStr: res.data.data.nonceStr,
			// package: "Sign=WXPay",
			package:res.data.data.packageX,
			signType: res.data.data.signType,
			paySign: res.data.data.paySign,
		}
		await uni.requestPayment({
			"provider":"wxpay",
			...orderInfo,
			success(res){
				console.log('支付成功',res)
			},
			fail(error){
				console.log('支付遇到了一点问题',error)
			}
		})
	}catch(error){
		console.error('支付失败',error)
	}
}

const formattedDateTime = (time)=>{
	const dateTime = new Date(time)
	const month = (dateTime.getMonth()+1).toString().padStart(2,"0")
	const day = dateTime.getDate().toString().padStart(2,"0")
	const hours = dateTime.getHours().toString().padStart(2,"0")
	const minutes = dateTime.getMinutes().toString().padStart(2,"0")
	return `${month}-${day} ${hours}:${minutes}`
}
const cancelRefund = ()=>{
	backMoneyForm.value = false
}
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
  margin: 30rpx;
  padding: 30rpx;
  background-color: #ffffff;
  border-radius: 30rpx;
  box-shadow: 0 9rpx 10rpx rgba(0, 0, 0, 0.1);
}

.top-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.play-date,
.play-location {
  font-size: 25rpx;
  color: #888888;
}

.bottom-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30rpx;
}

.play-cost {
  font-size: 35rpx;
  color: #000000;
}

.exception-button {
	background-color: #cc4143;
	color: #ffffff;
    padding: 10rpx 15rpx;
    border-radius: 10rpx;
    font-size: 30rpx;
    cursor: pointer;
	display: flex;
	justify-content: center;
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  /* flex-direction: column; */
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal {
  background: #fff;
  padding: 20rpx;
  border-radius: 10rpx;
  width:500rpx;
}
.form-header{
	
}
.form-item {
  display: flex;
  margin-bottom: 15rpx;
}
.modal-button {
  flex: 1;
  margin: 15rpx 0 15rpx 0;
  font-size: 27rpx;
  border-radius: 15rpx;
  text-align: center;
  background-color: #cc4143;
  color: #ffffff;
  cursor: pointer;
}
.form-label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 5rpx;
}

.form-value {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 15rpx;
}

.form-textarea {
  width: 100%;
  margin-top: 10rpx;
  padding: 15rpx;
  border: 1rpx solid #ccc;
  border-radius: 5rpx;
  height: 100rpx;
}
.form-item-textarea{
	height: 20%;
	display: flex;
	align-items: center;
	justify-content: center;
}
.form-header {
  /* background-color: #cc4143; */
  padding: 5rpx;
  margin-bottom: 12rpx;
  text-align: center;
}

.form-header-text {
  font-size: 32rpx;
  /* color: #ffffff; */
}
/* textarea {
  width: 100%;
  margin-top: 10rpx;
  padding: 5rpx;
  border: 1rpx solid #ccc;
  border-radius: 5rpx;
} */
</style>
