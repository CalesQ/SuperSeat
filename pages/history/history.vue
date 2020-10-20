<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="false">
			<block slot="content">历史记录</block>
		</cu-custom>
		<view v-show="reservationsList.length == 0">
			无最近的记录
		</view>
		<scroll-view scroll-y class="indexes" :style="[{height:'calc(100vh - '+ CustomBar + 'px)'}]" :scroll-with-animation="true"
		 :enable-back-to-top="true">
			<block v-for="(item,index) in reservationsList" :key="index">
				<view class="cu-card case">
					<view class="cu-item shadow">
						<view class="cu-form-group">
							<view class="title">日期：</view>
							<view class="title">{{item.date}}</view>
						</view>
						<view class="cu-form-group">
							<view class="title">时间：</view>
							<view class="title">{{item.begin}} ~ {{item.end}}</view>
						</view>
						<view class="cu-form-group">
							<view class="title">位置：</view>
							<view class="title">{{item.loc}}</view>
						</view>
						<view class="cu-form-group">
							<view class="title">状态：</view>
							<view class="title">{{changeType(item.stat)}}</view>
						</view>
						<view v-show="item.stat == 'RESERVE'" class="cu-form-group">
							<button @click="opHandle(index)" class="cu-btn round sm bg-red">取消</button>
						</view>
						<view v-show="item.stat == 'CHECK_IN'" class="cu-form-group">
							<button @click="opHandle(-1)" class="cu-btn round sm bg-red">结束</button>
						</view>
					</view>
				</view>
			</block>
		</scroll-view>
	</view>
</template>

<script>
	import {
		history_url,
		cancel_url,
		stop_url
	} from '@/pages/common/js/url.js'
	import sendRequest from '@/pages/common/js/sendRequest.js'

	export default {
		data() {
			return {
				'reservationsList': []
			}
		},

		onLoad() {
			this.init();
		},

		onPullDownRefresh() {
			//监听下拉刷新动作的执行方法，每次手动下拉刷新都会执行一次
			console.log('refresh');
			this.init();
		},

		methods: {
			init() {
				uni.showLoading({
					title: "正在获取历史记录..."
				})
				sendRequest(history_url, "GET", null, null, this.initCallback)
			},

			initCallback(res) {
				uni.hideLoading();
				this.reservationsList = res.data.reservations;
				uni.stopPullDownRefresh(); //停止下拉刷新动画
				if(this.reservationsList.length == 0) {
					uni.showToast({
						icon: "none",
						title: "无最近的记录",
						duration: 1500
					})
				}
			},

			opHandle(index) {
				
				console.info(index)
				
				var url = index > -1 ? (cancel_url + this.reservationsList[index].id) : stop_url;
				
				console.info(url);
				
				//sendRequest(url, "GET", null, null, this.opCallback);
			},

			opCallback(res) {
				var that = this;
				uni.showToast({
					title: "操作成功",
					complete() {
						that.init();
					}
				})
			},

			changeType(res) {
				switch (res) {
					case "RESERVE":
						return "已预约";
					case "CANCEL":
						return "已取消";
					case "STOP":
						return "结束";
					case "MISS":
						return "未履约";
					case "COMPLETE":
						return "已完成";
					case "AWAY":
						return "离开";
					default:
						return "已签到";
				}
			}
		}
	}
</script>

<style>

</style>
