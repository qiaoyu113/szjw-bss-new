import request from '@/utils/request'
const base = '/base_center'

// 创建试跑意向
export const CreateLntentionRun = (data: any) =>
  request({
    url: `/waybill/v2/runtest/creatIntentionRun`,
    method: 'post',
    data
  })
// 模糊搜索线路编号、分页
export function getLineSearch(data:any) {
  return request({
    url: `/line_center/v2/line/lineInfo/fuzzyCheck`,
    method: 'post',
    data
  })
}
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
