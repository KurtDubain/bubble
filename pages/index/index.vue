<template>
	<map id="map" style="width: 100vw; height: 100vh;z-index: 0;" show-location="true" :markers="map.marks">
	</map>
	<!-- logo -->
	<view class="top_items">
		<view style="flex:1"></view>
		<view class="card_box" @click="toMineClick()">
			<uni-icons type="person" size="26" color="#000000"></uni-icons>
		</view>
	</view>
	<view class="bottom_items">
		<!-- 扫码按钮 -->
		<view v-show="showQRScan">
			<view class="button" @click="toQRScanClick()">
				<text>扫码使用泡泡机</text>
			</view>
		</view>
		
		<!-- 操作栏 -->
		<view v-show="!showQRScan">
			<!-- 运行时的页面 -->
			<view v-show="!isEnd&&!playing">
				<view  class="control_view">
					<view style="display: flex;align-items: center;">
						<uni-icons type="paperplane-filled" size="14"></uni-icons>
						<text style="font-size: 24rpx;">xx省xx市xx县xx村</text>
						<view style="flex: 1"></view>
						<uni-icons type="closeempty" size="18" @click="clickClose()"></uni-icons>
					</view>
					<view style="height: 64rpx;">
						<text style="font-size: 46rpx;font-weight: 600;">欢迎使用泡泡机</text>
					</view>
					<view style="font-size: 22rpx;display: flex;color: #868686;">
						<text>爱护设备，让更多的人享受乐趣</text>
						<view style="flex: 1"></view>
						<uni-icons type="info" size="16" @click="toFeedbackClick()"></uni-icons>
						<text @click="toFeedbackClick()">反馈/投诉</text>
					</view>
					<view class="button" style="width: 100%;color: white;" @click="clickPlay()">开始游玩</view>
				</view>
			</view>
			<!-- 选项弹窗 -->
			<view  v-show="showPlayOptions">
				<view class="popup">
					<view class="popup-content">
						<text class="popup-title">选择游玩方式</text>
						<view class="popup-buttons">
							<button @click="startPlaying(0)" class="popup-button">
								<text class="button-text">按次付费</text>
								<text class="button-description">5元/次=10分钟</text>
							</button>
							<button @click="startPlaying(1)" class="popup-button">
								<text class="button-text">先游玩后付费</text>
								<text class="button-description">2元/1分钟</text>
							</button>
						</view>
					</view>
				</view>
			</view>
			<!-- 第一种游玩方式 -->
			<view v-show="!isEnd&&playing&&playType===0">
				<view  class="control_view">
					<view style="display: flex;align-items: center;">
						<uni-icons type="paperplane-filled" size="14"></uni-icons>
						<text style="font-size: 24rpx;">xx省xx市xx县xx村</text>
						<view style="flex: 1"></view>
						<uni-icons type="closeempty" size="18" @click="clickClose()"></uni-icons>
					</view>
					<view style="height: 64rpx;">
						<text style="font-size: 46rpx;font-weight: 600;">距离结束:{{`${Math.floor(countDown/60)}:${countDown%60}`}}</text>
					</view>
					<view style="font-size: 22rpx;display: flex;color: #868686;">
						<text>付款成功，设备已启动</text>
						<view style="flex: 1"></view>
						<uni-icons type="info" size="16" @click="toFeedbackClick()"></uni-icons>
						<text @click="toFeedbackClick()">反馈/投诉</text>
					</view>
					<view class="button" style="width: 100%;color: white;" @click="stopPlayingAhead()">提前停止游玩</view>
				</view>
			</view>
			<!-- 第二种游玩模式 -->
			<view v-show="!isEnd&&playing&&playType===1">
				<view  class="control_view">
					<view style="display: flex;align-items: center;">
						<uni-icons type="paperplane-filled" size="14"></uni-icons>
						<text style="font-size: 24rpx;">xx省xx市xx县xx村</text>
						<view style="flex: 1"></view>
						<uni-icons type="closeempty" size="18" @click="clickClose()"></uni-icons>
					</view>
					<view style="height: 64rpx;">
						<text style="font-size: 46rpx;font-weight: 600;">{{ `已使用${totalMin}分钟，花费${totalCost}元` }}</text>
					</view>
					<view style="font-size: 22rpx;display: flex;color: #868686;">
						<text>在结束游玩后记得付款哦</text>
						<view style="flex: 1"></view>
						<uni-icons type="info" size="16" @click="toFeedbackClick()"></uni-icons>
						<text @click="toFeedbackClick()">反馈/投诉</text>
					</view>
					<view class="button" style="width: 100%;color: white;" @click="clickStop()">{{ "结束游玩" }}</view>
				</view>
			</view>
			
			
			<!-- 结束的页面 -->
			<view v-show="isEnd">
				<view class="control_view">
					<view style="display: flex;align-items: center;">
						<uni-icons type="paperplane-filled" size="14"></uni-icons>
						<text style="font-size: 24rpx;">xx省xx市xx县xx村</text>
						<view style="flex: 1"></view>
						<uni-icons type="closeempty" size="18" @click="clickClose()"></uni-icons>
					</view>
					<view style="height: 64rpx;">
						<text style="font-size: 46rpx;font-weight: 600;">{{ `共使用${totalMin}分钟，花费${totalCost}元` }}</text>
					</view>
					<view style="font-size: 22rpx;display: flex;color: #868686;">
						<text>游玩后记得带走个人物品哦</text>
						<view style="flex: 1"></view>
						<uni-icons type="info" size="16" @click="toFeedbackClick()"></uni-icons>
						<text @click="toFeedbackClick()">反馈/投诉</text>
					</view>
					<view class="button button-back" style="width: 100%;color: #cc1d34;" @click="clickClose()">感谢您的游玩，欢迎下次再来</view>
				</view>
			</view>
			
			
		</view>
	</view>
</template>

<script setup>
	import {
		onMounted,
		reactive,
		ref
	} from 'vue';
	const _mapContext = uni.createMapContext("map");
	const map = ref({
		marks: []
	});
	// 页面组件
	// 是否展示初始卡片
	const showQRScan = ref(true);
	const playing = ref(false);// 是否在游玩中
	// const isBegin = ref(true)
	const isEnd = ref(false) // 是否结束
	const startTime = ref(null) // 开始时间
	const totalSecond = ref(0) // 总秒钟
	const totalMin = ref(0) // 总分钟
	const totalCost= ref(0) // 总花费
	const showPlayOptions = ref(false)//游玩模式选项是否展示
	const countDown = ref(600)//单次游玩倒计时（十分钟）
	const playType = ref(0)//游玩模式
	const isLogIn = ref(false)// 判断是否登陆

	const marks = [{
		latitude: 34.220009,
		longitude: 108.875175,
		//iconPath: "../../static/location/on_arrow.png"
	}];
	// 初始化
	onMounted(() => {
		uni.login({
			success(data) {
				console.log(data)
			}
		})
		// 初始化地理位置
		uni.getLocation({
			type: 'wgs84',
			success: function(res) {
				console.log(res.latitude);
				console.log(res.longitude);
				goMoveToLocation(res.longitude, res.latitude);
			}
		});
		// 初始化判断是否登陆
		const cachedUserInfo = uni.getStorageSync('userInfo');
		if (cachedUserInfo) {
		    isLogIn.value = true
		}
		map.value.marks = marks;
	})

	// 回到定位点
	function goMoveToLocation(longitude, latitude) {
		_mapContext.moveToLocation({
			longitude: longitude,
			latitude: latitude,
			success() {

			}
		});
	}

	// 点击叉叉
	const clickClose = () => {
		if (!playing.value) {
			showQRScan.value = true;
			return;
		}
		uni.showToast({
			title: "请先结束游玩"
		})

	}

	// 游玩和停止游玩
	const clickPlay = () => {
		if(isLogIn.value){
			uni.showLoading({
				title: "正在请求数据"
			});
			setTimeout(() => {
				uni.hideLoading()
				showPlayOptions.value = true
			},500);
		}else{
			getUserInfo()
		}
		
	}
	// 计费计算处理
	const startBilling = ()=>{
		const timer = setInterval(()=>{
			totalSecond.value = Math.floor((new Date() - startTime.value)/1000)
			totalMin.value = Math.ceil(totalSecond.value/60)
			totalCost.value = totalMin.value*2
		},1000)
		watch(playing,(newVal)=>{
			if(!newVal){
				clearInterval(timer)
			}
		})
	}
	// 开始游玩
	const startPlaying = (option)=>{
		showPlayOptions.value = false
		startTime.value = new Date()
		playing.value = true
		// 处理两种不同的游玩模式
		if(option === 0){
			playType.value = 0
			uni.showLoading({
				title:'正在请求支付'
			})
			setTimeout(()=>{
				uni.hideLoading()
				// isEnd.value = true
				startCountDown()
			},2000)
			
			
		}else{
			playType.value = 1
			startBilling()
		}
	}
	// 开始倒计时
	const startCountDown = ()=>{
		const timer = setInterval(()=>{
			countDown.value--
			if(countDown.value<=0){
				clearInterval(timer)
				playing.value = false
				isEnd.value = true
				countDown.value = 600
				totalCost.value = 5
				totalMin.value = 10
			}
		},1000)
	}
	// 提前结束当前游玩
	const stopPlayingAhead = ()=>{
		playing.value = false
		isEnd.value = true
		totalCost.value = 5
		totalMin.value = Math.ceil((600-countDown.value)/60)
		countDown.value = 600
	}
	// 第二种模式的主动结束
	const clickStop = ()=>{
		isEnd.value = true
		playing.value = false
	}
	
	// 扫描二维码
	const toQRScanClick = () => {
		// if(isLogIn.value){
		// 	uni.scanCode({
		// 		success(res) {
		// 			console.log('扫码成功：' + res.result)
		// 			showQRScan.value = false;
		// 		}
		// 	})
		// }else{
		// 	getUserInfo()
		// }
		if (isLogIn.value) {
		    uni.showModal({
		      title: '模拟扫码过程',
		      content: '由于我们目前没办法进行二维码扫码验证，因此目前是模拟扫码过程',
		      showCancel: false, 
		    });
		
		    // 模拟5秒扫码过程
		    setTimeout(() => {
				uni.showToast({
				    title: '扫码成功',
				    icon: 'none',
				})
		      showQRScan.value = false;
		    }, 5000);
		  }
	}
	// 获取用户的授权信息，登陆
	const getUserInfo = ()=>{
		uni.getUserProfile({
		    provider: 'weixin',
		    desc: '获取用户信息',
		    success: res => { 
		        console.log('获取用户信息成功：', res.userInfo);
				isLogIn.value = true
				uni.setStorageSync('userInfo', res.userInfo)
				uni.setStorageSync('isLogIn',true)
		    },
		    fail: err => {
		        console.error('获取用户信息失败：', err);
		    }
		});
	}

	// 个人中心
	const toMineClick = () => {
		uni.navigateTo({
			url: "/pages/mine/mine"
		})
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
</script>

<style scoped>
	.container {
		position: absolute;
		bottom: 0;
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.top_items {
		width: 100%;
		height: 100rpx;
		position: absolute;
		top: 0;
		padding: 16rpx;
		display: flex;
		box-sizing: border-box;
	}

	.card_box {
		width: 74rpx;
		height: 74rpx;
		background-color: white;
		border-radius: 16rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
	}

	.bottom_items {
		/* height: 360rpx; */
		width: 100vw;
		position: absolute;
		bottom: 32rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 20rpx;
		box-sizing: border-box;
	}

	.control_view {
		height: 260rpx;
		width: 92vw;
		background-color: white;
		border-radius: 24rpx;
		padding: 16rpx;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
	}


	/* 扫码按钮 */
	.button {
		width: 90vw;
		height: 78rpx;
		background-color: #cc1d34;
		border-radius: 20rpx;
		margin: auto;
		margin-bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;

	}

	.button:active {
		background-color: #cc4143;
	}

	.button text {
		text-align: center;
		color: white;
	}
	.button-back{
		background-color: white;
		border: #cc1d34 solid 2px;
		font-weight: bold;
	}
	.popup {
	  position: fixed;
	  top: 0;
	  left: 0;
	  width: 100vw;
	  height: 100vh;
	  background: rgba(0, 0, 0, 0.5);
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  z-index: 999;
	}
	
	.popup-content {
	  background: #fff;
	  border-radius: 10px;
	  padding: 30rpx; 
	  text-align: center;
	  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	  width: 80vw; 
	  max-width: 450rpx; 
	}
	
	.popup-buttons {
	  display: flex;
	  justify-content: space-around;
	  flex-direction: column;
	  margin-top: 20rpx; 
	}
	
	.popup-button {
	  background: #cc1d34;
	  color: #fff;
	  padding: 15rpx 20rpx; 
	  margin: 10rpx; 
	  border-radius: 8px;
	  cursor: pointer;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	}
	
	.button-text {
	  font-size: 35rpx;
	  line-height: 50rpx;
	  font-weight: bold; 
	}
	
	.button-description {
	  font-size: 22rpx;
	  line-height: 40rpx; 
	  color: #fff; 
	}


</style>