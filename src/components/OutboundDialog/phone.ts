
import { Message } from 'element-ui'
import { PhoneModule } from '@/store/modules/phone'

// 挂断
export const hangUp = () => {
  if (PhoneModule.status !== 1) {
    // 挂机
    (window.frames as any).szjwCall.document.getElementById('HangupEnable').click();
    (window.frames as any).szjwCall.document.getElementById('moorCall-dialout-input').value = ''
  }
}

// 呼叫
export const callPhone = (phone:string, callId:string) => {
  if (!phone) {
    Message.warning('请输入外呼电话')
    return ''
  }
  let userId = localStorage.getItem('userId')
  let num = String(Math.random()).slice(2, 10)
  let date = `${userId}${Date.now()}${num}`
  let obj = {
    userId,
    date,
    callId,
    appId: PhoneModule.appId,
    secret: PhoneModule.secret
  }
  localStorage.setItem('szjw_params', JSON.stringify(obj));
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
