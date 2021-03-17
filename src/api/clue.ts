import request from '@/utils/request'
const baseUrl = '/carrier_center'
// const baseUrl = '/mock/81'
const prefix = '/line'
// const prefix = '/mock/81'
// 待分配线索 梧桐线索列表
const produce = '/carrier_center'
const base = '/base_center'

export const GetToAllotWT = (data: any) =>
  request({
    url: `${produce}/v2/market-clue/getToAllotWTClueList`,
    method: 'post',
    data
  })
// 待分配线索 雷鸟车池线索列表
export const GetToAllotLNCarPool = (data: any) =>
  request({
    url: `${produce}/v2/market-clue/getToAllotLNCarPoolClueList`,
    data,
    method: 'post'
  })
// 获取随机分配policy列表(梧桐共享)
export const configurationWTShareList = (data: any) =>
  request({
    url: `${baseUrl}/v2/market-clue/config/WTShareList`,
    method: 'post',
    data
  })
  // 获取随机分配policy列表（梧桐专车）
export const configurationWTSpecialList = (data: any) =>
  request({
    url: `${baseUrl}/v2/market-clue/config/WTSpecialList`,
    method: 'post',
    data
  })
// 获取随机分配policy列表（雷鸟车池）
export const configurationLCList = (data: any) =>
  request({
    url: `${baseUrl}/v2/market-clue/config/LCList`,
    method: 'post',
    data
  })
  // 获取随机分配policy列表（雷鸟租赁）
export const configurationLZList = (data: any) =>
  request({
    url: `${baseUrl}/v2/market-clue/config/LZList`,
    method: 'post',
    data
  })
// 设置随机分配policy
export const setrandomPolicy = (data:any) => request({
  url: `${baseUrl}/v2/market-clue/config/updatePolicy/notReceiveIds`,
  method: 'post',
  data
})
// 不接受线索人员Ids 查询人员信息
export const searchInformation = (params:any) => request({
  url: `${baseUrl}/v2/market-clue/user-group/updatePolicy/getUserInfoList`,
  method: 'get',
  params
})
// 设置回流policy
export const setPolicy = (data:any) => request({
  url: `${baseUrl}/v2/market-clue/reflow_conf/settingReflowedConf`,
  method: 'post',
  data
})

// 获取回流policy 列表
export const getBackFlowPolicyList = (data:any) => request({
  url: `${baseUrl}/v2/market-clue/reflow_conf/list`,
  method: 'post',
  data
})

// 获取campaign列表
export const GetClueCampaignList = (data: any) =>
  request({
    url: `${baseUrl}/v2/clue/campaign/getClueCampaignList`,
    method: 'post',
    data
  })

// campaign导出
export const CampaignExport = (data: any) =>
  request({
    url: `${baseUrl}/v2/clue/campaign/campaign/export`,
    method: 'post',
    data: data
  })

// 新建campaign
export const AddCampaign = (data: any) =>
  request({
    url: `${baseUrl}/v2/clue/campaign/addCampaign`,
    method: 'post',
    data
  })
// campaign线索导入-梧桐专车/梧桐共享
export const FirmianaImport = (data: any) =>
  request({
    url: `${baseUrl}/v2/clue/campaign/campaign/firmiana/import`,
    method: 'post',
    data
  })
  // campaign线索导入-雷鸟租赁
export const ThunderBirdRentalImport = (data: any) =>
  request({
    url: `${baseUrl}/v2/clue/campaign/campaign/thunderBirdRental/import`,
    method: 'post',
    data
  })
// campaign线索导入-雷鸟车池
export const ThunderBirdTruckPoolImport = (data: any) =>
  request({
    url: `${baseUrl}/v2/clue/campaign/campaign/thunderBirdTruckPool/import`,
    method: 'post',
    data
  })

// campaign详情
export const GetcampaignDetail = (params: any) =>
  request({
    url: `${baseUrl}/v2/clue/campaign/campaignDetail`,
    method: 'get',
    params
  })

// 专车、共享数据统计
export const CampaignDataGroupToFirmiana = (params: any) =>
  request({
    url: `${baseUrl}/v2/clue/campaign/campaignDataGroupToFirmiana`,
    method: 'get',
    params
  })

// 雷鸟租赁数据统计
export const CampaignDataGroupToThunderBirdRental = (params: any) =>
  request({
    url: `${baseUrl}/v2/clue/campaign/campaignDataGroupToThunderBirdRental`,
    method: 'get',
    params
  })

// 雷鸟车池数据统计
export const CampaignDataGroupToThunderBirdTruckPool = (params: any) =>
  request({
    url: `${baseUrl}/v2/clue/campaign/campaignDataGroupToThunderBirdTruckPool`,
    method: 'get',
    params
  })

// 编辑campaign数据统计
export const EditCampaignData = (data: any) =>
  request({
    url: `${baseUrl}/v2/clue/campaign/editCampaignData`,
    method: 'post',
    data
  })

// 待分配线索 雷鸟租赁线索列表
export const GetToAllotLNLease = (data: any) =>
  request({
    url: `${produce}/v2/market-clue/getToAllotLNLeaseClueList`,
    data,
    method: 'post'

  })
/**
 *
 * 私海池 雷鸟车池线索详情
 */
export const getClueLCXDetail = (params: any) =>
  request({
    url: `${produce}/v2/market-clue/getClueLCXDetail`,
    method: 'get',
    params
  })

/**
 *
 * 私海池 梧桐线索详情
 */
export const getClueWSXDetail = (params: any) =>
  request({
    url: `${produce}/v2/market-clue/getClueWSXDetail`,
    method: 'get',
    params
  })

/**
 *
 * 私海池 雷鸟租赁线索详情
 */
export const getClueLZXDetail = (params: any) =>
  request({
    url: `${produce}/v2/market-clue/getClueLZXDetail`,
    method: 'get',
    params
  })

/**
 *
 * 私海池 线索详情-操作日志
 */
export const getClueDetailLogs = (data: any) =>
  request({
    url: `${produce}/v2/market-clue/getClueDetailLogs`,
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
  // 私海池线索分配跟进人
export const UpdateFollowerByPrivateSeas = (data: any) =>
  request({
    url: `${produce}/v2/market-clue/updateFollowerByPrivateSeas`,
    method: 'post',
    data
  })
// 私海池线索 梧桐线索列表
export const GetClueWSXPrivateSeaPoolList = (data: any) =>
  request({
    url: `/carrier_center/v2/market-clue/getClueWSShareXPrivateSeaPoolList`,
    method: 'post',
    data
  })
// 私海池线索 雷鸟车池线索列表
export const GetClueLCXPrivateSeaPoolList = (data: any) =>
  request({
    url: `/carrier_center/v2/market-clue/getClueLCXPrivateSeaPoolList`,
    method: 'post',
    data
  })
// 私海池线索 雷鸟租赁线索列表 B
export const GetClueLZXPrivateSeaPoolListB = (data: any) =>
  request({
    url: `${produce}/v2/market-clue/getClueLZBXPrivateSeaPoolList`,
    method: 'post',
    data
  })
// 私海池线索 雷鸟租赁线索列表  C
export const GetClueLZXPrivateSeaPoolListC = (data: any) =>
  request({
    url: `${produce}/v2/market-clue/getClueLZCXPrivateSeaPoolList`,
    method: 'post',
    data
  })
// 私海池 梧桐专车线索导入
export const UploadExcelFirmianaZC = (data: any) =>
  request({
    url: `${produce}/v2/market-clue/privatePool/firmiana/import/private`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
// 私海池 梧桐共享线索导入
export const UploadExcelBirdGX = (data: any) =>
  request({
    url: `${produce}/v2/market-clue/privatePool/firmiana/import/shared`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
// 私海池 雷鸟租赁B线索导入
export const UploadExcelLNB = (data: any) =>
  request({
    url: `${produce}/v2/market-clue/privatePool/thunderBirdRental/import/b`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
  // 私海池 雷鸟租赁C线索导入
export const UploadExcelLNC = (data: any) =>
  request({
    url: `${produce}/v2/market-clue/privatePool/thunderBirdRental/import/c`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
// 私海池导出（梧桐共享/梧桐专车）
export const ExportFirmiana = (data: any) =>
  request({
    // url: `${prefix}/v2/market-clue/privatePool/firmiana/export`,
    url: `${produce}/v2/market-clue/privatePool/export`,
    method: 'post',
    data
  })
  // 私海池 雷鸟车池线索导出
export const ExportBirdTruck = (params: any) =>
  request({
    url: `${produce}/v2/market-clue/privatePool/thunderBirdTruckPool/export`,
    method: 'get',
    params
  })
  // 私海池 雷鸟租赁线索导出
export const ExportBirdRental = (params: any) =>
  request({
    url: `${produce}/v2/market-clue/privatePool/thunderBirdRental/export`,
    method: 'get',
    params
  })
/**
 *
 * 私海池 查询当前手机号存在的线索类型
 */
export const getClueTypeList = (params: any) =>
  request({
    url: `${produce}/v2/market-clue/getClueTypeList`,
    method: 'get',
    params
  })

/**
 *
 * 私海池 线索详情-取消面试
 */
export const cancelInterview = (data: any) =>
  request({
    url: `${produce}/v2/market-clue/cancelInterview`,
    method: 'post',
    params: data
  })

/**
 *
 * 私海池 线索详情-标记爽约
 */
export const clueBreakAnAppointment = (data: any) =>
  request({
    url: `${produce}/v2/market-clue/clueBreakAnAppointment`,
    method: 'post',
    params: data
  })

/**
 *
 * 私海池 发送短信
 */
export const sendMessageApi = (data: any) =>
  request({
    url: `${produce}/v2/market-clue/sendMessage`,
    method: 'post',
    data
  })

/**
 *
 * 线索跟进-专车共享
 */
export const followClueToFirmiana = (data: any) =>
  request({
    url: `${produce}/v2/market-clue/followClueToFirmiana`,
    method: 'post',
    data
  })

/**
 *
 * 线索跟进-雷鸟车池
 */
export const followClueToThunderBirdTruckPool = (data: any) =>
  request({
    url: `${produce}/v2/market-clue/followClueToThunderBirdTruckPool`,
    method: 'post',
    data
  })

/**
 *
 * 线索跟进-雷鸟租赁B/C
 */
export const followClueToThunderBirdRental = (data: any) =>
  request({
    url: `${produce}/v2/market-clue/followClueToThunderBirdRental`,
    method: 'post',
    data
  })

/**
 *
 * 线索基本信息编辑
 */
export const editClue = (data: any) =>
  request({
    url: `${produce}/v2/market-clue/editClue`,
    method: 'post',
    data
  })
  // 通过业务id查询对应的通话日志列表
export const GetListByBusinessId = (data: any) =>
  request({
    url: `${base}/v2/call-log/getListByBusinessId`,
    method: 'post',
    data
  })
// 根据客群id获取客群细分选择项列表
export const GetUserGroupSelectList = (params: any) =>
  request({
    url: `${baseUrl}/v2/market-clue/user-group/getUserGroupSelectList`,
    method: 'get',
    params
  })
// 获取投放平台列表
export const GetLaunchPlatformList = () =>
  request({
    url: `${baseUrl}/v2/clue/campaign/getLaunchPlatformList`,
    method: 'get'
  })

// 获取客群细分列表
export const getClueUserGroupList = (data: any) =>
  request({
    url: `${baseUrl}/v2/market-clue/user-group/getClueUserGroupList`,
    method: 'post',
    data
  })

// 创建客群创建
export const UserGroupCreate = (data: any) =>
  request({
    url: `${baseUrl}/v2/market-clue/user-group/create`,
    method: 'post',
    data
  })

// 客群导出
export const UserGroupExport = (params: any) =>
  request({
    url: `${baseUrl}/v2/market-clue/user-group/userGroup/export`,
    method: 'get',
    params
  })
