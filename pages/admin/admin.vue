<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">软件数据</block>
		</cu-custom>
		
		<view class="bg-white padding">
			<view class="cu-form-group margin-top">
				<view class="title">日活用户数:</view>
				<view class="title"></view>
			</view>
			<view class="cu-form-group">
				<view class="title">改签成功率:</view>
				<view class="title"></view>
			</view>
			<view class="cu-form-group">
				<view class="title">预约成功率:</view>
				<view class="title"></view>
			</view>
			<view class="cu-form-group">
				<view class="title">取消成功率:</view>
				<view class="title"></view>
			</view>
			<view class="cu-form-group">
				<view class="title">更新成功率:</view>
				<view class="title"></view>
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
			
		}
	}
</script>

<style>

</style>
