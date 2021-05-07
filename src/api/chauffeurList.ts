import request from '@/utils/request'

let mock283 = '/mock/283'

export const MatchDriverList = (data: any) => {
  request({
    url: `${mock283}/v1/matchDriverInfo/queryMatchLineForMatchDriver`,
    method: 'post',
    data
  })
}

// export const matchDriverList = (data: any) => {
//   request({
//     url: `${mock283}/v1/matchDriverInfo/list`,
//     method: 'get',
//     params: data
//   })
// }
