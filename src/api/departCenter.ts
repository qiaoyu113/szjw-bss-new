import request from '@/utils/request'
const base = '/base_center'

const prefix = `/mock/283`

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
// 获取客邀列表
export function getInvitedLines(data:any) {
  return request({
    url: `${prefix}/v1/matchLineInfo/queryInvitedLines`,
    method: 'post',
    data
  })
}
