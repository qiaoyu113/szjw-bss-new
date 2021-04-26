
import { Message } from 'element-ui'
import { PhoneModule } from '@/store/modules/phone'
let timer:any = null
// 挂断
export const hangUp = () => {
  if (PhoneModule.status !== 1) {
    // 挂机
    (window.frames as any).szjwCall.document.getElementById('HangupEnable').click();
    (window.frames as any).szjwCall.document.getElementById('moorCall-dialout-input').value = ''
  }
}

export const setInfo = (callId = '') => {
  let userId = localStorage.getItem('userId')
  let num = String(Math.random()).slice(2, 10)
  let date = `${userId}${Date.now()}${num}`
  let obj = {
    userId,
    date,
    callId,
    appId: PhoneModule.appId,
    secret: PhoneModule.secret,
    proxy_url: PhoneModule.proxyUrl,
    url: PhoneModule.url,
    qhbUrl: PhoneModule.qhbUrl
  }
  localStorage.setItem('szjw_params', JSON.stringify(obj))
  return date
}
// 呼叫
export const callPhone = (phone:string, callId:string) => {
  if (!phone) {
    Message.warning('请输入外呼电话')
    return ''
  }
  let date = setInfo(callId);
  // 设置电话
  (window.frames as any).szjwCall.document.getElementById('moorCall-dialout-input').value = phone;
  // 外呼
  (window.frames as any).szjwCall.document.getElementById('smallDialEnable').click()
  return date
}

// 接听电话
export const anwserPhone = () => {
  (window.frames as any).szjwCall.document.getElementById('incomingcall').click()
}

// 电话拨通后开始计时
export const startRecordTime = (anwserTime:number, cb:Function) => {
  timer = setInterval(() => {
    let now:number = Date.now()
    let diff:number = (now - anwserTime) / 1000
    let hour = formatTime(Math.floor(diff / 3600))
    let min = formatTime(Math.floor(diff % 3600 / 60))
    let sencond = formatTime(Math.floor(diff % 3600 % 60))
    let callTime = `${hour}:${min}:${sencond}`
    cb(callTime)
  }, 1000)
}
// 清除定时器
export const clearTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}
// 格式化时间
export const formatTime = (num:number) => {
  if (num < 10) {
    return `0${num}`
  }
  return num
}
