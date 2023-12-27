<template>
	<view class="container">
		<view class="card_view">
			<view class="header_view">
				<image :src=" isLogIn?`../../static/uni.png`:`../../static/uni.png` "></image>
				<text>{{isLogIn?`${userInfo.phoneNumber}已登录`:`未登录`}}</text>
				<!-- <view class="header-login" v-show="!isLogIn" @click="getUserPhone()">
					<text>手机号登录</text>
				</view> -->
			</view>
		</view>
		
		
		
		<!-- 菜单栏 -->
		<view class="card_view">
			<view class="items" @click="toHistoryClick()">
				<uni-icons type="email" size="26" color="#cc4143"></uni-icons>
				<text>历史订单</text>
				<view style="flex: 1"></view>
				<uni-icons type="forward" size="24"></uni-icons>
			</view>
			<view style="height: 6rpx;"></view>
			<view class="items" @click="toFeedbackClick()">
				<uni-icons type="help" size="26" color="#cc4143"></uni-icons>
				<text>投诉或反馈</text>
				<view style="flex: 1"></view>
				<uni-icons type="forward" size="24"></uni-icons>
			</view>
		</view>
		<!-- 排行榜卡片 -->
		<view class="card_view">
			<view class="rank-header">
				<view class="rank-icon">
					<uni-icons type="list" size="26" color="#cc4143"></uni-icons>
				</view>
				<view class="rank-name">
					<text>排行榜</text>
				</view>
				<view class="rank-click">
				
					<button class="rank-change" type="default" size="mini" @click="changeIsCount()">{{ isCount?'按时长':'按次数' }}</button>
					<view class="rank-select">
						<uni-data-select placeholder="城市" :localdata="cityData" v-model="curCity" :clear="false">
							
						</uni-data-select>
					</view>
				</view>	
			</view>
			
			<!-- 排行榜表格 -->
			<view class="rank-table">
				<uni-table  :loading="loading" border stripe>
					<!-- 表头 -->
					<uni-tr>
						<uni-th width='50' align="center">排名</uni-th>
						<uni-th width='120' align="center">名称</uni-th>
						<uni-th width='70' align="center">{{ isCount?'次数':'时长' }}</uni-th>
						<!-- <uni-th width='70' align="center">时长</uni-th> -->
					</uni-tr>
					<!-- 具体数据 -->
					<uni-tr v-for="(item,index) in curCityArray.slice(0,5)" :key="index">
						<uni-td align="center">
							<view class="rank-list-index">
								<text class="rank-number">{{ index + 1 }}</text>
							</view>
						</uni-td>
						<uni-td align="center">
							<text class="rank-list-name">{{ item.name }}</text>
						</uni-td>
						<uni-td align="center">
							<text class="rank-list-count">{{ isCount?`${item.count}`:`${item.time}` }}</text>
						</uni-td>
					</uni-tr>
				</uni-table>
			</view>
			
		</view>
		<!-- 退出登录按钮 -->
		<view v-show="isLogIn">
			<view class="button" @click="logOut()">退出登录</view>
		</view>
		<button class="login-button" open-type="getPhoneNumber" @getphonenumber="getUserPhoneNumber">用户登陆<uni-icons type="compose" size="26" ></uni-icons></button>

		
	</view>
</template>

<script setup>
	import { ref,onMounted, watch } from 'vue'
	const code= ref('')
	// 判断用户登陆状态
	let isLogIn = ref(false)
	const userInfo = ref(null)
	// 初始化全部数据
	const totalData = ref([
		{
			id:0,
			city:'北京',
			name:'苏州街',
			count:23,
			time:123
		},
		{
			id:1,
			city:'北京',
			name:'通州',
			count:43,
			time:532
		},
		{
			id:2,
			city:'天津',
			name:'开平镇',
			count:99,
			time:2314
		},
		{
			id:3,
			city:'天津',
			name:'西青区',
			count:21,
			time:56
		},
		{
			id:4,
			city:'天津',
			name:'万象城',
			count:12,
			time:432
		},
		{
			id:5,
			city:'上海',
			name:'外滩',
			count:655,
			time:32432
		},
		{
			id:6,
			city:'上海',
			name:'SOHO',
			count:454,
			time:6874
		},
		{
			id:7,
			city:'上海',
			name:'浦东',
			count:96,
			time:546
		},
		{
			id:8,
			city:'北京',
			name:'北京站',
			count:213,
			time:2312
		},
		{
			id:9,
			city:'北京',
			name:'海淀黄庄',
			count:223,
			time:13
		},
		{
			id:10,
			city:'北京',
			name:'TBD',
			count:423,
			time:132
		},
		{
			id:11,
			city:'天津',
			name:'冶里村',
			count:9,
			time:234
		},
		{
			id:12,
			city:'天津',
			name:'路北区',
			count:121,
			time:562
		},
		{
			id:13,
			city:'天津',
			name:'唐山一中',
			count:112,
			time:4
		},
		{
			id:14,
			city:'上海',
			name:'11',
			count:55,
			time:3232
		},
		{
			id:15,
			city:'上海',
			name:'22',
			count:4514,
			time:687124
		},
		{
			id:16,
			city:'上海',
			name:'33',
			count:916,
			time:51246
		},
		{
			id:17,
			city:'北京',
			name:'秦皇岛',
			count:212313,
			time:23212
		},
	])
	let curCity = ref(null) //当前城市
	let isCount = ref(true) //是否是按照时间排序
	// 选择器数据
	const cityData = [
		{
			value:"北京",text:"北京"
		},
		{
			value:"天津",text:"天津"
		},
		{
			value:"上海",text:"上海"
		},
		
	]
	
	// 筛选过后的数据
	const curCityArray = ref([])
	onMounted(()=>{
		// 初始化为北京
		curCity.value = '北京'
		// 初始化排名
		countRank()
		// 初始化，判断登陆情况，加载用户信息
		const cachedUserInfo = uni.getStorageSync('userInfo');
		if (cachedUserInfo) {
		    userInfo.value = cachedUserInfo;
		    isLogIn.value = true;
		}
	})
	// 更改排序方式
	const changeIsCount = ()=>{
		isCount.value = !isCount.value
	}
	// 按照游玩时长排序
	const timeRank = ()=>{
		curCityArray.value = totalData.value.filter(item=>item.city === curCity.value)
		curCityArray.value.sort((a,b)=>b.time-a.time)
	}
	// 按照游玩人数排序
	const countRank = ()=>{
		curCityArray.value = totalData.value.filter(item=>item.city === curCity.value)
		curCityArray.value.sort((a,b)=>b.count-a.count)
	}
	// 监听排序类型变化
	watch(isCount,(newVal)=>{
		if(!newVal){
			timeRank()
		}else{
			countRank()
		}
	})
	// 监听当前城市的变化
	watch(curCity,()=>{
		if(isCount.value){
			countRank()
		}else{
			timeRank()
			
		}
	})
	
	const getUserPhoneNumber = async(e) => {
		console.log(e)
		  try {
			const res = await uni.request({
				url:`https://allmetaahome.com/wxApp/login`,
				method:'POST',
				data:{
					code:e.detail.code
				}
			})
			userInfo.value.phoneNumber = res.data.phone_info.phoneNumber
			isLogIn.value = true
			uni.setStorageSync('userInfo',userInfo.value)
			uni.setStorageSync('isLogin',true)
		  } catch (error) {
			console.error('WeChat login error:', error);
		  }
	}

	// 请求用户授权，并更新数据存入到缓存中
	// const getUserInfo = async ()=>{
	// 	try{
	// 		const loginRes = await uni.login({
	// 			provider:'weixin'
	// 		})
			
	// 		if(loginRes.code){
	// 			const backendRes = await uni.request({
	// 				url:'https://allmetaahome.com/wxApp/login',
	// 				method:'POST',
	// 				data:{
	// 					code:loginRes.code
	// 				}
	// 			})
	// 			const userOpenId = backendRes.data.openId
	// 			uni.setStorageSync('userOpenId',userOpenId)
				
				
	// 		}else{
	// 			console.error('微信登陆失败',loginRes.errMsg)
	// 		}
	// 	}catch(error){
	// 		console.error('微信登陆异常',error)
	// 	}
		
	// }
		
	const handleUserInfo = (userInfo)=>{
		uni.setStorageSync('userInfo', userInfo.value)
		uni.setStorageSync('isLogIn',true)
		isLogIn.value = true
	}
	// 跳转到历史记录（需要登录）
	const toHistoryClick = () => {
		if(isLogIn.value){
			uni.navigateTo({
				url: "/pages/history/history"
			})
		}else{
			uni.showToast({
			    title: '请先登录',
			    icon: 'none',
			})
		}
		
	}
	// 跳转到反馈（需要登录）
	const toFeedbackClick = () => {
		if(isLogIn.value){
			uni.navigateTo({
				url: "/pages/feedback/feedback"
			})
		}else{
			uni.showToast({
			    title: '请先登录',
			    icon: 'none',
			})
		}
	}
	
	// 退出登陆，会清空缓存
	const logOut = () => {
	  userInfo.value = null;
	  isLogIn.value = false;
	  uni.removeStorageSync('userInfo');
	  uni.removeStorageSync('isLogIn')
	  uni.removeStorageSync('chatMessages')
	};

</script>

<style>
	.container {
		padding: 24rpx;
	}

	.card_view {
		width: 100%;
		background-color: #fff;
		border-radius: 16rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
		box-sizing: border-box;
	}

	.header_view {
		width: 100%;
		height: 140rpx;
		margin-left: 16rpx;
		display: flex;
		align-items: center;
		/* justify-content: center; */
	}

	.header_view image {
		width: 120rpx;
		height: 120rpx;
		margin-right: 20rpx;
		border-radius: 100rpx;
	}

	.header_view text {
		margin-right: 10rpx;
		font-size: 36rpx;
	}
	.header-login{
		display:flex;
		align-items: center;
		margin-left: auto;
	}
	.items {
		display: flex;
		padding: 10rpx;
		height: 64rpx;
		border-radius: 10rpx;
		align-items: center;
	}

	.items text {
		margin-left: 12rpx;
		position: relative;
		bottom: 2rpx;
	}

	.items:active {
		background-color: #f1f2f7;
	}

	/* 退出登录按钮 */
	.button {
		width: 100%;
		height: 78rpx;
		background-color: #cc1d34;
		border-radius: 20rpx;
		margin: auto;
		color: white;
		font-size: 30rpx;
		margin-bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;

	}

	.button:active {
		background-color: #cc4143;
	}
	
	.rank-header{
		display: flex;
		align-items: center;
	}
	.rank-icon{
		padding: 10rpx;
		margin-right: 10rpx;
	}
	.rank-name{
		
	}
	.rank-click{
		margin-left: auto;
		display: flex;
		align-items: center;
		justify-content: space-around;
	}
	
	.rank-change{
		margin-right: 10rpx;
	}
	.rank-select{
		margin-left: auto;
	}
	
	.empty-block{
		height: 7vw;
	}
	.change-button {
		width: 20vw;
		height: 18rpx;
		background-color: #cc1d34;
		border-radius: 20rpx;
		
		display: flex;
		align-items: center;
		justify-content: center;
	
	}
	
	.change-button:active {
		background-color: #cc4143;
	}
	.rank-table {
	  margin: 10rpx 5rpx 0 15rpx;
	}
	
	.uni-table th,
	.uni-table td {
	  padding: 1rpx;
	}
	
	.rank-list-index {
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  align-items: center;
	}
	
	.badge-icon {
	  width: 60rpx; /* 调整图标大小 */
	  height: 60rpx;
	  margin-right: 5rpx;
	}
	
	.rank-number {
	  font-size: 28rpx; /* 艺术字数字大小 */
	  color: #cc1d34; /* 艺术字数字颜色 */
	  font-weight: bold;
	  
	}
	
	.rank-list-name,
	.rank-list-count,
	.rank-list-time {
	  font-size: 26rpx;
	  color: #333;
	}
	.uni-select{
		height: 60rpx !important;
	}
	.login-button{
		width: 100%;
		height: 78rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>