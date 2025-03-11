import dayjs from "@/utils/day";

export function isPhone() {
    let mobile = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    );
    return mobile !== null;
}
// 强制时区为东八区
export function formatTime(time, format = "YYYY-MM-DD HH:mm:ss") {
    const _time = time ? new Date(time) : new Date();
    return dayjs.tz(_time).format(format);
}

// 多字段排序 - 数值
export function sortBy(filed1, filed2) {
    return function (a, b) {
        if (a[filed1] === b[filed1]) {
            return a[filed2] - b[filed2];
        }
        return a[filed1] - b[filed1];
    };
}
