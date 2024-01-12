<template>
	<!-- <map id="map" style="width: 100vw; height: 100vh;z-index: 0;" show-location="true" :markers="map.marks">
	</map> -->
	<map id="myMap" style="width: 100vw; height: 100vh;z-index: 0;" :latitude="latitude" show-location="true" :longitude="longitude" :markers="markers"></map>
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
						<text>设备编号:{{curDeviceNum}}</text>
						<view style="flex: 1"></view>
						<uni-icons type="info" size="16" @click="toFeedbackClick()"></uni-icons>
						<text @click="toFeedbackClick()">反馈/投诉</text>
					</view>
					<view class="button" style="width: 100%;color: white;" @click="clickPlay()">开始游玩</view>
				</view>
			</view>
			<!-- 选项弹窗 -->
			<!-- <view  v-show="showPlayOptions">
				<view class="popup">
					
					<view class="popup-content">
						<view class="popup-header">
							<view>
								<text class="popup-title">选择游玩方式 :</text>
							</view>
							<view>
								<uni-icons class="closeEmpty" type="closeempty" size="18" @click="clickCloseOptions()"></uni-icons>
							</view>
							
						</view>
						
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
			</view> -->
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
						<text>设备编号:{{curDeviceNum}}</text>
						<view style="flex: 1"></view>
						<uni-icons type="info" size="16" @click="toFeedbackClick()"></uni-icons>
						<text @click="toFeedbackClick()">反馈/投诉</text>
					</view>
					<view class="button button-back" style="width: 100%;color: #cc1d34;">{{ "付款成功，设备已启动" }}</view>
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
					<view class="button button-back" style="width: 100%;color: #cc1d34;" @click="clickStop()">{{ "结束游玩" }}</view>
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
	// import { func } from 'prop-types';
	// import { onLaunch } from '@dcloudio/uni-app'
	
import {
		onMounted,
		reactive,
		ref,
		watch
	} from 'vue';
	import { onLoad } from '@dcloudio/uni-app'
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
	// const showPlayOptions = ref(false)//游玩模式选项是否展示
	const countDown = ref(600)//单次游玩倒计时（十分钟）
	const playType = ref(0)//游玩模式
	const isLogIn = ref(false)// 判断是否登陆
	const _mapContext = uni.createMapContext('myMap');//初始化地图数据
	// 初始化地理位置（用户）
	const latitude = ref(null)
	const longitude = ref(null)
	const markers = ref(0)
	const timer = null
	const curDeviceNum = ref('')
	const deviceDetail = ref({
		dropName:"",
		deviceStatus:1,
		
	})
	const token = ref('') //登陆参数
	
	// 初始化
	onMounted(async() => {
		uni.login({
			success(data) {
				console.log(data)
			}
		})
		// 获取用户地理位置以及其他数据信息
		getUserLocation()
		// 初始化获取二维码参数
		// 初始化判断是否登陆
		makeSureLog()
		console.log(222)
		if(curDeviceNum.value!==''){
			await getDeviceMsgByDeviceNum()
		}
		
	})

	onLoad((opstions)=>{
		console.log(111,opstions);
		scanQRQuery(opstions.scene)
	})

	// 获取用户地理位置的方法
	const getUserLocation = ()=>{
		uni.getLocation({
			// type:'wgs84',
			success:(res)=>{
				// 存储用户位置信息
				latitude.value = res.latitude
				longitude.value = res.longitude
				// 跳转到用户的当前位置
				goMoveToLocation(longitude.value, latitude.value)
				// 获取用户周边的泡泡机信息
				getClawMachineLocations(latitude.value,longitude.value)
			},
			fail: (error) => {
				// 失败之后跳转到一个默认位置，并获取默认位置周边的泡泡机情况
				latitude.value = 39.916527
				longitude.value = 116.397128
				console.log('出错了',error)
				getClawMachineLocations(latitude.value,longitude.value)
			},
		})
	}
	// 获取某一位置周边的泡泡机的数据信息
	const getClawMachineLocations = async(latitude,longitude) => {
	 try{
		 const res = await uni.request({
			url:`https://allmetaahome.com:2333/dropoff/around?latitude=${latitude}&longitude=${longitude}`,
			method:'GET'
		})
		const clawMachineLocations = res.data
		console.log(clawMachineLocations)
		 // 根据娃娃机位置信息设置标记点
		markers.value = clawMachineLocations.data.map(location => ({
			id: location.id,
			latitude: location.latitude,
			longitude: location.longitude,
			title: location.address,
			iconPath: '/path/to/marker-icon.png', // 标记点图标路径
			width: 30,
			height: 30,
			callout: {
			    content: location.address,
			    color: '#000000',
			    fontSize: 14,
			    borderRadius: 4,
			    bgColor: 'rgba(255, 255, 255, 0.5)',
			    padding: 8,
			    display: 'ALWAYS',
			  },
		  }));
		}catch(error){
			console.error('获取娃娃机位置失败了',error)
		}
	};

	// 回到定位点
	function goMoveToLocation(longitude, latitude) {
		_mapContext.moveToLocation({
			longitude: longitude,
			latitude: latitude,
			success() {
				console.log('我回来了')
			}
		});
	}

	// 点击叉叉
	const clickClose = () => {
		if (!playing.value) {
			showQRScan.value = true;
			isEnd.value = false
			return;
		}
		uni.showToast({
			title: "请先结束游玩"
		})

	}

	// 游玩游玩
	const clickPlay = () => {
		makeSureLog()
		if(isLogIn.value){
			uni.showLoading({
				title: "正在请求数据"
			});
			startEquipment()
		}else{
			// getUserInfo()
			uni.showToast({
				title:"请先登录",
			})
		}
		
	}
	// 计费计算处理
	const startBilling = ()=>{
		timer = setInterval(()=>{
			totalSecond.value = Math.floor((new Date() - startTime.value)/1000)
			totalMin.value = Math.ceil(totalSecond.value/60)
			totalCost.value = totalMin.value*2
		},1000)
	}
	watch(playing,(newVal)=>{
		if(!newVal){
			console.log(newVal)
			clearTimeout(timer)
			console.log(timer)
		}
	})
	// 开始游玩
	const startPlaying = (option)=>{
		makeSureLog()
		if(isLogIn.value){
			// showPlayOptions.value = false
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
		}else{
			uni.showToast({
			    title: '请先登录',
			    icon: 'none',
			})
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
				countDown.value = 60
				totalCost.value = 5
				totalMin.value = 10
			}
		},1000)
	}
	// 提前结束当前游玩
	// const stopPlayingAhead = ()=>{
		
	// 	playing.value = false
	// 	isEnd.value = true
	// 	totalCost.value = 5
	// 	totalMin.value = Math.ceil((600-countDown.value)/60)
	// 	clearInterval(timer)
	// 	countDown.value = 600
	// }
	// 第二种模式的主动结束
	const clickStop = async()=>{
		await closeEquipment()
		// isEnd.value = true
		// playing.value = false
	}
	// 获取二维码中的参数的操作
	const scanQRQuery = (param)=>{
		// const launchOptions = uni.getLaunchOptionsSync()
		// // console.log(launchOptions)
		// curDeviceNum.value = launchOptions.query.scene
		if(param){
			curDeviceNum.value=param
			getDeviceMsgByDeviceNum()
			if(deviceDetail.value.deviceStatus===1){
				showQRScan.value = false
			}else{
				uni.showToast({
					title:"当前设备已经在启动了",
					icon:"error"
				})
			}
		}else{
			uni.showToast({
				title:'扫描设备码开始游玩',
				icon:"none"
			})
		}
		const launchOptions = uni.getEnterOptionsSync()
		
		// location.value = launchOptions.query.location
		// status.value = launchOptions.query.status
		console.log(`扫描到了登录参数，他们分别是deviceNum:${curDeviceNum.value}`,launchOptions)
	}
	// 扫描二维码
	const toQRScanClick = () => {
		makeSureLog()
		if(isLogIn.value){
			uni.scanCode({
				success(res) {
					const url = decodeURIComponent(res.path)
					const params = url.split('?')[1].split('=')[1]
					
					uni.reLaunch({
						url:`/${url}`,
						fail() {
							uni.showToast({
								title:'二维码异常'
							})
						}
					})
					// console.log(`二维码的数据有${JSON.stringify(res)}`)
					console.log('扫码成功：')
				}
			})
		}else{
			uni.showToast({
			    title: '请先登录并且绑定手机号',
			    icon: 'none',
			})
			// uni.navigateTo({
			// 	url: "/pages/mine/mine"
			// })
		}
	}
	// 在获取设备编号之后，进行数据的初始化
	const getDeviceMsgByDeviceNum = async()=>{
		try{
			const res = await uni.request({
				url:`https://allmetaahome.com:2333/equipment/detail?equipment=${curDeviceNum.value}`,
				method:"GET",
			})
			deviceDetail.value.deviceStatus = res.data.data.deviceDetail.status
			deviceDetail.value.dropName = res.data.data.deviceDetail.dropName
			playType.value = res.data.data.deviceDetail.mode
		}catch(error){
			console.error('设备详情获取失败',error)
		}finally{
			// 测试用
			playType.value = 1
			console.log('初始化',playType.value)
		}
	}	
	
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
	// 验证当前用户是否登陆
	const makeSureLog = ()=>{
		const logIn = uni.getStorageSync('isLogIn');
		const binding = uni.getStorageSync('isBinding')
		if (binding&&logIn) {
			token.value = uni.getStorageSync('Token')
		    isLogIn.value = true
		}else{
			isLogIn.value = false
			uni.showToast({
			    title: '请先登录并且绑定手机号',
			    icon: 'none',
			})
		}
	}
	// 启动设备
	const startEquipment = async()=>{
		try{
			const res = await uni.request({
				url:`https://allmetaahome.com:2333/equipment/startEquipment?equipmentNum=${curDeviceNum.value}`,
				method:"GET",
				header:{
					satoken:token.value
				},
				success(res) {
					if(res.data.code===200&&res.data.message==='ok'){
						uni.showToast({
							title:'设备启动成功',
							icon:'success'
						})
						// 实际
						// startPlaying(playType.value)
					}else{
						uni.showToast({
							title:"设备启动失败",
							// icon:"exception"
						})
					}
				},
				fail(error){
					console.error('设备启动失败',error)
					uni.showToast({
						title:"设备启动失败",
						icon:"fail"
					})
				}
			})
			// 测试
			startPlaying(playType.value)
			
			
		}catch(error){
			console.error('设备启动失败',error)
		}
	}
	// 用户主动关闭设备
	const closeEquipment = async()=>{
		try{
			const res = await uni.request({
				url:'https://allmetaahome.com:2333/equipment/closeEquipmentByUser',
				method:"GET",
				header:{
					satoken:token.value
				}
			})
			if(res.data.status===200&&res.data.message==="ok"){
				uni.showToast({
					title:"已结束游玩",
					icon:"success"
				})
				// 实际
				// isEnd.value=true
				// playing.value=false
			}
			// 测试
			isEnd.value=true
			playing.value=false
			
		}catch(error){
			console.error('结束设备失败',error)
		}
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
	// 选项卡的选择
	const clickCloseOptions = ()=>{
		showPlayOptions.value=false
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
	.button-back:hover{
		background-color: white;
	}
	.closeEmpty{
		margin: 10rpx;
	}
	.popup-header{
		display: flex;
		justify-content: space-between;
	}
	.popup-title{
		margin:10rpx;
	}

</style>