/* 
*  整合前端发送的API 
*/

// export const login_url = "https://seat.lib.whu.edu.cn:8443/rest/auth"; //登录API
// export const stats_url = "https://seat.lib.whu.edu.cn:8443/rest/v2/room/stats2/"; // +信息分馆区域信息API  信息馆ID1
// export const layout_url = "https://seat.lib.whu.edu.cn:8443/rest/v2/room/layoutByDate/"; // 某区域座位信息 +6:三楼西区域 后面还有yyyy-mm-dd时间
// export const startTime_url = "https://seat.lib.whu.edu.cn:8443/rest/v2/startTimesForSeat/"; // 座位开始时间API 后面还有yyyy-mm-dd时间
// export const endTime_url = "https://seat.lib.whu.edu.cn:8443/rest/v2/endTimesForSeat/"; // 座位结束时间API 后面还有yyyy-mm-dd时间
// export const book_url = "https://seat.lib.whu.edu.cn:8443/rest/v2/freeBook"; // 座位预约API
// export const search_url = "https://seat.lib.whu.edu.cn:8443/rest/v2/searchSeats/"; // 空位检索API date+startTime+endTime
// export const history_url = "https://seat.lib.whu.edu.cn:8443/rest/v2/history/1/10"; //预约记录 最后一位数为记录数目，自习助手默认为10  
// export const usr_url = "https://seat.lib.whu.edu.cn:8443/rest/v2/user"; // 用户信息API
// export const cancel_url = "https://seat.lib.whu.edu.cn:8443/rest/v2/cancel/"; // 取消预约API + 预约ID
// export const stop_url = "https://seat.lib.whu.edu.cn:8443/rest/v2/stop"; // 座位释放API  不需要其它ID
// export const reservations_url = "https://seat.lib.whu.edu.cn:8443/rest/v2/user/reservations"
/**
 * 图书馆
 */
export const login_url = "https://seat.lib.whu.edu.cn/rest/auth"; //登录API
export const stats_url = "https://seat.lib.whu.edu.cn/rest/v2/room/stats2/"; // +信息分馆区域信息API  信息馆ID1
export const layout_url = "https://seat.lib.whu.edu.cn/rest/v2/room/layoutByDate/"; // 某区域座位信息 +6:三楼西区域 后面还有yyyy-mm-dd时间
export const startTime_url = "https://seat.lib.whu.edu.cn/rest/v2/startTimesForSeat/"; // 座位开始时间API 后面还有yyyy-mm-dd时间
export const endTime_url = "https://seat.lib.whu.edu.cn/rest/v2/endTimesForSeat/"; // 座位结束时间API 后面还有yyyy-mm-dd时间
export const book_url = "https://seat.lib.whu.edu.cn/rest/v2/freeBook"; // 座位预约API
export const search_url = "https://seat.lib.whu.edu.cn/rest/v2/searchSeats/"; // 空位检索API date+startTime+endTime
export const history_url = "https://seat.lib.whu.edu.cn/rest/v2/history/1/10"; //预约记录 最后一位数为记录数目，自习助手默认为10  
export const usr_url = "https://seat.lib.whu.edu.cn/rest/v2/user"; // 用户信息API
export const cancel_url = "https://seat.lib.whu.edu.cn/rest/v2/cancel/"; // 取消预约API + 预约ID
export const stop_url = "https://seat.lib.whu.edu.cn/rest/v2/stop"; // 座位释放API  不需要其它ID
export const reservations_url = "https://seat.lib.whu.edu.cn/rest/v2/user/reservations"
export const new_search_url = "https://seat.lib.whu.edu.cn/freeBook/ajaxSearch" // get方法

export const all_room_url = "https://seat.lib.whu.edu.cn/rest/v2/free/filters" // 所有场馆信息 GET
export const violation_url = "https://seat.lib.whu.edu.cn/rest/v2/violations" // 违规信息 GET


/**
 * 系统
 */
const domain = "http://47.93.211.200:5000"
export const recordLog_url = domain + "/v1/log/record"
export const checkUpdate_url = domain + "/v1/appupdate/version"
export const appData_url = domain + "/v1/daily/data"
