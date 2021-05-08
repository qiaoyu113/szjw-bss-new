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
  // 批量发起客邀
export const CreateLaunchGuestsBatch = (data: any) =>
  request({
    url: `mock/283/lines/startMatchCustInviteBatch`,
    method: 'post',
    data
  })
// 批量取消客邀
export const cancelMatchCustInviteBatch = (data: any) =>
  request({
    url: `mock/283/lines/cancelMatchCustInviteBatch`,
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
// 查询线路列表表单信息
export const getLineInfo = (params:any) =>
  request({
    url: `/mock/283/v1/line/search`,
    method: 'post',
    params
  })
// 获取线路suggest列表
export function getLineSearch(data:any) {
  return request({
    url: `${prefix}/v2/line/lineInfo/matchFuzzyCheck`,
    method: 'post',
    data
  })
}
// 获取线路详情
export function getLineDetailInfo(params:any) {
  return request({
    url: `/line_center/v2/line/lineInfo/detail`,
    method: 'get',
    params
  })
}
// 获取客邀列表详情
export function getLineDetail(params:any) {
  return request({
    url: `${prefix}/v1/customer/invitation/line/detail`,
    method: 'get',
    params
  })
}
// 司推：司机匹配线路
export function MatchLineListForDriver(data: any) {
  return request({
    url: `${prefix}/v1/matchDriverInfo/queryMatchLineForMatchDriver`,
    method: 'post',
    data
  })
}

// 通过线路id和当前城市获取备注
export function getLineRemarks(data:any) {
  return request({
    url: `${prefix}/v1/matchCustInvite/queryRemarks`,
    method: 'post',
    data
  })
}
