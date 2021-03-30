import request from '@/utils/request'
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

// 已完成新线维护 Tab
export const getFinishedLine = (data :any) => {
  return request({
    url: `${prefix3}/v3/line/shelf/maintenance/queryLineShelfNewCompleted`
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
    url: `${prefix3}/v3/line/shelf/maintenance/queryLineListByConditionsQuery`,
    method: 'post',
    data
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
export const passLine = (data:any) =>
  request({
    url: `${produce}/v3/line/lineShelf/batchIgnoreToDo`,
    method: 'post',
    data
  })
  // 批量下架代办
export const offShelf = (data:any) =>
  request({
    url: `${produce}/v3/line/lineShelf/batchShelfToDo`,
    method: 'post',
    data
  })
// 检查新线维护待办

export const checkNewlineTodo = (data:any) =>
  request({
    url: `${produce}/v3/line/lineShelf/checkTheNewLineMaintenance`,
    method: 'post',
    data
  })

// 下一个代办维护
export const nextNewLineTodo = () => request({
  url: `${produce}/v3/line/shelf/maintenance/nextNewLineMaintenance`
})
