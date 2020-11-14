<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="false">
			<block slot="content">预约记录</block>
		</cu-custom>
		<view v-show="reservationsList.length == 0 && historyList.length == 0" class="grid margin-bottom text-center col-1">
			<view class="padding">无预约记录</view>
		</view>
		<!-- 预约记录 -->
		<scroll-view v-show="!isHistory" scroll-y class="indexes" :style="[{height:'calc(100vh - '+ CustomBar + 'px)'}]"
		 :scroll-with-animation="true" :enable-back-to-top="true">
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
							<view class="title">{{item.location.replace("，座位号", "").replace("信息馆","信图")}}</view>
						</view>
						<view class="cu-form-group">
							<view class="title">状态:</view>
							<view class="title">{{changeType(item.status)}}</view>
						</view>
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

		<!-- 历史记录 -->
		<scroll-view v-show="isHistory" scroll-y class="indexes" :style="[{height:'calc(100vh - '+ CustomBar + 'px)'}]"
		 :scroll-with-animation="true" :enable-back-to-top="true">
			<block v-for="(item,index) in historyList" :key="index">
				<view class="cu-card case">
					<view class="cu-item shadow">
						<view class="cu-form-group">
							<view class="title">日期:</view>
							<view class="title">{{item.date}}</view>
						</view>
						<view class="cu-form-group">
							<view class="title">时间:</view>
							<view class="title">{{item.begin}} ~ {{item.end}}</view>
						</view>
						<view class="cu-form-group">
							<view class="title">位置:</view>
							<view class="title">{{item.loc.replace("信息馆","信图")}}</view>
						</view>
						<view class="cu-form-group">
							<view class="title">状态:</view>
							<view class="title">{{changeType(item.stat)}}</view>
						</view>
						<view v-show="item.stat == 'RESERVE'" class="cu-form-group">
							<button @click="opHandle(index)" class="cu-btn round sm bg-red">取消</button>
							<view class="title">次日凌晨01:00起才可改签</view>
						</view>
						<view v-show="item.stat == 'CHECK_IN' || item.stat == 'AWAY'" class="cu-form-group">
							<button @click="opHandle(-1)" class="cu-btn round sm bg-red">结束</button>
							<view class="title">次日凌晨01:00起才可改签</view>
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
		stop_url,
		history_url
	} from '@/pages/common/js/url.js'
	import {
		getNowTimeYDSText
	} from '@/pages/common/js/timeUtil.js'

	import {
		sendRequest
	} from '@/pages/common/js/sendRequest.js'

	export default {
		data() {
			return {
				'reservationsList': [],
				isHistory: false,
				historyList: [],
				divTime: '22:30:00'
			}
		},

		onLoad(options) {
			if (getNowTimeYDSText() > this.divTime) {
				this.isHistory = true;
				// 获取的是历史记录
				this.initHistory();
			} else {
				this.isHistory = false;
				this.init();
			}
		},

		onShow(options) {
			if (uni.getStorageSync("history_update")) {
				uni.setStorageSync("history_update", false);
				if (getNowTimeYDSText() > this.divTime) {
					this.isHistory = true;
					// 获取的是历史记录
					this.initHistory();
				} else {
					this.isHistory = false;
					this.init();
				}
			}
		},

		onPullDownRefresh() {
			//监听下拉刷新动作的执行方法，每次手动下拉刷新都会执行一次
			if (getNowTimeYDSText() > this.divTime) {
				this.isHistory = true;
				// 获取的是历史记录
				this.initHistory();
			} else {
				this.isHistory = false;
				this.init();
			}
		},

		methods: {
			/**
			 * 页面初始化函数 -- 默认预约记录
			 */
			init() {
				uni.showLoading({
					title: "正在获取预约记录"
				})
				sendRequest(reservations_url, "GET", null, null, this.initCallback, null)
			},

			initCallback(res) {
				uni.hideLoading();

				if (res.code == 12) {
					uni.removeStorageSync("token");
					uni.removeStorageSync("expire_time");
					uni.removeStorageSync("pwd");
					uni.reLaunch({
						url: "../login/login"
					})
					return;
				}


				if (this.isHistory) {
					// 历史记录
					this.historyList = res.data.reservations == null ? [] : res.data.reservations;
				} else {
					// 预约记录
					this.reservationsList = res.data == null ? [] : res.data;
				}
				uni.stopPullDownRefresh(); //停止下拉刷新动画
			},

			/**
			 * 获取历史记录列表
			 */
			initHistory() {
				uni.showLoading({
					title: "正在获取历史记录"
				})
				sendRequest(history_url, "GET", null, null, this.initCallback, null)
			},

			/**
			 * 取消/结束操作事件
			 * 
			 * @param {Object} index 事件类型标志
			 */
			opHandle(index) {
				
				if(getNowTimeYDSText() < "01:00:00") {
					uni.showToast({
						icon: "none",
						title: "1:00之后可取消"
					})
					return;
				}
				
				uni.showLoading({
					title: "正在取消"
				})
				var url = "";
				if (getNowTimeYDSText() > this.divTime) {
					url = index > -1 ? (cancel_url + this.historyList[index].id) : stop_url;
				} else {
					url = index > -1 ? (cancel_url + this.reservationsList[index].id) : stop_url;
				}
				var type = index > -1 ? "cancel" : "stop"
				
				sendRequest(url, "GET", null, null, this.opCallback, type);
			},

			opCallback(res) {
				var that = this;
				this.historyList = [];
				this.reservationsList = [];
				uni.showToast({
					title: "操作成功",
					complete() {
						if(that.isHistory) {
							that.initHistory();
						} else {
							that.init();
						}
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
