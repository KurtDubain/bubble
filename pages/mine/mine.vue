<template>
	<view class="container">
		<view class="card_view">
			<view class="header_view">
				<image src="../../static/uni.png"></image>
				<text>微信用户</text>
				<uni-icons type="compose" size="26" @click="changeUserInfo()"></uni-icons>
			</view>
		</view>
		<!-- 菜单栏 -->
		<view class="card_view">
			<view class="items">
				<uni-icons type="email" size="26" color="#cc4143"></uni-icons>
				<text>历史订单</text>
				<view style="flex: 1"></view>
				<uni-icons type="forward" size="24"></uni-icons>
			</view>
			<view style="height: 6rpx;"></view>
			<view class="items">
				<uni-icons type="help" size="26" color="#cc4143"></uni-icons>
				<text>投诉或反馈</text>
				<view style="flex: 1"></view>
				<uni-icons type="forward" size="24"></uni-icons>
			</view>
		</view>
		
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
			
			
			<view class="rank-table">
				<uni-table  :loading="loading" border stripe>
					<uni-tr>
						<uni-th width='50' align="center">排名</uni-th>
						<uni-th width='120' align="center">名称</uni-th>
						<uni-th width='70' align="center">游玩次数</uni-th>
						<uni-th width='70' align="center">总时长</uni-th>
					</uni-tr>
					<uni-tr v-for="(item,index) in curCityArray" :key="index">
						<uni-td align="center">
							<view class="rank-list-index">
								<img :src="index<3?`../../static/rank_icon/${index+1}.png`:''" alt="Badge" v-if="index<3" class="badge-icon" />
								<text class="rank-number">{{ index < 3 ? '' : index + 1 }}</text>
							</view>
						</uni-td>
						<uni-td align="center">
							<text class="rank-list-name">{{ item.name }}</text>
						</uni-td>
						<uni-td align="center">
							<text class="rank-list-count">{{ item.count }}</text>
						</uni-td>
						<uni-td align="center">
							<text class="rank-list-time">{{ item.time }}</text>
						</uni-td>
					</uni-tr>
				</uni-table>
			</view>
			
		</view>
		<!-- 退出登录按钮 -->
		<view class="button">退出登录</view>
	</view>
</template>

<script setup>
	import { ref,onMounted, watch } from 'vue'
	// 初始化全部数据
	const totalData = ref([
		{
			id:0,
			city:'北京',
			name:'苏州街投放点',
			count:23,
			time:123
		},
		{
			id:1,
			city:'北京',
			name:'通州投放点',
			count:43,
			time:532
		},
		{
			id:2,
			city:'天津',
			name:'开平镇投放点',
			count:99,
			time:2314
		},
		{
			id:3,
			city:'天津',
			name:'西青区投放点',
			count:21,
			time:56
		},
		{
			id:4,
			city:'天津',
			name:'万象城投放点',
			count:12,
			time:432
		},
		{
			id:5,
			city:'上海',
			name:'外滩投放点',
			count:655,
			time:32432
		},
		{
			id:6,
			city:'上海',
			name:'SOHO投放点',
			count:454,
			time:6874
		},
		{
			id:7,
			city:'上海',
			name:'浦东投放点',
			count:96,
			time:546
		},
		{
			id:8,
			city:'北京',
			name:'北京站投放点',
			count:213,
			time:2312
		},
		{
			id:9,
			city:'北京',
			name:'海淀黄庄投放点',
			count:223,
			time:13
		},
		{
			id:10,
			city:'北京',
			name:'TBD投放点',
			count:423,
			time:132
		},
		{
			id:11,
			city:'天津',
			name:'冶里村投放点',
			count:9,
			time:234
		},
		{
			id:12,
			city:'天津',
			name:'路北区投放点',
			count:121,
			time:562
		},
		{
			id:13,
			city:'天津',
			name:'唐山一中投放点',
			count:112,
			time:4
		},
		{
			id:14,
			city:'上海',
			name:'11投放点',
			count:55,
			time:3232
		},
		{
			id:15,
			city:'上海',
			name:'22投放点',
			count:4514,
			time:687124
		},
		{
			id:16,
			city:'上海',
			name:'33投放点',
			count:916,
			time:51246
		},
		{
			id:17,
			city:'北京',
			name:'秦皇岛投放点',
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
		countRank()
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
			// console.log(newVal)
			timeRank()
			// console.log(curCityArray.value)
		}else{
			countRank()
		}
	})
	// 监听当前城市的变化
	watch(curCity,()=>{
		// console.log(curCity.value)
		if(isCount){
			countRank()
		}else{
			timeRank()
			
		}
	})
	const changeUserInfo = () => {

	}
</script>

<style scoped>
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
	}
	
	.rank-change{
		/* margin-right: 50rpx; */
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
	uni-select {
		height: 30px;
	}
	
	
	.rank-table {
	  margin: 20rpx;
	}
	
	.uni-table th,
	.uni-table td {
	  padding: 10rpx;
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

</style>