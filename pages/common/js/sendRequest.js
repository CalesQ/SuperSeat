// 全局请求函数
function sendRequest(url = '', method = 'GET', param = {}, header = null, callBack) {
	if (header == null) {
		console.info('set header', uni.getStorageSync('token'));
		header = {
			'Accept' : '*/*',
			'Accept-Encoding' : 'gzip, deflate, br',
			'Accept-Language' : 'zh-CN,zh;q=0.9,en;q=0.8',
			'Connection' : 'keep-alive',
			'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
			'Host' : 'seat.lib.whu.edu.cn:8443',
			'User-Agent' : 'doSingle/11 CFNetwork/976 Darwin/18.2.0',
			'token': uni.getStorageSync('token')
		}
	}
	uni.request({
		url: url,
		method: method,
		data: param,
		header: header,

		success: (res) => {
			console.log('request', res)
			uni.hideLoading();
			if (res.data.status == "success") {
				
				callBack(res.data)
				
			} else if(res.data.status == "fail") {
				uni.showToast({
					icon: 'none',
					title: res.data.message,
				});
				if(res.data.code == "12") {
					uni.reLaunch({
						url: '/pages/login/login.vue'
					});
				}
			}
			else if (res.statusCode == 403) {
				uni.showToast({
					icon: 'none',
					title: '请重新登录',
				});

				uni.reLaunch({
					url: '/pages/login/login.vue'
				});
			} else {
				uni.showToast({
					icon: 'none',
					title: '请稍后重试',
				});
			}
		},

		fail: (res) => {
			console.log(res);
			uni.showToast({
				icon: 'none',
				title: '请稍后重试',
			});
		},

		complete: () => {}
	});
}

export default sendRequest
