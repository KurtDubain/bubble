<template>
	<!-- <map id="map" style="width: 100vw; height: 100vh;z-index: 0;" show-location="true" :markers="map.marks">
	</map> -->
	<!-- <text>{{scanData}}</text> -->
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
						<text style="font-size: 24rpx;">{{deviceDetail.dropName}}</text>
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
			<!-- 第一种游玩方式 -->
			<view v-show="!isEnd&&playing&&playType===0">
				<view  class="control_view">
					<view style="display: flex;align-items: center;">
						<uni-icons type="paperplane-filled" size="14"></uni-icons>
						<text style="font-size: 24rpx;">{{deviceDetail.dropName}}</text>
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
						<text style="font-size: 24rpx;">{{deviceDetail.dropName}}</text>
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
						<text style="font-size: 24rpx;">{{deviceDetail.dropName}}</text>
						<view style="flex: 1"></view>
						<uni-icons type="closeempty" size="18" @click="clickClose()"></uni-icons>
					</view>
					<view style="height: 64rpx;">
						<text style="font-size: 46rpx;font-weight: 600;">{{ `共使用${lastOrder.min}分钟，花费${lastOrder.cost}元` }}</text>
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
	const lastOrder = ref({
		cost:0,
		min:0
	})
	// const showPlayOptions = ref(false)//游玩模式选项是否展示
	const countDown = ref(10)//单次游玩倒计时（十分钟）
	const playType = ref(null)//游玩模式
	const isLogIn = ref(false)// 判断是否登陆
	const _mapContext = uni.createMapContext('myMap');//初始化地图数据
	// 初始化地理位置（用户）
	const latitude = ref(null)
	const longitude = ref(null)
	const markers = ref(0)//腾讯地图标识
	let timer = null //全局定时器
	const curDeviceNum = ref('')//当前选中的设备名称
	const orderNum = ref('')//当前生成的订单编号
	const deviceDetail = ref({//设备的详细信息
		dropName:"",
		deviceStatus:null,
		deviceId:null,
		// status:null
	})
	const token = ref('') //登陆参数
	const isWx = ref(true)
	// const scanData = ref('')
	// 初始化
	onMounted(async() => {
		uni.login({
			success(data) {
				console.log(data)
			}
		})

		// 获取用户地理位置以及其他数据信息
		getUserLocation()
		
		// 初始化判断是否登陆
		makeSureLog()
		// 判断用户是否有未完成订单
		await getUserIsVaild()
		// 如果获取到了编号就更新
		if(curDeviceNum.value!==''){
			await getDeviceMsgByDeviceNum()
		}
		
	})

	onLoad((options)=>{
		// 判断用户是否有未完成订单
		makeSureLog()
		let url = decodeURIComponent(options.q)
		const reg = /scene=([^&]+)/
		const match = url.match(reg)
		const scene = match && match[1]
		// console.log("启动参数为",scene)
		// console.log("启动url为",url)
		// 外界扫码跳转
		if(scene!==null){
			scanQRQuery(scene)
		}else{
			// 小程序内扫码跳转
			scanQRQuery(options.scene)
		}
	})
	
	
	// 获取用户地理位置的方法
	const getUserLocation = ()=>{
		uni.getLocation({
			// type:'wgs84',
			success:(res)=>{
				console.log(res)
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
			// iconPath: '/path/to/marker-icon.png', // 标记点图标路径
			width: 30,
			height: 30,
			callout: {
			    content: location.address,
			    color: '#000000',
			    fontSize: 12,
			    borderRadius: 4,
			    padding: 3,
			    display: 'ALWAYS',
			  },
			  alpha:0.6,
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
	// 点击游玩
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
	// 监视关闭定时器
	watch(playing,(newVal)=>{
		if(!newVal){
			// console.log(newVal)
			clearInterval(timer)
			// console.log(timer)
		}
	})
	// 开始游玩
	const startPlaying = async(option)=>{
		// 验证用户是否登陆
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
					
				},1000)
				// 先支付后玩
				await handlePaymentByPlayBackup()
				
			}else{
				// 先玩后支付
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
				lastOrder.value.cost = 5
				lastOrder.value.min = 10
			}
		},1000)
	}
	// 第二种模式的主动结束
	const clickStop = async()=>{
		
		await closeEquipment()
		
		lastOrder.value.cost = totalCost.value
		lastOrder.value.min = totalMin.value
		// 如果游玩时间过短，则取消订单的建立
		if(lastOrder.value.cost!==0){
			await handlePaymentOrderByPlayAhead()
			await handlePaymentByPlayAhead()
		}else{
			uni.showToast({
				title:"游玩时间太短了",
			})
		}
		
		// isEnd.value = true
		// playing.value = false
	}
	// 获取二维码中的参数的操作
	const scanQRQuery = async(param)=>{
		try{
			// 验证用户是否有未支付订单
			let passToken = false
			passToken = await getUserIsVaild()
			if(param&&passToken){
				curDeviceNum.value=param
				// 条件符合，获取设备信息
				await getDeviceMsgByDeviceNum()
				// 验证设备是否可用
				if(deviceDetail.value.deviceStatus===1&&playType.value!==null){
					showQRScan.value = false
				}else{
					uni.showToast({
						title:"设备不可用",
						icon:"error",
					})
				}
			}else{
				uni.showToast({
					title:'扫码开始游玩',
					icon:"none"
				})
			}
		}catch(error){
			console.error('',error)
		}
		
	}
	// 扫描二维码
	const toQRScanClick = () => {
		makeSureLog()
		if(isLogIn.value){
			uni.scanCode({
				success(res) {
					// console.log(res)
					// console.log(`二维码的数据有${JSON.stringify(res)}`)
					// console.log(res.data)
					const url = decodeURIComponent(res.result)
					// const params = url.split('?')[1].split('=')[1]
					const reg = 'https://allmetaahome.com?scene=';
					const params = url.split('?')[1].split('=')[1]
					// console.log(url.split('=')[0].concat('='))
					// 验证二维码中的url是否合规
					if(url.split('=')[0].concat('=')===reg){
						uni.reLaunch({
							url:`/pages/index/index?scene=${params}`,
							fail(error) {
								console.error(error)
								uni.showToast({
									title:'二维码异常'
								})
							}
						})
						console.log('扫码成功：')
					}else{
						uni.showToast({
							title:'二维码不正确',
							icon:'error'
						})
					}
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
				url:`https://allmetaahome.com:2333/equipment/detail?equipmentNum=${curDeviceNum.value}`,
				method:"GET",
			})
			deviceDetail.value.deviceStatus = res.data.data.status
			deviceDetail.value.dropName = res.data.data.dropName
			playType.value = res.data.data.mode
			deviceDetail.value.deviceId = res.data.data.id
			
		}catch(error){
			console.error('设备详情获取失败',error)
		}
		// finally{
		// 	// 测试用
		// 	playType.value = 1
		// 	console.log('初始化',playType.value)
		// }
	}	
	// 让用户支付上一次的订单
	const getUserIsVaild = async()=>{
		try{
			const res = await uni.request({
				url:'https://allmetaahome.com:2333/order/getUnpaidOrders',
				method:"GET",
				header:{
					Authorization:token.value
				}
			})
			// 通过检测未支付订单的长度来判断是否存在未支付订单
			if(res.data.data.length<=0){
				return true
			}else{
				showQRScan.value=true
				uni.showToast({
					title:"请支付上一次的订单",
					icon:"error"
				})
				return false
			}
			
		}catch(error){
			console.error("验证用户失败",error)
		}
	}
	// 验证当前用户是否登陆
	const makeSureLog = ()=>{
		// 获取登陆状态和绑定手机号状态
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
					Authorization:token.value
				},
				success(res) {
					if(res.data.code===200&&res.data.message==='success'){
						uni.showToast({
							title:'设备启动成功',
							icon:'success'
						})
						// 实际
						startPlaying(playType.value)
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
					})
				}
			})
			// 测试
			// startPlaying(playType.value)
			
			
		}catch(error){
			console.error('设备启动失败',error)
		}
	}
	// 用户主动关闭设备
	const closeEquipment = async()=>{
		try{
			const res = await uni.request({
				url:`https://allmetaahome.com:2333/equipment/closeEquipmentByUser?equipmentNum=${curDeviceNum.value}`,
				method:"POST",
				header:{
					Authorization:token.value
				},
			})
			
			if(res.data.code==200&&res.data.message=="success"){
				uni.showToast({
					title:"已结束游玩",
					icon:"success"
				})
				// 实际
				isEnd.value=true
				playing.value=false
			}
			// console.log(res.data)
			// console.log('结束了')
			
			// 测试
			// isEnd.value=true
			// playing.value=false
			
		}catch(error){
			console.error('结束设备失败',error)
		}
	}
	// 第二种游玩结束的时候生成订单
	const handlePaymentOrderByPlayAhead = async()=>{
		try{
			const res = await uni.request({
				url:`https://allmetaahome.com:2333/order/playBeforePay`,
				method:"POST",
				data:{
					"equipmentId":deviceDetail.value.deviceId
				},
				header:{
					Authorization:token.value
				}
			})
			// 拿到订单号，用于后续支付
			orderNum.value = res.data.data
			
		}catch(error){
			console.log('订单发送失败',error)
		}
	}
	// 付款操作
	// 先玩后支付（计时收费）
	const handlePaymentByPlayAhead = async()=>{
		try{
			
			const res = await uni.request({
				url:'https://allmetaahome.com:2333/order/requestPayOrder',
				method:"POST",
				data:{
					"orderNum":orderNum.value,
					"amount": lastOrder.value.cost*100,
					// "amount":1,
				    "times": lastOrder.value.min
				},
				header:{
					Authorization:token.value
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
	// 先支付后玩（一次性收费）
	const handlePaymentByPlayBackup = async()=>{
		try{
			// 固定金额
			const res = await uni.request({
				url:`https://allmetaahome.com:2333/order/payBeforePlay`,
				method:"POST",
				data:{
					"equipmentId":deviceDetail.value.deviceId,
					"amount":500,
					"timetamp":10
				},
				header:{
					Authorization:token.value
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
					startCountDown()
				},
				fail(error){
					console.log('支付遇到了一点问题',error)
				}
			})
			
			
		}catch(error){
			console.error('支付失败',error)
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
	// const clickCloseOptions = ()=>{
	// 	showPlayOptions.value=false
	// }
	
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