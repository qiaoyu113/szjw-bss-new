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
