import request from '@/utils/request'
let prefix2 = '/mock/237'

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
  // 获取代办维护数据
export const getNewLineDetail = (data:any) => {
  return request({
    url: '/mock/153/get/newLIne/agent',
    method: 'post',
    data
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
