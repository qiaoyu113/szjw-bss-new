import request from '@/utils/request'
// 查询线路列表表单信息
export const getLineInfo = (params:any) =>
  request({
    url: `/mock/283/v1/line/search`,
    method: 'post',
    params
  })
