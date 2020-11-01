function writeLog(data = {}) {
	uni.request({
		url: "http:///47.93.211.200:5000/write/log/fail",
		method: "POST",
		data: data,
		header: {
			"Content-Type": "application/json"
		},
		success(res) {
			console.info(res);
		},

		fail(res) {
			console.info(res);
		},

		complete() {

		}
	})
}

// 全局请求函数
function sendRequest(url = '', method = 'GET', param = {}, header = null, callBack) {
	if (header == null) {
		console.info('set header', uni.getStorageSync('token'));
		header = {
			'Accept': '*/*',
			'Accept-Encoding': 'gzip, deflate, br',
			'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
			'Connection': 'keep-alive',
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			'Host': 'seat.lib.whu.edu.cn:8443',
			'User-Agent': 'doSingle/11 CFNetwork/976 Darwin/18.2.0',
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

			} else if (res.data.status == "fail") {
				if (res.data.code == "1" && res.data.message == "预约失败，请尽快选择其他时段或座位") {
					callBack(res.data);
					return;
				}
				uni.showToast({
					icon: 'none',
					title: res.data.message,
					duration: 1500
				});
				if (res.data.code == "12") {
					callBack(res.data);
				}
			} else if (res.statusCode == 403) {
				uni.showToast({
					icon: 'none',
					title: '请重新登录',
				});
			} else {
				var date = new Date();
				var createTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() +
					':' + date.getMinutes();
				var data = {
					"user_id": uni.getStorageSync("school_id"),
					"log": res,
					"create_time": createTime
				}

				writeLog(data);

				uni.showToast({
					icon: 'none',
					title: '请求错误，请稍后重试',
				});
			}
		},

		fail: (res) => {
			console.log(res);
			uni.showToast({
				icon: 'none',
				title: '网络错误，请稍后重试',
			});
		},

		complete: () => {}
	});
}

export default sendRequest
