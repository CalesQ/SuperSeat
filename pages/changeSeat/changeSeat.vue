<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">改签</block>
		</cu-custom>
		<view class="bg-white padding">
			<view class="grid margin-bottom text-center col-1">
				<view class="padding">您可改签的时段范围 {{start}} - {{end}}</view>
			</view>
			<view class="cu-form-group">
				<view class="title">新的开始时间：</view>
				<picker mode="time" :value="startTimeText" :start="start" :end="end" @change="bindSartTimeTextChange">
					<view class="piker">{{startTimeText}}</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">新的结束时间：</view>
				<picker mode="time" :value="endTimeText" :start="startTimeText" :end="end" @change="bindEndTimeTextChange">
					<view class="piker">{{endTimeText}}</view>
				</picker>
			</view>

			<view class="padding flex flex-direction">
				<button class="cu-btn bg-blue margin-tb-sm lg" @click="endUseHandle">改签</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		cancel_url,
		stop_url,
		login_url,
		reservations_url,
		book_url
	} from "@/pages/common/js/url.js"
	import {
		getNowDate,
		getTimeFromTimeText,
		getNowTimeText
	} from "@/pages/common/js/timeUtil.js"

	import {
		sleep
	} from "@/pages/common/js/bookOtherSeat.js"

	import {
		sendRequest
	} from "@/pages/common/js/sendRequest.js"

	export default {
		data() {
			return {
				//  范围
				"start": "",
				"end": "",
				// 显示的值
				"startTimeText": "09:00",
				"endTimeText": "22:30",

				// 预约参数
				"startTime": "",
				"endTime": "",
				"seat": "",
				"date": "",

				// 取消参数
				"reserveId": "",
				"status": "",
				
				"opUrl": "",
				"type": ""
			}
		},

		onLoad(options) {
			this.start = options.start > getNowTimeText() ? options.start : getNowTimeText();
			this.end = options.end;

			this.startTime = getTimeFromTimeText(options.start);
			this.endTime = getTimeFromTimeText(options.end);
			this.startTimeText = this.start;
			this.endTimeText = this.end;

			this.seat = options.seatId;
			this.date = options.date;
			this.reserveId = options.reserveId;
			this.status = options.status
		},

		methods: {

			/**
			 * 先结束使用
			 */
			endUseHandle() {
				uni.showLoading({
					mask: true,
					title: "正在改签"
				})
				if (this.startTime == null || this.startTime == '' || this.startTime == 0) {
					uni.showToast({
						icon: 'none',
						title: '请选择开始时间',
						duration: 2000
					});
				} else if (this.endTime == null || this.endTime == '' || this.endTime == 0) {
					uni.showToast({
						icon: 'none',
						title: '请选择结束时间',
						duration: 2000
					});
				} else if (this.startTime >= this.endTime) {
					uni.showToast({
						icon: 'none',
						title: '开始时间需要小于结束时间',
						duration: 2000
					});
				} else {

					if (this.start > this.startTimeText || this.end < this.endTimeText) {
						uni.showToast({
							icon: "none",
							title: "您的选择超出可选范围，请修改",
							duration: 1500
						})
						return;
					}

					// 选择操作地址
					this.opUrl = this.status == "RESERVE" ? cancel_url + this.reserveId : stop_url;
					this.type = this.status == "RESERVE" ? "cancel" : "stop";
					
					// 检查 token 是否过期
					if (uni.getStorageSync("expire_time") < new Date().getTime()) {
						// 重新登录，更新 token
						var loginUrl = login_url + "?username=" + uni.getStorageSync("school_id") + "&password=" + uni.getStorageSync(
							"pwd");
						sendRequest(loginUrl, 'GET', null, null, this.reGetTokenCallback, null)
				
					} else {
						sendRequest(this.opUrl, "GET", null, null, this.endUseCallback, this.type);
					}
				}
			},

			reGetTokenCallback(res) {
				console.info("更新token成功")
				uni.setStorageSync('token', res.data.token);
				var expireTime = new Date().getTime() + 10 * 60 * 1000;
				uni.setStorageSync('expire_time', expireTime);
				uni.showToast({
					icon: "none",
					title: "重新登录成功",
					duration: 1500
				})
				
				sendRequest(this.opUrl, "GET", null, null, this.endUseCallback, this.type);
			},

			endUseCallback(res) {
				console.info("success to end use.");
				
				// 预约新的时间段
				this.bookNewTimeHandle();
			},

			// 预约新的时间段
			bookNewTimeHandle() {
				var data = {
					"startTime": this.startTime.toString(),
					"endTime": this.endTime.toString(),
					"seat": this.seat.toString(),
					"date": this.date,
					"token": uni.getStorageSync('token')
				}

				sendRequest(book_url, "POST", data, null, this.bookCallback, "change");
			},

			bookCallback(res) {
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

				if (res.data.status == "fail") {
					uni.showToast({
						icon: 'none',
						title: "改签失败，尽快手动使用武大图书馆预约本座位。快!",
						duration: 1500
					});
					return;
				}

				uni.showToast({
					icon: 'success',
					title: "改签成功",
					duration: 1500
				});
				uni.setStorageSync('history_update', true);
				uni.switchTab({
					url: "../history/history"
				})
			},

			bindSartTimeTextChange(e) {
				this.startTimeText = e.target.value;
				this.startTime = getTimeFromTimeText(this.startTimeText);
			},

			bindEndTimeTextChange(e) {
				this.endTimeText = e.target.value;
				this.endTime = getTimeFromTimeText(this.endTimeText);
			}
		}
	}
</script>

<style>

</style>
