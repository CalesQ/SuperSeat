function getNowTimeText() {
	var date = new Date();
	return (date.getHours().toString().length < 2 ? "0" + date.getHours() : date.getHours()) + ':' + ((date.getMinutes() +
			5).toString()
		.length < 2 ? "0" + (date.getMinutes() + 5) : (date.getMinutes() + 5));
}

function getNowTimeYDSText() {
	var date = new Date();
	return (date.getHours().toString().length < 2 ? ("0" + date.getHours()) : date.getHours()) + ':' + ((date.getMinutes() +
			5).toString()
		.length < 2 ? "0" + (date.getMinutes() + 5) : (date.getMinutes() + 5)) + ":" + (date.getSeconds().toString().length <
		2 ? ("0" + date.getSeconds()) : date.getSeconds());
}

function getNowDate() {
	var date = new Date();
	return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
}

function getTomorrowDate() {
	var day3 = new Date();
	day3.setTime(day3.getTime() + 24 * 60 * 60 * 1000);
	var s3 = day3.getFullYear() + "-" + (day3.getMonth() + 1) + "-" + day3.getDate();
	return s3;
}

function getTimeTextFromTime(str) {
	if (str !== "0" && str !== "" && str !== null) {
		return ((Math.floor(str / 60)).toString().length < 2 ? "0" + (Math.floor(str / 60)).toString() :
				(Math.floor(str / 60)).toString()) + ":" +
			((str % 60).toString().length < 2 ? "0" + (str % 60).toString() : (str % 60).toString());
	} else {
		return "";
	}
}

function getTimeFromTimeText(str) {
	var arrminutes = str.split(":");
	if (arrminutes.length == 2) {
		var minutes = parseInt(arrminutes[0]) * 60 + parseInt(arrminutes[1]);
		return minutes;
	} else {
		return 0;
	}
}


export {
	getNowTimeText,
	getNowDate,
	getTomorrowDate,
	getTimeFromTimeText,
	getTimeTextFromTime,
	getNowTimeYDSText
};
