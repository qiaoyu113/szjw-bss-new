import request from '@/utils/request'

const prefix = `/mock/283`
// matchCenter/v1
/**
 * 给司机打标签-查询接口
 */
export const searchMatchDriverInfo = (driverId: any) =>
  request({
    url: `${prefix}/v1/matchDriverLabel/getMatchDriverLabel/${driverId}`,
    method: 'get'
  })
  /**
 * 给司机打标签-保存接口
 */
export const updateDriverTag = (data:any) =>
  request({
    url: `${prefix}/v3/updateDriverTag`,
    method: 'put',
    data
  })
/**
 * 司机匹配线路查询接口
 */
export const queryMatchDriverForMatchLine = (data: any) =>
  request({
    url: `${prefix}/v1/matchDriverInfo/queryMatchDriverForMatchLine`,
    method: 'post',
    data
  })
