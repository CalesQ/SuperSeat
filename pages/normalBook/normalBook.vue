<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">正常预约</block>
		</cu-custom>
		
		<view class="bg-white padding">
			<view class="grid text-center col-1">
				<view class="padding">您可预约的时段 {{start}} - {{end}}</view>
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
			<view class="cu-form-group">
				<view class="title">新的结束时间：</view>
				<picker mode="time" :value="endTimeText" :start="startTimeText" :end="end" @change="bindEndTimeTextChange">
					<view class="piker">{{endTimeText}}</view>
				</picker>
			</view>
			<view class="padding flex flex-direction">
				<button class="cu-btn bg-blue margin-tb-sm lg" @click="searchSeatOnTime">查询</button>
			</view>
		</view>
		<scroll-view scroll-y class="indexes" :style="[{height:'calc(100vh - '+ CustomBar + 'px)'}]"
		 :scroll-with-animation="true" :enable-back-to-top="true">
			<block v-for="(item,index) in seats" :key="index">
				<view class="cu-card case">
					
				</view>
			</block>
		</scroll-view>
	</view>
</template>

<script>
	import {
		getNowTimeText,
		getTimeFromTimeText,
		getNowDate
	} from "@/pages/common/js/timeUtil.js"
	
	import {
		search_url
	} from "@/pages/common/js/url.js"
	
	import {
		sendRequest
	} from "@/pages/common/js/sendRequest.js"
	
	export default {
		data() {
			return {
				seats: [],
				
				//  范围
				start: "",
				end: "22:30",
				
				// 显示的值
				startTimeText: "09:00",
				endTimeText: "22:30",
				
				// 预约参数
				startTime: "",
				endTime: "",
				seat: "",
				date: "",
			}
		},
		
		onShow() {
			this.start = getNowTimeText();
			
			this.startTime = getTimeFromTimeText(this.start);
			this.endTime = getTimeFromTimeText(this.end);
			this.startTimeText = this.start;
			this.endTimeText = this.end;
			this.date = getNowDate()
		},
		
		methods: {
			
			bindSartTimeTextChange(e) {
				if (e.target.value < this.startTimeText) {
					uni.showToast({
						icon: "none",
						title: "早于可选时间，自动选为最早可选时间"
					})
					return;
				}
				this.startTimeText = e.target.value;
				this.startTime = getTimeFromTimeText(this.startTimeText);
			},
			
			bindEndTimeTextChange(e) {
				if (e.target.value > this.endTimeText) {
					uni.showToast({
						icon: "none",
						title: "超过可选时间，自动选为最大可选时间"
					})
					return;
				}
				this.endTimeText = e.target.value;
				this.endTime = getTimeFromTimeText(this.endTimeText);
			},
			
			searchSeatOnTime() {
				
				var body = {
					"roomId": 1, // 一楼全部
					"buildingId": 1,
					"batch": "9999",
					"page": "1"
				}
				
				var searchUrl = search_url + this.date + "/" + this.startTime + "/" + this.endTime;
				sendRequest(searchUrl, "GET", body, null, this.searchSeatOnTimeCallback, null);
			},
			
			searchSeatOnTimeCallback(res) {
				if(res.data.seats == {}) {
					uni.showToast({
						icon: "none",
						title: "无可预约座位"
					})
				}
			}
		}
	}
</script>

<style>

</style>
