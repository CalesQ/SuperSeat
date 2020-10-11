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
				schoolId: "2017302580014",
				pwd: "202016"
			}
		},
		methods: {
			login() {
				var requestUrl = login_url + "?username=" + this.schoolId + "&password=" + this.pwd;
				console.info(requestUrl);
				
				//sendRequest(requestUrl, 'GET', null, null, this.callback)
				this.$axios({
					method: 'get',
					url: requestUrl,
					// data: {
					// 	userName: 'Lan',
					// 	password: '123'
					// },
				})
					.then(function(res) {
						console.info(res);
						
					})
					.catch(function(error) {
						console.log(error.statusCode)
					})
			},

			callback(res) {
				//console.log(res);
			}
		}
	}
</script>

<style>

</style>
