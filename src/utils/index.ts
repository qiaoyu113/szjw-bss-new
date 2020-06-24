// Parse the time to string
import Vue from 'vue'

export const parseTime = (
  time?: object | string | number,
  cFormat?: string
): string | null => {
  if (time === undefined) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date: Date
  if (typeof time === 'object') {
    date = time as Date
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj: { [key: string]: number } = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      return '0' + value
    }
    return String(value) || '0'
  })
  return timeStr
}

export const Timestamp = (timestamp: any) => {
  const change = (t: any) => {
    if (t < 10) {
      return '0' + t
    } else {
      return t
    }
  }
  if (timestamp) {
    var date = new Date(timestamp)
    const Y = date.getFullYear() + '-'
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    const D = change(date.getDate()) + ' '
    const h = change(date.getHours()) + ':'
    const m = change(date.getMinutes()) + ':'
    const s = change(date.getSeconds())
    return Y + M + D + h + m + s
  } else {
    return '暂无数据'
  }
}

export const TimestampYMD = (timestamp: any) => {
  const change = (t: any) => {
    if (t < 10) {
      return '0' + t
    } else {
      return t
    }
  }
  if (timestamp) {
    var date = new Date(timestamp)
    const Y = date.getFullYear() + '-'
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    const D = change(date.getDate()) + ' '
    const h = change(date.getHours()) + ':'
    const m = change(date.getMinutes()) + ':'
    const s = change(date.getSeconds())
    return Y + M + D
  } else {
    return '暂无数据'
  }
}

/* 过滤是否为空 */
export const DataIsNull = (value: any) => {
  if (value === 0) {
    return value
  }
  if (!value && value !== undefined) {
    return '暂无数据'
  }
  if (value === undefined) {
    return 'Loading...'
  }
  if (value === '') {
    return '暂无数据'
  }
  return value
}

// Format and filter json data using filterKeys array
export const formatJson = (filterKeys: any, jsonData: any) =>
  jsonData.map((data: any) => filterKeys.map((key: string) => {
    if (key === 'timestamp') {
      return parseTime(data[key])
    } else {
      return data[key]
    }
  }))

// Check if an element has a class
export const hasClass = (ele: HTMLElement, className: string) => {
  return !!ele.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

// Add class to element
export const addClass = (ele: HTMLElement, className: string) => {
  if (!hasClass(ele, className)) ele.className += ' ' + className
}

// Remove class from element
export const removeClass = (ele: HTMLElement, className: string) => {
  if (hasClass(ele, className)) {
    const reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

// Toggle class for the selected element
export const toggleClass = (ele: HTMLElement, className: string) => {
  if (!ele || !className) {
    return
  }
  let classString = ele.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  ele.className = classString
}

// 列表过去时间转换
export const formatTime = (time: object | string | number, option?: any) => {
  time = +time * 1000
  const d: any = new Date(time)
  const now = Date.now()
  const diff = (now - d) / 1000
  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

// 过滤分页
export const HandlePages = (str: any) => {
  if (str === null || str === undefined || str === '') {
    Vue.prototype.$message({
      message: 'page返回信息为null,请检查接口',
      type: 'error'
    })
    let page = {
      total: 0
    }
    return page
  } else {
    return str
  }
}
