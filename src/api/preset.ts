import request from '@/utils/request'
const baseURL = '/base'

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
