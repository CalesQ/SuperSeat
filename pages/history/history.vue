<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="false">
			<block slot="content">预约记录</block>
		</cu-custom>
		<view v-show="reservationsList.length == 0">
			无预约记录
		</view>
		<scroll-view scroll-y class="indexes" :style="[{height:'calc(100vh - '+ CustomBar + 'px)'}]" :scroll-with-animation="true"
		 :enable-back-to-top="true">
			<block v-for="(item,index) in reservationsList" :key="index">
				<view class="cu-card case">
					<view class="cu-item shadow">
						<view class="cu-form-group">
							<view class="title">日期:</view>
							<view class="title">{{item.onDate}}</view>
						</view>
						<view class="cu-form-group">
							<view class="title">时间:</view>
							<view class="title">{{item.begin}} ~ {{item.end}}</view>
						</view>
						<view class="cu-form-group">
							<view class="title">位置:</view>
							<view class="title">{{item.location.replace("，", "")}}</view>
						</view>
						<view class="cu-form-group">
							<view class="title">状态:</view>
							<view class="title">{{changeType(item.status)}}</view>
						</view>
						<!-- <view class="cu-form-group">
							<view class="title">消息:</view>
							<view class="title">{{item.message}}</view>
						</view> -->
						<view v-show="item.status == 'RESERVE'" class="cu-form-group">
							<button @click="opHandle(index)" class="cu-btn round sm bg-red">取消</button>
							<button @click="changeSeat(index)" class="cu-btn round sm bg-green">改签</button>
						</view>
						<view v-show="item.status == 'CHECK_IN' || item.status == 'AWAY'" class="cu-form-group">
							<button @click="opHandle(-1)" class="cu-btn round sm bg-red">结束</button>
							<button @click="changeSeat(index)" class="cu-btn round sm bg-green">改签</button>
						</view>
					</view>
				</view>
			</block>
		</scroll-view>
	</view>
</template>

<script>
	import {
		reservations_url,
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

		onShow() {
			this.init();
		},

		onPullDownRefresh() {
			//监听下拉刷新动作的执行方法，每次手动下拉刷新都会执行一次
			console.log('refresh');
			this.init();
		},

		methods: {
			/**
			 * 页面初始化函数
			 */
			init() {
				uni.showLoading({
					title: "正在获取预约记录"
				})
				sendRequest(reservations_url, "GET", null, null, this.initCallback)
			},

			initCallback(res) {
				uni.hideLoading();
				this.reservationsList = res.data == null ? [] : res.data;
				uni.stopPullDownRefresh(); //停止下拉刷新动画
				if (this.reservationsList.length == 0) {
					uni.showToast({
						icon: "none",
						title: "无预约记录",
						duration: 1500
					})
				}
			},

			/**
			 * 取消/结束操作事件
			 * 
			 * @param {Object} index 事件类型标志
			 */
			opHandle(index) {
				uni.showLoading({
					title: "正在取消"
				})
				var url = index > -1 ? (cancel_url + this.reservationsList[index].id) : stop_url;

				sendRequest(url, "GET", null, null, this.opCallback);
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

			/**
			 * 状态转化
			 * @param {Object} res
			 */
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
			},

			/**
			 * 改签事件
			 */
			changeSeat(index) {
				var end = this.reservationsList[index].end;
				var start = this.reservationsList[index].begin;
				var reserveId = this.reservationsList[index].id;
				var date = this.reservationsList[index].onDate;
				var seatId = this.reservationsList[index].seatId;
				var stat = this.reservationsList[index].status;
				console.info(end, start)
				uni.navigateTo({
					url: "../changeSeat/changeSeat?end=" + end + "&start=" + start + "&date=" + date + "&reserveId=" + reserveId +
						"&seatId=" + seatId + "&status=" + stat
				})
			}
		}
	}
</script>

<style>

</style>
