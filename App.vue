<script>
	import Vue from 'vue'
	import {
		recordLog
	} from "@/pages/common/js/sendRequest.js"
	
	import {
		checkUpdate_url
	} from "@/pages/common/js/url.js"
	export default {

		data() {
			return {}
		},

		onLaunch: function() {
			uni.getSystemInfo({
				success: function(e) {
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					};
					// #endif

					// #ifdef MP-WEIXIN
					Vue.prototype.StatusBar = e.statusBarHeight;
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					// #endif		

					// #ifdef MP-ALIPAY
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
					// #endif
				}
			})

			Vue.prototype.ColorList = [{
					title: '嫣红',
					name: 'red',
					color: '#e54d42'
				},
				{
					title: '桔橙',
					name: 'orange',
					color: '#f37b1d'
				},
				{
					title: '明黄',
					name: 'yellow',
					color: '#fbbd08'
				},
				{
					title: '橄榄',
					name: 'olive',
					color: '#8dc63f'
				},
				{
					title: '森绿',
					name: 'green',
					color: '#39b54a'
				},
				{
					title: '天青',
					name: 'cyan',
					color: '#1cbbb4'
				},
				{
					title: '海蓝',
					name: 'blue',
					color: '#0081ff'
				},
				{
					title: '姹紫',
					name: 'purple',
					color: '#6739b6'
				},
				{
					title: '木槿',
					name: 'mauve',
					color: '#9c26b0'
				},
				{
					title: '桃粉',
					name: 'pink',
					color: '#e03997'
				},
				{
					title: '棕褐',
					name: 'brown',
					color: '#a5673f'
				},
				{
					title: '玄灰',
					name: 'grey',
					color: '#8799a3'
				},
				{
					title: '草灰',
					name: 'gray',
					color: '#aaaaaa'
				},
				{
					title: '墨黑',
					name: 'black',
					color: '#333333'
				},
				{
					title: '雅白',
					name: 'white',
					color: '#ffffff'
				},
			]

			//在线更新
			//#ifdef APP-PLUS  
			
			var req = { //升级检测数据  
				"version": uni.getStorageSync("wgt_version"),
			};

			uni.request({
				url: checkUpdate_url,
				header: {
					"Content-Type": "application/json",
					"school_id": uni.getStorageSync("school_id"),
					"app_id": plus.runtime.appid
				},
				data: req,
				success: (res) => {
					console.info(res);
					var downloadUrl = res.data.data.update_url
					this.appVersion = res.data.data.app_version
					if (res.statusCode == 200 && res.data.code === 101) {
						
						if(downloadUrl == "") {
							uni.setStorageSync("wgt_version", this.appVersion);
							return;
						}
						
						uni.showModal({ //提醒用户更新  
							title: "更新提示",
							content: res.data.msg,
							success: (res) => {
								if (res.confirm) {
									var that = this
									var dtask = plus.downloader.createDownload(
										downloadUrl, {},
										function(d, status) {
											uni.showToast({
												title: '下载完成',
												mask: false,
												duration: 1000
											});
											plus.nativeUI.closeWaiting();
											// 下载完成
											if (status == 200) {
												plus.runtime.install(
													d.filename, {
														force: true
													},
													function() {
														uni.hideLoading();
														uni.showToast({
															icon: "none",
															title: "安装完成，请重新打开",
															duration: 1200,
														})
														recordLog("app_update", "更新成功", 1);
														uni.setStorageSync("wgt_version", that.appVersion);
														plus.runtime.quit();
													},
													function(e) {
														uni.showToast({
															icon: 'none',
															title: e
														});
													}
												);

											} else {
												recordLog("app_update", "更新失败-01", 0);
												uni.showToast({
													title: '更新失败-01',
													duration: 1500
												});
											}
										});

									try {
										dtask.start(); // 开启下载的任务
										var prg = 0;
										var showLoading = plus.nativeUI.showWaiting("正在下载"); //创建一个showWaiting对象 
										dtask.addEventListener('statechanged', function(
											task,
											status
										) {
											// 给下载任务设置一个监听 并根据状态  做操作
											switch (task.state) {
												case 1:
													showLoading.setTitle("正在下载");
													break;
												case 2:
													showLoading.setTitle("已连接到服务器");
													break;
												case 3:
													prg = parseInt(
														(parseFloat(task.downloadedSize) /
															parseFloat(task.totalSize)) *
														100
													);
													showLoading.setTitle("  正在下载 " + prg + " %  ");
													break;
												case 4:
													plus.nativeUI.closeWaiting();
													//下载完成
													break;
											}
										});
									} catch (err) {
										plus.nativeUI.closeWaiting();
										recordLog("app_update", "更新失败-02", 0)
										uni.showToast({
											title: '更新失败-02',
											mask: false,
											duration: 1500
										});
									}
								}
							}
						});
					}
				}
			})

			//#endif  
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		
		methods: {
			// numberMillis 毫秒
			sleep(numberMillis) {
				var now = new Date();
				var exitTime = now.getTime() + numberMillis;
				while (true) {
					now = new Date();
					if (now.getTime() >= exitTime){
						return;
					}
				}
			}
		}
		
	}
</script>

<style>
	@import "colorui/main.css";
	@import "colorui/icon.css";

	.nav-list {
		display: flex;
		flex-wrap: wrap;
		padding: 0px 40upx 0px;
		justify-content: space-between;
	}

	.nav-li {
		padding: 30upx;
		border-radius: 12upx;
		width: 45%;
		margin: 0 2.5% 40upx;
		background-image: url(https://cdn.nlark.com/yuque/0/2019/png/280374/1552996358352-assets/web-upload/cc3b1807-c684-4b83-8f80-80e5b8a6b975.png);
		background-size: cover;
		background-position: center;
		position: relative;
		z-index: 1;
	}

	.nav-li::after {
		content: "";
		position: absolute;
		z-index: -1;
		background-color: inherit;
		width: 100%;
		height: 100%;
		left: 0;
		bottom: -10%;
		border-radius: 10upx;
		opacity: 0.2;
		transform: scale(0.9, 0.9);
	}

	.nav-li.cur {
		color: #fff;
		background: rgb(94, 185, 94);
		box-shadow: 4upx 4upx 6upx rgba(94, 185, 94, 0.4);
	}

	.nav-title {
		font-size: 32upx;
		font-weight: 300;
	}

	.nav-title::first-letter {
		font-size: 40upx;
		margin-right: 4upx;
	}

	.nav-name {
		font-size: 28upx;
		text-transform: Capitalize;
		margin-top: 20upx;
		position: relative;
	}

	.nav-name::before {
		content: "";
		position: absolute;
		display: block;
		width: 40upx;
		height: 6upx;
		background: #fff;
		bottom: 0;
		right: 0;
		opacity: 0.5;
	}

	.nav-name::after {
		content: "";
		position: absolute;
		display: block;
		width: 100upx;
		height: 1px;
		background: #fff;
		bottom: 0;
		right: 40upx;
		opacity: 0.3;
	}

	.nav-name::first-letter {
		font-weight: bold;
		font-size: 36upx;
		margin-right: 1px;
	}

	.nav-li text {
		position: absolute;
		right: 30upx;
		top: 30upx;
		font-size: 52upx;
		width: 60upx;
		height: 60upx;
		text-align: center;
		line-height: 60upx;
	}

	.text-light {
		font-weight: 300;
	}

	@keyframes show {
		0% {
			transform: translateY(-50px);
		}

		60% {
			transform: translateY(40upx);
		}

		100% {
			transform: translateY(0px);
		}
	}

	@-webkit-keyframes show {
		0% {
			transform: translateY(-50px);
		}

		60% {
			transform: translateY(40upx);
		}

		100% {
			transform: translateY(0px);
		}
	}
</style>
