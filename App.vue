<script>
	import Vue from 'vue'
	export default {

		data() {
			return {
			}
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
			var updateServer = "http://47.93.211.200:5000/update"; //检查更新地址

			plus.runtime.getProperty(plus.runtime.appid, function(inf) {
				uni.setStorageSync("wgt_version", inf.version);
			});
			console.info(uni.getStorageSync("wgt_version"))
			var req = { //升级检测数据  
				"appid": plus.runtime.appid,
				"version": uni.getStorageSync("wgt_version"),
				"userid": uni.getStorageSync("school_id")
			};

			uni.request({
				url: updateServer,
				data: req,
				success: (res) => {
					console.info(res);
					var downloadUrl = res.data.url
					if (res.statusCode == 200 && res.data.status === 1) {
						uni.showModal({ //提醒用户更新  
							title: "更新提示",
							content: res.data.msg,
							success: (res) => {
								if (res.confirm) {
									uni.showLoading({
										title: "正在下载更新包"
									})
									let downloadTask = uni.downloadFile({
										url: downloadUrl,
										success(downloadResult) {

											if (downloadResult.statusCode === 200) {
												uni.hideLoading()
												uni.showToast({
													icon: "none",
													title: "下载完成，安装中",
													duration: 1200
												})
												plus.runtime.install(
													downloadResult.tempFilePath, {
														force: true
													},
													function() {
														uni.hideLoading();
														uni.showToast({
															icon: "none",
															title: "安装完成，即将重启应用",
															duration: 1200,
														})
														uni.hideLoading();
														setTimeout(() => {
															plus.runtime.restart();
														}, 2000);
													},
													function(e) {
														uni.showToast({
															icon: 'none',
															title: e
														});
													}
												);
											} else {
												uni.showToast({
													icon: "none",
													title: "更新包下载失败"
												})
												uni.hideLoading();
											}
										},
										fail(e) {
											that.content = e
											setTimeout(() => {
												that.$refs.mdLoading.hide()
											}, 1000)
										}
									});

									// 监听下载进度
									downloadTask.onProgressUpdate((e) => {
										uni.showLoading({
											title: '下载中...' + e.progress + ' %',
										})
									})
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
