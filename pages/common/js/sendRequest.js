import {
	recordLog_url,
	book_url
} from "@/pages/common/js/url.js"

import {
	sleep
} from "@/pages/common/js/bookOtherSeat.js"

/**
 * 暂时保留 
 */
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

function recordLog(operationType, message, status) {
	var data = {
		"operation_type": operationType,
		"message": message,
		"status": status
	}
	uni.request({
		url: recordLog_url,
		method: "POST",
		data: data,
		header: {
			"Content-Type": "application/json",
			"school_id": uni.getStorageSync("school_id"),
			"app_id": plus.runtime.appid,
		},
		success(res) {
			console.log(res);
		},
	
		fail(res) {
			console.log(res);
		},
	
		complete() {
		}
	})
}

// 全局请求函数
function sendRequest(url = '', method = 'GET', param = {}, header = null, callBack, operationType=null) {
	if (header == null) {
		var timestamps = (new Date()).valueOf();
		if (method == "GET") {
			header = {
				'Accept': '*/*',
				'Accept-Encoding': 'gzip',
				'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
				'Host': 'seat.lib.whu.edu.cn:8443',
				'User-Agent': "doSingle/11 CFNetwork/976 Darwin/18.2.0",
				'x-request-date': timestamps
			}
		} else {
			header = {
				//'User-Agent': 'doSingle/11 CFNetwork/976 Darwin/18.2.0',
				'Accept': '*/*',
				'Accept-Encoding': 'gzip',
				'transfer-encoding': 'chunked',
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				'Host': 'seat.lib.whu.edu.cn:8443',
				'User-Agent': "doSingle/11 CFNetwork/976 Darwin/18.2.0",
				'x-request-date': timestamps
			}
		}
		
	}
	
	if (param == null) {
		param = {
			'token': uni.getStorageSync('token')
		}
	}
	
	var that = this;
	uni.request({
		url: url,
		method: method,
		data: param,
		header: header,

		success: (res) => {
			console.log('request', res)
			uni.hideLoading();
			if (res.data.status == "success" || res.data.status == true) {
				
				if (operationType != null) {
					recordLog(operationType, "success", 1);
				}
				callBack(res.data)

			} else if (res.data.status == "fail") {
				
				if (operationType != null) {
					recordLog(operationType, res.data.code + " " +res.data.message, 2);
				}
				
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
				
				if (operationType != null) {
					recordLog(operationType, "403", 0);
				}
				
				uni.showToast({
					icon: 'none',
					title: '请重新登录',
				});
			} else {
				// 400  直接重试
				if(res.statusCode == 400 && url == book_url) {
					sleep(200);
					callBack(res);
					return;
				}
				
				if (operationType != null) {
					recordLog(operationType, res.statusCode + " " + res.data, 0);
				}
				
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
				title: '网络错误，请稍后查看网络',
			});
		},

		complete: () => {}
	});
}

export {
	recordLog,
	sendRequest
};
