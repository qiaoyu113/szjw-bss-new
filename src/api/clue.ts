import request from '@/utils/request'
// const baseURL = '/base'
const baseURL = '/mock/81'
// 获取客群细分列表
export const getClueUserGroupList = (params: any) =>
  request({
    url: `${baseURL}/v2/market-clue/user-group/getClueUserGroupList`,
    method: 'post',
    params
  })
