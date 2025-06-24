/**
 * 删除类别中的空 Child
 * @param {className} class名称
 * @param {tagName} 标签名称
 */
export function checkEmptyChild(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].children.length === 0) {
      arr[i].children = ''
    } else {
      checkEmptyChild(arr[i].children)
    }
  }
}


/**
 * 时间转换
 * @param {time} 时间
 * @param {pattern} 转换格式
 */
export function parseTime(time, pattern) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = pattern || '{y}/{m}/{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    } else if (typeof time === 'string') {
      time = time.replace(new RegExp(/-/gm), '/').replace('T', ' ').replace(new RegExp(/\.\d{3}/gm),'');
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}
