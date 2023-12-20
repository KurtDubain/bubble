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
			<view v-show="!isEnd">
				<view  class="control_view">
					<view style="display: flex;align-items: center;">
						<uni-icons type="paperplane-filled" size="14"></uni-icons>
						<text style="font-size: 24rpx;">xx省xx市xx县xx村</text>
						<view style="flex: 1"></view>
						<uni-icons type="closeempty" size="18" @click="clickClose()"></uni-icons>
					</view>
					<view style="height: 64rpx;">
						<text style="font-size: 46rpx;font-weight: 600;">{{ playing?`已使用${totalMin}分钟，共计${totalCost}元`:"5元/10分钟" }}</text>
					</view>
					<view style="font-size: 22rpx;display: flex;color: #868686;">
						<text>先玩后付费/不满10分钟按10分钟计费</text>
						<view style="flex: 1"></view>
						<uni-icons type="info" size="16"></uni-icons>
						<text>反馈/投诉</text>
					</view>
					<view class="button" style="width: 100%;color: white;" @click="clickPlayAndStop()">{{ playing?`停止游玩`:"开始游玩" }}</view>
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
						<text>先玩后付费/不满10分钟按10分钟计费</text>
						<view style="flex: 1"></view>
						<uni-icons type="info" size="16"></uni-icons>
						<text>反馈/投诉</text>
					</view>
					<view class="button button-back" style="width: 100%;color: #cc1d34;" @click="clickClose()">付款已完成，感谢您的游玩，欢迎下次再来</view>
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
	const isEnd = ref(false) // 是否结束
	const startTime = ref(null) // 开始时间
	const totalSecond = ref(0) // 总秒钟
	const totalMin = ref(0) // 总分钟
	const totalCost= ref(0) // 总花费

	const marks = [{
		latitude: 34.220009,
		longitude: 108.875175,
		//iconPath: "../../static/location/on_arrow.png"
	}];

	onMounted(() => {
		uni.login({
			success(data) {
				console.log(data)
			}
		})
		uni.getLocation({
			type: 'wgs84',
			success: function(res) {
				console.log(res.latitude);
				console.log(res.longitude);
				goMoveToLocation(res.longitude, res.latitude);
			}
		});
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
	const clickPlayAndStop = () => {
		uni.showLoading({
			title: "正在请求数据"
		});
		setTimeout(() => {
			uni.hideLoading()
			if(!playing.value){
				// 开始游玩的初始化
				startTime.value = new Date()
				playing.value = true
				startBilling()
			}else{
				// 结束游玩的处理
				playing.value = false
				isEnd.value = true
				// showQRScan.value = true
			}
		},500);
	}
	// 计费计算处理
	const startBilling = ()=>{
		const timer = setInterval(()=>{
			totalSecond.value = Math.floor((new Date() - startTime.value)/1000)
			totalMin.value = Math.ceil(totalSecond.value/60)
			totalCost.value = Math.ceil(totalMin.value/10)*5
		},1000)
		watch(playing,(newVal)=>{
			if(!newVal){
				clearInterval(timer)
			}
		})
	}
	
	// 扫描二维码
	const toQRScanClick = () => {
		uni.scanCode({
			success(res) {
				console.log('扫码成功：' + res.result)
				showQRScan.value = false;
			}
		})
	}

	// 个人中心
	const toMineClick = () => {
		uni.navigateTo({
			url: "/pages/mine/mine"
		})
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
	
</style>