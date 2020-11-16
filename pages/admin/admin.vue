<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">软件数据</block>
		</cu-custom>
		
		<view class="bg-white padding">
			<view class="cu-form-group margin-top">
				<view class="title">日活用户数:</view>
				<view class="title">{{appData.daily_acctivity_number}}</view>
			</view>
			<view class="cu-form-group">
				<view class="title">改签成功率:</view>
				<view class="title">{{appData.change_proportion}}  {{appData.change_percentage}}</view>
			</view>
			<view class="cu-form-group">
				<view class="title">预约成功率:</view>
				<view class="title">{{appData.book_proportion}}  {{appData.book_percentage}}</view>
			</view>
			<view class="cu-form-group">
				<view class="title">更新成功率:</view>
				<view class="title">{{appData.update_proportion}}  {{appData.update_percentage}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		appData_url
	} from "@/pages/common/js/url.js"
		
	export default {
		data() {
			return {
				appData: {
					daily_acctivity_number: "",
					change_proportion: "",
					change_percentage: "",
					book_proportion: "",
					book_percentage: "",
					update_proportion: "",
					update_percentage: ""
				}
			}
		},
		methods: {
			getData() {
				uni.showLoading({
					mask: true,
					title: "正在获取数据"
				})
				
				uni.request({
					url: appData_url,
					method: "GET",
					header: {
						"Content-Type": "application/json",
						"school_id": uni.getStorageSync("school_id")
					},
					
					success(res) {
						uni.hideLoading();
						this.appData = res.data.data;
					},
					
					fail(res) {
						uni.hideLoading();
						uni.showToast({
							icon: "none",
							title: "获取失败"
						})
					}
				})
			}
		}
	}
</script>

<style>

</style>
