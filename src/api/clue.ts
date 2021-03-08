import request from '@/utils/request'
let prefix = '/mock/81'
export const configurationManagementList = (data: any) =>
  request({
    url: `${prefix}/v2/market-clue/config/list`,
    method: 'post',
    data
  })
// 获取小组  设置policy

export const getUserGroup = (params: any) =>
  request({
    url: `${prefix}/v2/market-clue/config/get/user-group`,
    params
  })
// 获取小组人员
export const getGroupUser = (params: any) =>
  request({
    url: `${prefix}/v2/market-clue/user-group/user`,
    params
  })
// 设置 policy
export const setPolicy = (data:any) => request({
  url: `${prefix}/v2/market-clue/config/update/policy`,
  method: 'post',
  data
})

// 获取回流policy 列表

export const getBackFlowPolicyList = (params:any) => request({
  url: `${prefix}/v2/market-clue/update/policy/list`,
  params
})

// 获取默认时间

export const getBackFlowDeflutDate = (params:any) => request({
  url: `${prefix}/v2/clue/config/backflow/date`,
  params
})
