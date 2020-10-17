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
	import sendRequest from '@/pages/common/js/sendRequest.js'
	export default {
		data() {
			return {
				'roomPicker': ['一楼3C创客空间', '一楼3C创客电子阅读', "一楼3C创客-双屏电脑(20台)", '一楼创新学习讨论区', "创新学习-MAC电脑（12台）", "创新学习-云桌面（42台）",
					'二楼西自然科学图书借阅区', '二楼东自然科学图书借阅区', '三楼西社会科学图书借阅区', '三楼自主学习区', '三楼东社会科学图书借阅区', '四楼东图书阅览区', '四楼西图书阅览区',
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

				"start": "",
				"end": "",
				"room": "",
				"seat": "",
				"date": "",

				"countDownFlag": false,
				"modelShowMag": "",
				"countNum": 0,
				"checkFlag": true
			}
		},
		methods: {
			checkTime() {
				var time = new Date();
				var nowTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
				
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
				var newUrl = layout_url + this.room + "/" + this.getNowDate();
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
				this.seatPicker = Object.keys(this.seats);
				console.info(this.seatPicker);
			},

			getNowDate() {
				var date = new Date();
				return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
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

			bookSeat() {

				var time = new Date();
				var nowTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();

				if (nowTime > "22:55:45") {
					uni.showToast({
						icon: 'none',
						title: "本时间段软件休息",
					});
					return;

				} else if (nowTime < "22:40:00") {
					this.date = this.getNowDate();
					// this.bookHandle();
				} else {
					nowTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds()

					this.countNum = (22 - time.getHours()) * 3600 + (44 - time.getMinutes()) * 60 + (60 - time.getSeconds())

					this.date = this.getTomorrowDate();

					this.countDown();
				}
			},

			bookCallback(res) {
				uni.showToast({
					icon: 'none',
					title: "抢座成功",
				});
				uni.hideLoading();
				uni.switchTab({
					url: "../history/history"
				})
			},

			getTomorrowDate() {
				var day3 = new Date();
				day3.setTime(day3.getTime() + 24 * 60 * 60 * 1000);
				var s3 = day3.getFullYear() + "-" + (day3.getMonth() + 1) + "-" + day3.getDate();
				return s3;
			},

			reGetTokenCallback(res) {
				console.info("更新token成功")
				uni.setStorageSync('token', res.data.token);
				var expireTime = new Date().getTime() + 6 * 60 * 1000;
				uni.setStorageSync('expire_time', expireTime);
			},

			bookHandle() {
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
					title: "正在抢座..."
				})
				sendRequest(book_url, "POST", body, null, this.bookCallback);
			},

			// 倒计时
			countDown() {

				var reGetFlag = false;
				this.countNum = 20;
				// 设置medel倒计时时显示的信息
				this.modelShowMag = this.countNum + " S";
				// 更改model状态
				this.countDownFlag = !this.countDownFlag;
				// 设置倒计时
				this.intervalBtn = setInterval(() => {
					if (this.countNum <= 1) {
						// 清除定时器
						clearInterval(this.intervalBtn)
						this.countDownFlag = false;
						// 抢座
						this.bookHandle();
					}
					// 更新token
					if (!reGetFlag && this.countNum <= 10) {
						var loginUrl = login_url + "?username=" + uni.getStorageSync("school_id") + "&password=" + uni.getStorageSync(
							"pwd");
						console.info("更新token")
						sendRequest(loginUrl, 'GET', null, null, this.reGetTokenCallback)
						reGetFlag = true;
					}
					// 倒计时
					this.countNum--;
					this.modelShowMag = this.countNum + " S";
				}, 1000);
			},
		}
	}
</script>

<style>

</style>
