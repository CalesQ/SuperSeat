import {
	search_url,
	book_url
} from "@/pages/common/js/url.js"

import {
	sendRequest
} from "@/pages/common/js/sendRequest.js"


var freeSeatIdList = []

var hasSeat = false

var seatListSize = 0

var seatIndex = -1

var startTime = ""
var endTime = ""
var date = ""
var rushBookTime = 1

var currentSeatId = ""

/**
 * 查询指定时间内指定房间内的空余座位，若有则直接预约，没有则根据条件约其他的座位
 */
function bookOther(roomId, buildingId, start, end, d) {
	uni.showLoading({
		mask: true,
		title: "正在查询周边座位"
	})

	startTime = start;
	endTime = end;
	date = d;

	hasSeat = false;
	var header = {
		'Accept': '*/*',
		'Accept-Encoding': 'gzip, deflate, br',
		'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
		'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
		'Host': 'seat.lib.whu.edu.cn:8443',
		'User-Agent': 'doSingle/11 CFNetwork/976 Darwin/18.2.0'
	}

	var body = {
		"roomId": roomId,
		//"buildingId": buildingId,
		"batch": "9999",
		"page": "1",
		'token': uni.getStorageSync('token')
	}

	var searchUrl = search_url + date + "/" + startTime + "/" + endTime;
	console.log(searchUrl)
	uni.request({
		url: searchUrl,
		method: "GET",
		header: header,
		data: body,
		success: (res) => {

			if (res.data.status == true) {
				var seatDic = res.data.data.seats;
				console.log(seatDic)
				for (var key in seatDic) {
					if (seatDic[key].type == "seat") {
						freeSeatIdList.push(seatDic[key].id.toString())
					}
				}
				if (freeSeatIdList.length <= 0) {
					uni.showToast({
						icon: "none",
						title: "抱歉，附近已无同类座位"
					})
					return;
				}
				seatListSize = freeSeatIdList.length;
				// 有空闲座位，直接尝试循环预约
				uni.hideLoading();
				uni.showLoading({
					mask: true,
					title: "开始预约周边座位"
				})

				bookFromFreeList();

			} else {
				uni.showToast({
					icon: "none",
					title: "查询空闲座位失败"
				})
			}
		},
		fail: (res) => {
			uni.showToast({
				icon: "none",
				title: "网络错误，查询空闲座位失败"
			})

			console.warn(res);
		}
	})
}

// numberMillis 毫秒
function sleep(numberMillis) {
	var now = new Date();
	var exitTime = now.getTime() + numberMillis;
	while (true) {
		now = new Date();
		if (now.getTime() >= exitTime) {
			return;
		}
	}
}

/**
 * 预约空座位
 */
function bookFromFreeList() {
	seatIndex += 1;
	rushBookTime = 1;
	if (seatIndex >= seatListSize) {
		uni.showToast({
			icon: "none",
			title: "已经抢座" + seatIndex + "次，附近已无同类座位"
		})
		return;
	}
	currentSeatId = freeSeatIdList[seatIndex]

	book();
}

/**
 * @param {Object} seatId 预约座位函数
 */
function book() {
	uni.showLoading({
		mask: true,
		title: "开始预约周边座位"
	})
	var body = {
		"startTime": parseInt(startTime),
		"endTime": parseInt(endTime),
		"seat": parseInt(currentSeatId),
		"date": date,
		"token": uni.getStorageSync('token')
	}
	console.info(body);
	sendRequest(book_url, "POST", body, null, bookCallback, "book_other");
}



/**
 * @param {Object} res 预约回调函数
 */
function bookCallback(res) {

	if (res.statusCode != undefined && res.statusCode == 400) {
		
		if (rushBookTime > 0) {
			rushBookTime = rushBookTime - 1;
			sleep(200)
			book();
			return;
		} else {
			sleep(300);
			bookFromFreeList();
			return;
		}
	}

	if (res.status == "success") {
		uni.hideLoading();
		hasSeat = true;
		uni.showToast({
			title: "抢座成功"
		})
		uni.setStorageSync("history_update", true)
		uni.switchTab({
			url: "/pages/history/history.vue"
		})
	}

	if (res.status == "fail") {
		sleep(500);
		bookFromFreeList();
	}
}

export {
	bookOther,
	sleep
};
