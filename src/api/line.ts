
import request from '@/utils/request'
const lineURL = '/line'

/**
 * 获取配置管理列表
 * 请求参数：
 * page | 页码
 * limit | 条数
 */
export const getLableLists = (params:any) =>
  request({
    url: `${lineURL}/v2/line/label/list`,
    method: 'get',
    params
  })

/**
 * 校验当前城市是否配置过肥瘦标签
 * 请求参数：
 * cityCode | 城市code
 */
export const checkCityIsExist = (params:any) =>
  request({
    url: `${lineURL}/v2/line/label/checkCityIsExist`,
    method: 'get',
    params
  })

/**
 * 创建线路标签
 * 请求参数：
 * cityCode | 城市code
 * cityName | 城市名字
 * sepcialCodes | 专车的肥瘦标签code
 * shareCodes |  共享的肥瘦标签code
 */
export const saveLineLabel = (data:any) =>
  request({
    url: `${lineURL}/v2/line/label/create`,
    method: 'post',
    data
  })

/**
 * 调整线路标签
 * 请求参数：
 * id | 线路的id
 * cityCode | 城市code
 * cityName | 城市名字
 * sepcialCodes | 专车的肥瘦标签code
 * shareCodes |  共享的肥瘦标签code
 */
export const updateLineLabel = (data:any) =>
  request({
    url: `${lineURL}/v2/line/label/update`,
    method: 'put',
    data
  })

/**
 * 查询线路标签详情
 * 请求参数：
 * id | 线路的id
 */
export const getLineLabelById = (params:any) =>
  request({
    url: `${lineURL}/v2/line/label/getLineLabelById`,
    method: 'get',
    params
  })
