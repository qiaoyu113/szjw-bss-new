import request from '@/utils/request'
const baseURL = '/base'
// 职责管理-职责列表
export const dutyList = (params: any) =>
  request({
    url: `${baseURL}/v3/base/duty/queryDutyListByParentId`,
    method: 'get',
    params
  })
// 职责管理-创建职责
export const createDuty = (data: any = {}) =>
  request({
    url: `${baseURL}/v3/base/duty/create`,
    method: 'post',
    data
  })
// 职责管理-编辑职责
export const updateDuty = (data: any = {}) =>
  request({
    url: `${baseURL}/v3/base/duty/update`,
    method: 'post',
    data
  })
// 职责管理-删除职责
export const deleteDuty = (data: any = {}) =>
  request({
    url: `${baseURL}/v3/base/duty/delete`,
    method: 'post',
    data
  })
// 组织管理列表
// 组织管理-组织列表
export const getOfficeListPost = (data: any) =>
  request({
    url: `${baseURL}/v3/base/office/list`,
    method: 'post',
    data
  })
// 组织管理列表（异步加载）
export const getOfficeListAll = (params: any) =>
  request({
    url: `${baseURL}/v3/base/office/getAllChildrenWithNumber`,
    method: 'get',
    params
  })
// 组织管理-创建组织
export const createOffice = (data: any = {}) =>
  request({
    url: `${baseURL}/v3/base/office/create`,
    method: 'post',
    data
  })
// 组织管理-俩个组织排序
export const sortOffice = (data: any = {}) =>
  request({
    url: `${baseURL}/v1/base/office/sort`,
    method: 'post',
    data
  })
  // 组织管理-修改组织信息
export const updateOffice = (data: any = {}) =>
  request({
    url: `${baseURL}/v3/base/office/update`,
    method: 'post',
    data
  })
// 组织管理-删除组织
export const deleteOffice = (data: any = {}) =>
  request({
    url: `${baseURL}/v3/base/office/delete`,
    method: 'post',
    data
  })
// 组织管理-拖拽
export const officeDrag = (data: any = {}) =>
  request({
    url: `${baseURL}/v3/base/office/drag`,
    method: 'post',
    data
  })
  // 组织管理-查询职责列表
export const getDutyListByLevel = (data: any = {}) =>
  request({
    url: `${baseURL}/v3/base/duty/getDutyListByLevel`,
    method: 'post',
    data
  })
// 组织管理-同步城市
export const createAll = (data: any = {}) =>
  request({
    url: `${baseURL}/v3/base/office/createAll`,
    method: 'post',
    data
  })
