import request from '@/utils/request'
let prefix = '/mock/81'
export const configurationManagementList = (data: any) =>
  request({
    url: `${prefix}/v2/market-clue/config/list`,
    method: 'post',
    data
  })
