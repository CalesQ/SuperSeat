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

export {
	getNowDate,
	getTomorrowDate
};
