const timestampFormat = time => {
  const zeroize = num => {
    return (String(num).length === 1 ? "0" : "") + num;
  };
  let timestamp = parseInt(new Date(time).getTime() / 1000);
  let curTimestamp = parseInt(new Date().getTime() / 1000); //当前时间戳
  let timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数

  let curDate = new Date(curTimestamp * 1000); // 当前时间日期对象
  let tmDate = new Date(timestamp * 1000); // 参数时间戳转换成的日期对象

  let Y = tmDate.getFullYear(),
    m = tmDate.getMonth() + 1,
    d = tmDate.getDate();
  let H = tmDate.getHours(),
    i = tmDate.getMinutes(),
    s = tmDate.getSeconds();

  if (timestampDiff < 60) {
    // 一分钟以内
    return "刚刚";
  } else if (timestampDiff < 3600) {
    // 一小时前之内
    return Math.floor(timestampDiff / 60) + "分钟前";
  } else if (
    curDate.getFullYear() === Y &&
    curDate.getMonth() + 1 === m &&
    curDate.getDate() === d
  ) {
    return "今天" + zeroize(H) + ":" + zeroize(i);
  } else {
    let newDate = new Date((curTimestamp - 86400) * 1000); // 参数中的时间戳加一天转换成的日期对象
    if (
      newDate.getFullYear() === Y &&
      newDate.getMonth() + 1 === m &&
      newDate.getDate() === d
    ) {
      return "昨天" + zeroize(H) + ":" + zeroize(i);
    } else if (curDate.getFullYear() === Y) {
      return (
        zeroize(m) + "月" + zeroize(d) + "日 " + zeroize(H) + ":" + zeroize(i)
      );
    } else {
      return (
        Y +
        "年" +
        zeroize(m) +
        "月" +
        zeroize(d) +
        "日 " +
        zeroize(H) +
        ":" +
        zeroize(i)
      );
    }
  }
};

const dateFormat = (date, fmt) => {
  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return fmt;
};

const timeMap = [...Array(40)].map((value, index) => {
  if (index < 16) return index;
  else {
    if (index % 2 === 0) return index / 2 + ":00";
    else return (index - 1) / 2 + ":30";
  }
});

const getStartTime = startDate => {
  let date = new Date(startDate);
  const today = new Date();
  if (date.getDate() !== today.getDate() || today.getHours() < 8)
    return [...Array(24)].map((val, idx) => idx + 16);
  const start = Math.round(today.getHours() * 2 + today.getMinutes() / 60); //当前时间对应数字，8点对应16
  //19：30前可以预约
  if (start < 39) {
    return [...Array(39 - start)].map((val, idx) => start + idx + 1);
  } else return [];
};

const timeSpanMap = ["0", "30分钟", "60分钟", "90分钟", "120分钟"];

const easyFormat = timestamp => timestamp.replace("T", " ");

export {
  timestampFormat,
  timeMap,
  dateFormat,
  timeSpanMap,
  easyFormat,
  getStartTime
};
