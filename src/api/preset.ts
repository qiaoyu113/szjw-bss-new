import qs from 'qs'
import request from '@/utils/request'
const baseURL = '/base'
// 获取用户列表
export const GetUserListsV3 = (params:any) =>
  request({
    url: `${baseURL}/v3/base/user/page/list`,
    method: 'get',
    params,
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  })
// 获取用户信息通过id
export const GetUserDetail = (params:any) =>
  request({
    url: `${baseURL}/v3/base/user/getUserById`,
    method: 'get',
    params
  })

// 修改用户信息
export const UpdateUser = (data:any) =>
  request({
    url: `${baseURL}/v3/base/user/update`,
    method: 'post',
    data
  })

// 新建用户信息
export const CreateUser = (data:any) =>
  request({
    url: `${baseURL}/v3/base/user/create`,
    method: 'post',
    data
  })

// 角色管理-角色列表
export const roleList = (data: any = {}) =>
  request({
    url: `${baseURL}/v3/base/role/list`,
    method: 'post',
    data
  })

// 角色管理 角色分配用户
export const distributeRoleToUser = (data: any = {}) =>
  request({
    url: `${baseURL}/v3/base/role/distributeRoleToUser`,
    method: 'post',
    data
  })

// 权限管理-权限列表
export const authorityList = (params:object) =>
  request({
    url: `${baseURL}/v3/base/authority/list`,
    method: 'get',
    params
  })

// 角色管理-角色新增
export const createRole = (data: any = {}) =>
  request({
    url: `${baseURL}/v3/base/role/create`,
    method: 'post',
    data
  })

// 角色管理-获取角色详情
export const getRoleDetail = (id:number) =>
  request({
    url: `${baseURL}/v2/base/role/getByRoleId`,
    method: 'get',
    params: {
      roleId: id
    }
  })

// 角色管理-角色修改
export const updateRole = (data: any = {}) =>
  request({
    url: `${baseURL}/v1/base/role/update`,
    method: 'post',
    data
  })

// 职责管理-职责列表
export const dutyList = () =>
  request({
    url: `${baseURL}/v2/base/duty/list`,
    method: 'get'
  })

// 角色管理-角色删除
export const deleteRole = (id:number) =>
  request({
    url: `${baseURL}/v2/base/role/deleteByRoleId`,
    method: 'get',
    params: {
      roleId: id
    }
  })

// 分级获取组织架构
export const getOfficeList = (data:any) =>
  request({
    url: `${baseURL}/v3/base/office/list`,
    method: 'post',
    data
  })
