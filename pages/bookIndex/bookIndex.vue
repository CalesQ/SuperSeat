<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="false">
			<block slot="content">预约</block>
		</cu-custom>
		<view class="bg-white padding">
			<view @click="toRushBook" class="cu-form-group">
				<view class="title">抢座</view>
			</view>
			<view @click="toNormalBook" class="cu-form-group">
				<view class="title">正常约座</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			toNormalBook(){
				uni.showToast({
					icon: "none",
					title: "正在开发中"
				})
				return;
				uni.navigateTo({
					url: "/pages/normalBook/normalBook"
				})
			},
			
			toRushBook() {
				uni.navigateTo({
					url: "/pages/book/book"
				})
			}
		}
	}
</script>

<style>

</style>
