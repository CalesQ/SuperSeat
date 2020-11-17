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
			<view class="cu-form-group">
				<view class="title">软件缓存：</view>
				<view class="title">{{fileSizeString}}</view>
				<button @click="clearCache" class="cu-btn round sm bg-red">清除</button>
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
	import {
		sendRequest
	} from '@/pages/common/js/sendRequest.js'

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
				},
				"fileSizeString": ""
			}
		},

		onLoad() {
			console.info("init")
			this.pageInit();
		},

		onPullDownRefresh() {
			//监听下拉刷新动作的执行方法，每次手动下拉刷新都会执行一次
			this.pageInit();
		},

		methods: {
			pageInit() {
				this.formatSize();
				sendRequest(usr_url, 'GET', null, null, this.callback, null);
			},

			callback(res) {
				uni.stopPullDownRefresh(); //停止下拉刷新动画
				if (res.code == 12) {
					this.removeUserInfo();
					uni.reLaunch({
						url: "../login/login"
					})
					return;
				}
				uni.showToast({
					icon: "none",
					title: "刷新成功"
				})
				this.userInfo = res.data;
			},

			reserveStat(s) {
				switch (s) {
					case "CHECK_IN":
						return "已签到";
					case "AWAY":
						return "离开";
					default:
						return "未签到";
				}
			},

			exit() {
				this.removeUserInfo();

				uni.redirectTo({
					url: "../login/login"
				})
			},

			removeUserInfo() {
				uni.setStorageSync("history_update", true);
				uni.removeStorageSync("token");
				uni.removeStorageSync("expire_time");
				uni.removeStorageSync("pwd");
			},

			formatSize() {
				let that = this;
				plus.cache.calculate(function(size) {
					let sizeCache = parseInt(size);
					if (sizeCache == 0) {
						that.fileSizeString = "0B";
					} else if (sizeCache < 1024) {
						that.fileSizeString = sizeCache + "B";
					} else if (sizeCache < 1048576) {
						that.fileSizeString = (sizeCache / 1024).toFixed(2) + "KB";
					} else if (sizeCache < 1073741824) {
						that.fileSizeString = (sizeCache / 1048576).toFixed(2) + "MB";
					} else {
						that.fileSizeString = (sizeCache / 1073741824).toFixed(2) + "GB";
					}
				});
			},

			clearCache() {
				let that = this;
				let os = plus.os.name;
				if (os == 'Android') {
					let main = plus.android.runtimeMainActivity();
					let sdRoot = main.getCacheDir();
					let files = plus.android.invoke(sdRoot, "listFiles");
					let len = files.length;
					for (let i = 0; i < len; i++) {
						let filePath = '' + files[i]; // 没有找到合适的方法获取路径，这样写可以转成文件路径  
						plus.io.resolveLocalFileSystemURL(filePath, function(entry) {
							if (entry.isDirectory) {
								entry.removeRecursively(function(entry) { //递归删除其下的所有文件及子目录  
									uni.showToast({
										title: '缓存清理完成',
										duration: 2000
									});
									that.formatSize(); // 重新计算缓存  
								}, function(e) {
									console.log(e.message)
								});
							} else {
								entry.remove();
							}
						}, function(e) {
							console.log('文件路径读取失败')
						});
					}
				} else { // ios  
					plus.cache.clear(function() {
						uni.showToast({
							title: '缓存清理完成',
							duration: 2000
						});
						that.formatSize();
					});
				}
			}
		}
	}
</script>

<style>

</style>
