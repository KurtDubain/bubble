<template>
	<!-- 	<camera device-position="back" :flash="cameraInfo.flash" mode="scanCode" @scancode="scanCodeOk()"
		style="width: 100%; height: 100vh;">
	</camera> -->
	<button @click="scanCode()">扫码</button>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	const cameraInfo = ref({
		flash: false
	})
	const scanCodeOk = (data) => {
		console.log(data);
	}

	function scanCode() {
		uni.scanCode({
			success(res) {
				console.log('扫码成功：' + res.result)
			}
		})
	}
</script>

<style>

</style>