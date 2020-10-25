<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="false">
			<block slot="content">预约</block>
		</cu-custom>
		<view class="bg-white padding">
			<!-- <view class="grid margin-bottom text-center">
				限信息学部图书馆, 每日22:40后预约第二天，22:40前预约当前。抢座时请勿退出软件。
			</view> -->
			<view class="grid margin-bottom text-center">
				限信息学部图书馆使用，现只用于每日22:40后预约第二天的座位。抢座时请勿退出软件。
			</view>
		</view>
		<view class="cu-form-group margin-top">
			<view class="title">房间名</view>
			<picker :disabled="checkFlag" @tap="checkTime" @change="roomPickerChange" :value="roomIndex" :range="roomPicker">
				<view class="picker">
					{{ roomIndex>-1 ? roomPicker[roomIndex] :'选择房间'}}
				</view>
			</picker>
		</view>
		<view v-show="seatPicker != null" class="cu-form-group">
			<view class="title">座位号</view>
			<picker @change="seatPickerChange" :value="seatIndex" :range="seatPicker">
				<view class="picker">
					{{ seatIndex>-1 ? seatPicker[seatIndex] : '选择座位' }}
				</view>
			</picker>
		</view>
		<view v-show="seatPicker != null" class="cu-form-group margin-top">
			<view class="title">开始时间</view>
			<picker @change="startPickerChange" :value="startTimeIndex" :range="startPicker">
				<view class="picker">
					{{ startTimeIndex>-1 ? startPicker[startTimeIndex] :'选择开始时间'}}
				</view>
			</picker>
		</view>
		<view v-show="seatPicker != null" class="cu-form-group">
			<view class="title">结束时间</view>
			<picker @change="endPickerChange" :value="endTimeIndex" :range="endPicker">
				<view class="picker">
					{{ endTimeIndex>-1 ? endPicker[endTimeIndex] : '选择结束时间' }}
				</view>
			</picker>
		</view>

		<view class="padding flex flex-direction">
			<button :disabled="checkFlag" class="cu-btn bg-blue margin-tb-sm lg" @click="bookSeat">开始抢座</button>
		</view>

		<view class="cu-modal" :class="countDownFlag?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">抢座倒计时</view>
				</view>
				<view class="padding-xl">
					{{modelShowMag}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		roomDic,
		startTime,
		endTime
	} from '@/pages/common/js/config.js'
	import {
		layout_url,
		book_url,
		login_url
	} from '@/pages/common/js/url.js'

	import {
		getNowDate,
		getTomorrowDate,
		getNowTimeYDSText
	} from '@/pages/common/js/timeUtil.js'
	import sendRequest from '@/pages/common/js/sendRequest.js'
	export default {
		data() {
			return {
				'roomPicker': ['一楼 3C创客空间', '一楼 3C创客-咖啡区', '一楼 3C创客-电子阅读', "一楼 3C创客-双屏电脑", '一楼 创新学习-MAC电脑', "一楼 创新学习-云桌面",
					"一楼 创新学习-讨论区",
					'一楼 创新学习-沙发区', '二楼 西自然科学区', '二楼 东自然科学区', '二楼 中厅沙发区', '三楼 西社会科学区', '三楼 东社会科学区', '三楼 自主学习区', '三楼 中厅沙发区',
					'四楼 西图书阅览区', '四楼 东图书阅览区',
				],
				"seatPicker": null,
				"seats": {},
				"roomIndex": -1,
				"seatIndex": -1,

				"startPicker": ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00",
					"13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00",
					"19:30", "20:00", "20:30", "21:00", "21:30", "22:00"
				],
				"endPicker": ["08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00",
					"13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00",
					"19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30"
				],
				"startTimeIndex": -1,
				"endTimeIndex": -1,
				"seatsCount": 0,
				"seatsIndex": -1,


				"start": "",
				"end": "",
				"room": "",
				"seat": "",
				"date": "",

				"countDownFlag": false,
				"modelShowMag": "",
				"countNum": 0,
				"checkFlag": true,
				"bookOtherFlag": false,
			}
		},
		methods: {
			checkTime() {
				var nowTime = getNowTimeYDSText();

				if (nowTime < "22:40:00") {
					this.checkFlag = true;
					uni.showToast({
						title: "限22:40后预约第二天座位",
						icon: "none"
					})
					return;
				}
				this.checkFlag = false;
			},

			roomPickerChange(e) {
				this.roomIndex = e.target.value;
				var roomName = this.roomPicker[e.target.value];
				this.room = roomDic[roomName]
				var newUrl = "";
				if (getNowTimeYDSText() >= "22:45:00") {
					newUrl = layout_url + this.room + "/" + getNowDate();
				} else {
					newUrl = layout_url + this.room + "/" + getTomorrowDate();
				}
				console.info(newUrl, uni.getStorageSync('token'))
				sendRequest(newUrl, 'GET', null, null, this.callback)
			},

			callback(res) {
				console.info(res);
				this.dealWithRes(res);
			},

			dealWithRes(res) {
				this.seats = {}
				var layout = res.data.layout;
				for (var key in layout) {
					if (layout[key].type == "seat") {
						this.seats[layout[key].name] = layout[key].id;
					}
				}
				this.seatsIndex = -1;
				this.seatIndex = 0;
				this.seatPicker = Object.keys(this.seats);
				this.seat = this.seats[this.seatPicker[0]]
				this.seatsCount = this.seatPicker.length;
				console.info(this.seatPicker);
			},

			bookSeat() {

				if (this.seatIndex == -1) {
					uni.showToast({
						title: "请选择座位"
					})
					return;
				} else if (this.startTimeIndex == -1) {
					uni.showToast({
						title: "请选择开始时间"
					})
					return;
				} else if (this.endTimeIndex == -1) {
					uni.showToast({
						title: "请选择结束时间"
					})
					return;
				} else {
					var d = new Date()
					var nowTime = getNowTimeYDSText()
					console.info(nowTime)
					if (nowTime < "22:40:00") {
						this.date = getNowDate();
						this.bookHandle();
					} else if (nowTime > "22:45:00") {

						this.date = getTomorrowDate();
						this.bookHandle();

					} else {
						var time = new Date()
						this.countNum = (22 - time.getHours()) * 3600 + (44 - time.getMinutes()) * 60 + (60 - time.getSeconds())
						//this.countNum = (22 - time.getHours()) * 3600 + (53 - time.getMinutes()) * 60 + (60 - time.getSeconds())
						this.date = getTomorrowDate();

						this.countDown();
					}
				}
			},

			bookCallback(res) {
				if (res.code == 12) {
					var loginUrl = login_url + "?username=" + uni.getStorageSync("school_id") + "&password=" + uni.getStorageSync(
						"pwd");
					console.info("更新token");
					sendRequest(loginUrl, 'GET', null, null, this.reGetTokenCallback);
					setTimeout(function() {}, 2000);
				}

				if (res.status == "fail") {
					this.seatsIndex += 1;
					if (this.seatsIndex >= this.seatsCount) {
						uni.showToast({
							icon: 'none',
							title: "抢座失败，附近的座位也没了，请在看看别的吧",
							duration: 2000
						});
						return;
					}
					this.seat = this.seats[this.seatPicker[this.seatsIndex]]
					var that = this;
					setTimeout(function() {
						that.bookHandle();
					}, 1000);
					return;
				}
				uni.hideLoading();
				uni.showToast({
					icon: 'success',
					title: "抢座成功",
					duration: 1500
				});
				uni.setStorageSync("history_update", true)
				uni.switchTab({
					url: "../history/history"
				})
			},

			bookHandle() {
				uni.hideLoading();
				var body = {
					"t": "1",
					"startTime": this.start,
					"endTime": this.end,
					"seat": this.seat.toString(),
					"date": this.date,
					"t2": "2",
				}
				console.info(body);
				uni.showLoading({
					mask: true,
					title: "正在抢座"
				})
				sendRequest(book_url, "POST", body, null, this.bookCallback);
			},

			// 倒计时
			countDown() {

				// 设置medel倒计时时显示的信息
				this.modelShowMag = this.countNum + " S";
				// 更改model状态
				this.countDownFlag = !this.countDownFlag;
				// 设置倒计时
				this.intervalBtn = setInterval(() => {
					// 5秒倒计时
					if (this.countNum == 1) {
						// 清除定时器
						clearInterval(this.intervalBtn)
						this.countDownFlag = false;
						// 抢座
						this.bookHandle();
					}
					// 更新token
					if (this.countNum == 30) {
						var loginUrl = login_url + "?username=" + uni.getStorageSync("school_id") + "&password=" + uni.getStorageSync(
							"pwd");
						console.info("更新token")
						sendRequest(loginUrl, 'GET', null, null, this.reGetTokenCallback)
					}
					// 倒计时
					this.countNum--;
					this.modelShowMag = this.countNum + " S";
				}, 1000);
			},

			reGetTokenCallback(res) {
				console.info("更新token成功")
				uni.setStorageSync('token', res.data.token);
				var expireTime = new Date().getTime() + 10 * 60 * 1000;
				uni.setStorageSync('expire_time', expireTime);
				uni.showToast({
					icon: "success",
					title: "更新token成功",
					duration: 1200
				})
			},

			seatPickerChange(e) {
				this.seatIndex = e.target.value;
				this.seat = this.seats[this.seatPicker[e.target.value]]
			},

			startPickerChange(e) {
				this.startTimeIndex = e.target.value;
				this.start = startTime[this.startPicker[e.target.value]]
			},

			endPickerChange(e) {
				this.endTimeIndex = e.target.value;
				this.end = endTime[this.endPicker[e.target.value]]
			},
		}
	}
</script>

<style>

</style>
