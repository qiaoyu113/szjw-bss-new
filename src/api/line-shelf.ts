import request from '@/utils/request'
let prefix2 = '/mock/237'
let prefix3 = '/mock/153'
// 基础
export const awitDetail = (params: any) =>
  request({
    url: `${prefix2}/awitDetail`,
    method: 'get',
    params
  })

// 配送
export const distribution = (params: any) =>
  request({
    url: `${prefix2}/awitDistribution`,
    method: 'get',
    params
  })
  // 结算
export const settlemen = (params: any) =>
  request({
    url: `${prefix2}/settlement`,
    method: 'get',
    params
  })
  // 货物
export const goods = (params: any) =>
  request({
    url: `${prefix2}/goods`,
    method: 'get',
    params
  })

// 已完成新线维护 Tab
export const getFinishedLine = (data :any) => {
  return request({
    url: `${prefix3}/v3/line/shelf/maintenance/queryLineShelfNewCompleted`,
    method: 'post',
    data
  })
}
// 已完成冗余线路维护  Tab
export const getFinishedMoreLine = (data :any) => {
  return request({
    url: `${prefix3}/v3/line/shelf/maintenance/queryLineListByConditionsQuery`,
    method: 'post',
    data
  })
}
