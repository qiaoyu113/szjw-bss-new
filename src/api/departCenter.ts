import request from '@/utils/request'
const base = '/base_center'
const departCenter = `match`
const prefix = `/mock/283`
const prefix1 = `/match`

const departfix = 'match_center'
const lineCenter = 'line_center'

// 创建试跑意向
export const CreateLntentionRun = (data: any) =>
  request({
    url: `/match/v2/runtest/creatIntentionRun`,
    method: 'post',
    data
  })

// 发起客邀
export const CreateLaunchGuests = (data: any) =>
  request({
    // url: `mock/283/v1/matchCustInvite/startMatchCustInvite`,
    url: `${departCenter}/v1/matchCustInvite/startMatchCustInvite`,
    method: 'post',
    data
  })
  // 取消客邀
export const cancelMatchCustInvite = (data: any) =>
  request({
    // url: `mock/283/v1/matchCustInvite/cancelMatchCustInvite`,
    url: `${departCenter}/v1/matchCustInvite/cancelMatchCustInvite`,
    method: 'post',
    data
  })
  // 批量发起客邀
export const CreateLaunchGuestsBatch = (data: any) =>
  request({
    url: `${departCenter}/v1/matchCustInvite/startMatchCustInviteBatch`,
    method: 'post',
    data
  })
// 批量取消客邀
export const cancelMatchCustInviteBatch = (data: any) =>
  request({
    url: `${departCenter}/v1/matchCustInvite/cancelMatchCustInviteBatch`,
    method: 'post',
    data
  })
  // 客邀城市列表
export const GetcustInviteCitys = () =>
  request({
    url: `${departCenter}/v1/matchCustInvite/custInviteCitys`,
    method: 'post'
  })
  // 发起客邀城市
export const GetstartCustInviteCity = () =>
  request({
    url: `${departCenter}/v1/matchCustInvite/startCustInviteCity`,
    method: 'post'
  })
// 获取客邀列表
export function getInvitedLines(data:any) {
  return request({
    url: `/match_center/v1/matchLineInfo/queryInvitedLines`,
    method: 'post',
    data
  })
}
// 查询线路列表表单信息
export const getLineInfo = (data:any) =>
  request({
    url: `${departfix}/v1/matchLineInfo/search`,
    method: 'post',
    data
  })
// 获取线路suggest列表
export function getLineSearch(data:any) {
  return request({
    url: `/line_center/v2/line/lineInfo/matchFuzzyCheck`,
    method: 'post',
    data
  })
}
// 获取线路详情
export function getLineDetailInfo(params:any) {
  return request({
    url: `/line_center/v2/line/lineInfo/detail`,
    method: 'get',
    params
  })
}
// 获取客邀列表线路详情
export function getLineDetail(params:any) {
  return request({
    url: `/line/v1/customer/invitation/line/detail`,
    method: 'get',
    params
  })
}
// 司推：司机匹配线路
export function MatchLineListForDriver(data: any) {
  return request({
    url: `${departfix}/v1/matchDriverInfo/queryMatchLineForMatchDriver`,
    method: 'post',
    data
  })
}

// 司推：线路ID/名称列表
export function getLineListForSearch(data: any) {
  return request({
    url: `${lineCenter}/v2/line/lineInfo/matchFuzzyCheck`,
    method: 'post',
    data
  })
}

// 通过线路id和当前城市获取备注
export function getLineRemarks(data:any) {
  return request({
    url: `/match/v1/matchCustInvite/queryRemarks`,
    method: 'post',
    data
  })
}

// 取消试跑意向
export function cancelIntention(data:any) {
  return request({
    url: `/waybill/v2/runtest/intention/cancel`,
    method: 'post',
    data
  })
}

// 客邀撮合【抽屉】-展开司机详情

export function unfoldDriverInfo(params:any) {
  return request({
    url: `${prefix}/v1/customerInviteDrawer/driverInfo/${params}`,
    method: 'get'
  })
}

// 获取弹框司机详情-外呼记录
export function getCallDetail(data:any) {
  return request({
    url: `${prefix1}/v1/outboundCall/getListByBusinessId`,
    method: 'post',
    data
  })
}
// 获取弹框司机详情-试跑信息
export function getRunDetail(data:any) {
  return request({
    url: `/waybill/v2/runtest/getRunTestInfoByDriverId`,
    method: 'post',
    data
  })
}
// 获取弹框司机详情-司机标签
export function getDriverDetail(params:any) {
  return request({
    url: `${prefix1}/v1/matchDriverLabelInfo/getDriverLabelByDriverId`,
    method: 'get',
    params
  })
}
// 获取弹框司机详情-基础信息
export function getBasicDetail(params:any) {
  return request({
    url: `${prefix1}/v1/matchDriverInfo/getDriverMatchByDriverId`,
    method: 'get',
    params
  })
}

// 司推【抽屉】-展开司机详情

export function getDriverInfoByDriverId(params:any) {
  return request({
    url: `${departCenter}/v1/matchDriverInfo/getDriverInfoByDriverId`,
    method: 'get',
    params
  })
}

// 获取司推列表
export function matchDriverInfo(data:any) {
  return request({
    url: `${departfix}/v1/matchDriverInfo/list`,
    method: 'post',
    data
  })
}

// 获取司机变更城市
export function getDriverWorkCity(data:any) {
  return request({
    url: `${prefix}/v2/driver/getDriverWorkCity`,
    method: 'post',
    data
  })
}

// 更改工作城市
export function updateDriverWorkCityByDriverId(data:any) {
  return request({
    url: `${prefix}/v2/driver/updateDriverWorkCityByDriverId`,
    method: 'post',
    data
  })
}

// 批量修改司撮
export function updateDriverDmBatch(data:any) {
  return request({
    url: `driver/v2/driver/updateDriverDmBatch`,
    method: 'post',
    data
  })
}
/**
 * 给司机打标签-查询接口
 */
export const searchMatchDriverInfo = (driverId: any) =>
  request({
    url: `${departfix}/v1/matchDriverLabel/getMatchDriverLabel/${driverId}`,
    method: 'get'
  })
/**
* 给司机打标签-保存接口
*/
export const updateDriverTag = (data:any) =>
  request({
    url: `${departfix}/v1/matchDriverLabel/updateMatchDriverLabel`,
    method: 'post',
    data
  })
/**
* 司机匹配线路查询接口
*/
export const queryMatchDriverForMatchLine = (data: any) =>
  request({
    url: `${departfix}/v1/customerInviteDrawer/queryMatchDriver`,
    method: 'post',
    data
  })
