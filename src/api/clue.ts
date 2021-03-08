import request from '@/utils/request'
// const prefix = '/line'
const prefix = '/mock/81'
// 待分配线索 梧桐线索列表
export const GetToAllotWT = (data: any) =>
  request({
    url: `${prefix}/v2/market-clue/getToAllotWTClueList`,
    method: 'post',
    data
  })

// 待分配线索 雷鸟车池线索列表
export const GetToAllotLNCarPool = (data: any) =>
  request({
    url: `${prefix}/v2/market-clue/getToAllotLNCarPoolClueList`,
    method: 'post',
    data
  })

// 待分配线索 雷鸟租赁线索列表
export const GetToAllotLNLease = (data: any) =>
  request({
    url: `${prefix}/v2/market-clue/getToAllotLNLeaseClueList`,
    method: 'post',
    data
  })

// 公海池线索分配跟进人
export const UpdateFollowerByHighSeas = (data: any) =>
  request({
    url: `${prefix}/v2/market-clue/updateFollowerByHighSeas`,
    method: 'post',
    data
  })
// 私海池线索 梧桐线索列表
export const GetClueWSXPrivateSeaPoolList = (data: any) =>
  request({
    url: `${prefix}/v2/market-clue/getClueWSXPrivateSeaPoolList`,
    method: 'post',
    data
  })
// 私海池线索 雷鸟车池线索列表
export const GetClueLCXPrivateSeaPoolList = (data: any) =>
  request({
    url: `${prefix}/v2/market-clue/getClueLCXPrivateSeaPoolList`,
    method: 'post',
    data
  })
// 私海池线索 雷鸟租赁线索列表
export const GetClueLZXPrivateSeaPoolList = (data: any) =>
  request({
    url: `${prefix}/v2/market-clue/getClueLZXPrivateSeaPoolList`,
    method: 'post',
    data
  })
// 私海池线索分配跟进人
export const UpdateFollowerByPrivateSeas = (data: any) =>
  request({
    url: `${prefix}/v2/market-clue/updateFollowerByPrivateSeas`,
    method: 'post',
    data
  })
// 私海池 梧桐线索导入
export const UploadExcelFirmiana = (data: any) =>
  request({
    url: `${prefix}/v2/market-clue/privatePool/firmiana/import`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
// 私海池 梧桐线索导入
export const UploadExcelBird = (data: any) =>
  request({
    url: `${prefix}/v2/market-clue/privatePool/thunderBirdRental/import`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
// 私海池 梧桐线索导出（梧桐共享/梧桐专车）
export const ExportFirmiana = (params: any) =>
  request({
    url: `${prefix}/v2/market-clue/privatePool/firmiana/export`,
    method: 'get',
    params
  })
  // 私海池 雷鸟车池线索导出
export const ExportBirdTruck = (params: any) =>
  request({
    url: `${prefix}/v2/market-clue/privatePool/thunderBirdTruckPool/export`,
    method: 'get',
    params
  })
  // 私海池 雷鸟租赁线索导出
export const ExportBirdRental = (params: any) =>
  request({
    url: `${prefix}/v2/market-clue/privatePool/thunderBirdRental/export`,
    method: 'get',
    params
  })
