import request from '@/utils/request'
import qs from 'qs'
let prefix2 = '/mock/237'
let prefix3 = '/mock/153'
const produce = '/line_center'

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
let prefix4 = 'line_center'

// 已完成 新线维护 Tab
export const getFinishedLine = (data :any) => {
  return request({
    url: `${prefix4}/v3/line/shelf/maintenance/queryLineShelfNewCompleted`,
    method: 'post',
    data
  })
}
// 获取待办维护数据
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
    url: `${prefix4}/v3/line/shelf/maintenance/getLineShelfDetail`,
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
    url: `${produce}/v3/line/shelf/maintenance/queryLineListByConditionsQuery`,
    method: 'post',
    data
  })
// 忽略 批量忽略线路
export const passLine = (data:any, params:any) =>
  request({
    url: `${produce}/v3/line/shelf/maintenance/batchIgnoreToDo`,
    method: 'post',
    data,
    params,
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  })
  // 批量下架待办
export const offShelf = (data:any, params:any) =>
  request({
    url: `${produce}/v3/line/shelf/maintenance/batchShelfToDo`,
    method: 'POST',
    data,
    params,
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  })
// 检查新线维护待办

export const checkNewlineTodo = (data:any) =>
  request({
    url: `${produce}/v3/line/shelf/maintenance/checkTheNewLineMaintenance`,
    method: 'post',
    data
  })

// 下一个待办维护
export const nextNewLineTodo = () => request({
  url: `${produce}/v3/line/shelf/maintenance/nextNewLineMaintenance`
})
// 获取新的数量
export const getLineShelfNum = () => {
  return request({
    url: `${produce}/v3/line/shelf/maintenance/getlineShelfNewStatusNum`
    // url: `${produce}/v3/line/shelf/maintenance/lineShelfNumPublic`
  })
}

// 获取已完成新的数量
export const getLineShelfCompletedNum = () => {
  return request({
    url: `${produce}/v3/line/shelf/maintenance/getlineShelfNewCompletedNum`
  })
}

export const getCityList = () => {
  return request({
    url: `${produce}/v3/line/shelf/maintenance/getMaintenanceNumGroupByCity`,
    method: 'get'
  })
}

// 获取外线销售
export const getLineSale = (data:any) => {
  return request({
    url: `base/v2/base/user/getSpecifiedLowerUserListByCondition`,
    method: 'POST',
    data
  })
}

// 获取城市
export const getLineCity = () => {
  return request({
    url: `base_center/open/v1/area/getOpenCityData`,
    method: 'get'
  })
}

export const abc12 = () => {
  return request({
    url: `${produce}/v3/line/shelf/maintenance/getMaintenanceNumGroupByCity`
  })
}

export const visitExport = (data: any) =>
  request({
    url: `${produce}/v3/line/manager/visitExport`,
    method: 'post',
    data
  })
