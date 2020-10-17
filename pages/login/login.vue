<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="false">
			<block slot="content">登录</block>
		</cu-custom>
		<view class="bg-white padding">
			<view class="cu-form-group margin-top">
				<view class="title">学号</view>
				<input placeholder="输入您的学号" v-model="schoolId"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">密码</view>
				<input password="true" v-model="pwd"></input>
			</view>
		</view>
		<view class="padding flex flex-direction">
			<button class="cu-btn bg-blue margin-tb-sm lg" @click="login">登录</button>
		</view>
	</view>
</template>

<script>
	import {
		login_url
	} from '@/pages/common/js/url.js'
	import sendRequest from '@/pages/common/js/sendRequest.js'

	export default {
		data() {
			return {
				schoolId: "",
				pwd: ""
			}
		},
		
		onLoad() {
			
			this.init();
			
		},
		
		methods: {
			
			init() {
				if(uni.getStorageSync("expire_time") > new Date().getTime()) {
					uni.switchTab({
						url: '../my/my'
					})
					return;
				}
				
				this.schoolId = uni.getStorageSync("school_id") != undefined ? uni.getStorageSync("school_id") : "";
			},
			
			login() {
				var requestUrl = login_url + "?username=" + this.schoolId + "&password=" + this.pwd;
				console.info(requestUrl);
				
				sendRequest(requestUrl, 'GET', null, null, this.callback)
			},

			callback(res) {
				
				// 保存token
				uni.setStorageSync('token', res.data.token);
				uni.setStorageSync('school_id', this.schoolId);
				uni.setStorageSync('pwd', this.pwd);
				var expireTime = new Date().getTime() + 6 * 60 * 1000;
				uni.setStorageSync('expire_time', expireTime);
				
				uni.switchTab({
					url: '../my/my'
				})
			}
		}
	}
</script>

<style>

</style>
