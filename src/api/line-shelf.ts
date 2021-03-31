import request from '@/utils/request'
let prefix2 = '/mock/237'
let prefix3 = '/mock/153'
let prefix4 = 'line_center'

// 已完成 新线维护 Tab
export const getFinishedLine = (data :any) => {
  return request({
    url: `${prefix4}/v3/line/shelf/maintenance/queryLineShelfNewCompleted`,
    method: 'post',
    data
  })
}
// 获取代办维护数据
export const getNewLineDetail = (data:any) => {
  return request({
    url: '/mock/153/get/newLIne/agent',
    method: 'post',
    data
  })
}
// 已完成冗余线路维护  Tab
export const getFinishedMoreLine = (data :any) => {
  return request({
    url: `${prefix4}/v3/line/shelf/maintenance/queryLineListByConditionsQuery`,
    method: 'post',
    data
  })
}
// 获取线路详情信息
export const getLineDetail = (params :any) => {
  return request({
    url: `${prefix4}/v2/line/lineInfo/detail`,
    method: 'get',
    params
  })
}
// 获取快照详情信息
export const getLineSnapshot = (params :any) => {
  return request({
    url: `${prefix4}/v3/line/shelf/maintenance/getLineShelfSnapshot`,
    method: 'get',
    params
  })
}

// 获取an余线路列表
export const getReaundanLineList = (data:any) =>
  request({
    url: '/mock/153/get/agent/list',
    method: 'post',
    data
  })
// 忽略 批量忽略线路
export const passLine = (data:any) =>
  request({
    url: '/mock/153/pass/RedundantlineIgnored',
    method: 'post',
    data
  })
export const offShelf = (data:any) =>
  request({
    url: '/mock/153/redundant/offshelf',
    method: 'post',
    data
  })
