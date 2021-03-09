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
