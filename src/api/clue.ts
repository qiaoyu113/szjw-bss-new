import request from '@/utils/request'
const baseURL = '/base'
// const baseURL = '/mock/81'
// 获取客群细分列表
export const getClueUserGroupList = (data: any) =>
  request({
    url: `${baseURL}/v2/market_clue/user-group/getClueUserGroupList`,
    method: 'post',
    data
  })

// 获取客群创建
export const UserGroupCreate = (params: any) =>
  request({
    url: `${baseURL}/v2/market_clue/user-group/create`,
    method: 'post',
    params
  })

// 客群导出
export const UserGroupExport = (params: any) =>
  request({
    url: `${baseURL}/v2/market-clue/user-group/userGroup/export`,
    method: 'get',
    params
  })
