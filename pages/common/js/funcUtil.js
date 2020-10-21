function reGetTokenCallback(res) {
 	console.info("更新token成功")
 	uni.setStorageSync('token', res.data.token);
 	var expireTime = new Date().getTime() + 10 * 60 * 1000;
 	uni.setStorageSync('expire_time', expireTime);
 	uni.showToast({
 		icon: "none",
 		title: "更新token成功",
		duration: 1500
 	})
 }
 
 export {
 	reGetTokenCallback
 };
 
