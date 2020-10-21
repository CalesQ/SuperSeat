<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="false">
			<block slot="content">我的</block>
		</cu-custom>
		
		<view class="bg-white padding">
			<view class="cu-form-group margin-top">
				<view class="title">学号：</view>
				<view class="title">{{userInfo.username}}</view>
			</view>
			<view class="cu-form-group">
				<view class="title">姓名：</view>
				<view class="title">{{userInfo.name}}</view>
			</view>
			<view class="cu-form-group">
				<view class="title">当前账号状态：</view>
				<view class="title">{{userInfo.status == 'NORMAL' ? '正常' : userInfo.status}}</view>
			</view>
			<view class="cu-form-group">
				<view class="title">上次馆名：</view>
				<view class="title">{{userInfo.lastInBuildingName == null ? "暂无" : userInfo.lastInBuildingName}}</view>
			</view>
			<view class="cu-form-group">
				<view class="title">最近进馆时间：</view>
				<view class="title">{{userInfo.lastIn == null ? "暂无" : userInfo.lastIn}}</view>
			</view>
			<view class="cu-form-group">
				<view class="title">最近出馆时间：</view>
				<view class="title">{{userInfo.lastOut == null ? "暂无" : userInfo.lastOut}}</view>
			</view>
			<view class="cu-form-group">
				<view class="title">当前预约状态：</view>
				<view class="title">{{userInfo.reservationStatus == null ? "暂无" : reserveStat(userInfo.reservationStatus)}}</view>
			</view>
		</view>
		<view class="padding flex flex-direction">
			<button class="cu-btn bg-blue margin-tb-sm lg" @click="exit">退出登录</button>
		</view>
	</view>
</template>

<script>
	import {
		usr_url
	} from '@/pages/common/js/url.js'
	import sendRequest from '@/pages/common/js/sendRequest.js'
	
	export default {
		data() {
			return {
				'userInfo': {
					'username': "",
					'name': "",
					'status': "",
					'lastInBuildingName': null,
					'lastIn': null,
					'lastOut': null,
					'reservationStatus': null
				}
			}
		},
		
		onLoad() {
			console.info("init")
			this.pageInit();
		},
		
		methods: {
			pageInit() {
				sendRequest(usr_url, 'GET', null, null, this.callback);
			},
			
			callback(res) {
				this.userInfo = res.data;
			},
			
			reserveStat(s) {
				switch(s) {
					case "CHECK_IN": return "已签到";
					case "AWAY": return "离开";
					default: return "未签到";
				}
			},
			
			exit() {
				uni.removeStorageSync("token");
				uni.removeStorageSync("expire_time");
				uni.removeStorageSync("pwd");
				
				uni.redirectTo({
					url: "../login/login"
				})
			}
		}
	}
</script>

<style>

</style>
