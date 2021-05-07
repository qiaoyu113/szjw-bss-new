import request from '@/utils/request'
const base = '/base_center'

const prefix = `/mock/283`

// 创建试跑意向
export const CreateLntentionRun = (data: any) =>
  request({
    url: `${prefix}/v2/runtest/creatIntentionRun`,
    method: 'post',
    data
  })

// 发起客邀
export const CreateLaunchGuests = (data: any) =>
  request({
    url: `mock/283/lines/startMatchCustInvite`,
    method: 'post',
    data
  })
  // 取消客邀
export const cancelMatchCustInvite = (data: any) =>
  request({
    url: `mock/283/lines/cancelMatchCustInvite`,
    method: 'post',
    data
  })
// 获取客邀列表
export function getInvitedLines(data:any) {
  return request({
    url: `${prefix}/v1/matchLineInfo/queryInvitedLines`,
    method: 'post',
    data
  })
}
// 获取线路suggest列表
export function getLineSearch(data:any) {
  return request({
    url: `${prefix}/v1/line/suggest`,
    method: 'post',
    data
  })
}
