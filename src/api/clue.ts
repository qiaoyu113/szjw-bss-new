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
    url: `${prefix}/v2/market-clue/getToAllotLNCarPoolClueList` })
// const prefix = '/base'
let cluefix = '/carrier_center'
// 获取客群细分列表
export const getClueUserGroupList = (params: any) =>
  request({
    url: `${prefix}/v2/market-clue/user-group/getClueUserGroupList`,
    method: 'post',
    params
  })
// 获取随机分配policy列表
export const configurationManagementList = (data: any) =>
  request({
    url: `${cluefix}/v2/market-clue/config/list`,
    method: 'post',
    data
  })
// 设置随机分配policy
export const setrandomPolicy = (data:any) => request({
  url: `${cluefix}/v2/market-clue/config/updatePolicy/notReceiveIds`,
  method: 'post',
  data
})
// 设置回流policy
export const setPolicy = (data:any) => request({
  url: `${cluefix}/v2/market-clue/reflow_conf/settingReflowedConf`,
  method: 'post',
  data
})

// 获取回流policy 列表
export const getBackFlowPolicyList = (data:any) => request({
  url: `${cluefix}/v2/market-clue/reflow_conf/list`,
  method: 'post',
  data
})

const baseUrl = '/mock/81'
// 获取campaign列表
export const GetClueCampaignList = (data: any) =>
  request({
    url: `${baseUrl}/v2/clue/campaign/getClueCampaignList`,
    method: 'post',
    data
  })

// 梧桐专车/共享campaign导出
export const FirmianaExport = (data: any) =>
  request({
    url: `${baseUrl}/v2/clue/campaign/campaign/firmiana/export`,
    method: 'get',
    params: data
  })
// campaign管理 雷鸟租赁campaign导出
export const ThunderBirdRentalExport = (data: any) =>
  request({
    url: `${baseUrl}/v2/clue/campaign/campaign/thunderBirdRental/export`,
    method: 'get',
    params: data
  })
// campaign管理 雷鸟车池campaign导出
export const ThunderBirdTruckPoolExport = (data: any) =>
  request({
    url: `${baseUrl}/v2/clue/campaign/campaign/thunderBirdTruckPool/export`,
    method: 'get',
    params: data
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
    url: `${prefix}/v2/market-clue/getToAllotLNLeaseClueList`,
    data,
    method: 'post'

  })
/**
 *
 * 私海池 雷鸟车池线索详情
 */
export const getClueLCXDetail = (params: any) =>
  request({
    url: `${baseUrl}/v2/market-clue/getClueLCXDetail`,
    method: 'get',
    params
  })

/**
 *
 * 私海池 梧桐线索详情
 */
export const getClueWSXDetail = (params: any) =>
  request({
    url: `${baseUrl}/v2/market-clue/getClueWSXDetail`,
    method: 'get',
    params
  })

/**
 *
 * 私海池 雷鸟租赁线索详情
 */
export const getClueLZXDetail = (params: any) =>
  request({
    url: `${baseUrl}/v2/market-clue/getClueLZXDetail`,
    method: 'get',
    params
  })

/**
 *
 * 私海池 线索详情-操作日志
 */
export const getClueDetailLogs = (data: any) =>
  request({
    url: `${baseUrl}/v2/market-clue/getClueDetailLogs`,
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
    // url: `${prefix}/v2/market-clue/getClueWSXPrivateSeaPoolList`,
    url: `/carrier_center/v2/market-clue/getClueWSXPrivateSeaPoolList`,

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
    params })
/**
 *
 * 私海池 查询当前手机号存在的线索类型
 */
export const getClueTypeList = (params: any) =>
  request({
    url: `${baseUrl}/v2/market-clue/getClueTypeList`,
    method: 'get',
    params
  })

/**
 *
 * 私海池 线索详情-取消面试
 */
export const cancelInterview = (data: any) =>
  request({
    url: `${baseUrl}/v2/market-clue/cancelInterview`,
    method: 'post',
    data
  })

/**
 *
 * 私海池 线索详情-标记爽约
 */
export const clueBreakAnAppointment = (data: any) =>
  request({
    url: `${baseUrl}/v2/market-clue/clueBreakAnAppointment`,
    method: 'post',
    data
  })

/**
 *
 * 私海池 发送短信
 */
export const sendMessageApi = (data: any) =>
  request({
    url: `${baseUrl}/v2/market-clue/sendMessage`,
    method: 'post',
    data
  })

/**
 *
 * 线索跟进-专车共享
 */
export const followClueToFirmiana = (data: any) =>
  request({
    url: `${baseUrl}/v2/market-clue/followClueToFirmiana`,
    method: 'post',
    data
  })

/**
 *
 * 线索跟进-雷鸟车池
 */
export const followClueToThunderBirdTruckPool = (data: any) =>
  request({
    url: `${baseUrl}/v2/market-clue/followClueToThunderBirdTruckPool`,
    method: 'post',
    data
  })

/**
 *
 * 线索跟进-雷鸟租赁B/C
 */
export const followClueToThunderBirdRental = (data: any) =>
  request({
    url: `${baseUrl}/v2/market-clue/followClueToThunderBirdRental`,
    method: 'post',
    data
  })

/**
 *
 * 线索基本信息编辑
 */
export const editClue = (data: any) =>
  request({
    url: `${baseUrl}/v2/market-clue/editClue`,
    method: 'post',
    data
  })
  // 通过业务id查询对应的通话日志列表
export const GetListByBusinessId = (data: any) =>
  request({
    url: `${baseUrl}/v2/call-log/getListByBusinessId`,
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
