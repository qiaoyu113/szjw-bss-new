import request from '@/utils/request'
let prefix = '/carrier_center'
const carrierPrefix = '/carrier_center'
const businessPrefix = '/order'

/**
 * 获取自承运司机标签列表 || 导出自承运司机标签列表（无页码，每页条数）
 * @param  {number} data.page 页码
 * @param  {number} data.limit 每页条数
 * @param  {number} data.busiType 业务线
 * @param  {string} data.driverId 司机ID
 * @param  {number} data.startDate 创建开始时间
 * @param  {number} data.endDate 创建结束时间
 * @param  {number} data.key 模糊查询Key
 * @param  {string} data.otherDriverId A端司机ID
 * @param  {number} data.status 司机状态
 * @param  {string} data.workCity 工作城市
 */
export const GetDriverTagList = (data: any) =>
  request({
    url: `${carrierPrefix}/v2/driver/label-sync/list`,
    method: 'post',
    data
  })

/**
 * 导出自承运司机标签列表
 * 见上自承运司机标签列表
 */
export const ExportDriverTagList = (data: any) =>
  request({
    url: `${carrierPrefix}/v2/driver/label-sync/export`,
    method: 'post',
    data
  })

/**
 * 承运司机标签新增
 * @param  {string} data.driverId 司机ID
 * @param  {string} data.otherDriverId A端司机ID
 */
export const AddDriverTag = (data: any) =>
  request({
    url: `${carrierPrefix}/v2/driver/label-sync/create`,
    method: 'post',
    data
  })

/**
 * 承运司机标签修改
 * @param  {string} data.driverId 司机ID
 * @param  {string} data.otherDriverId A端司机ID
 */
export const EditDriverTag = (data: any) =>
  request({
    url: `${carrierPrefix}/v2/driver/label-sync/update`,
    method: 'post',
    data
  })

/**
 * 根据司机姓名获取司机信息
 * @param  {number} data.page 页码
 * @param  {number} data.limit 每页条数
 * @param  {number} data.key 模糊查询Key
 */
export const GetDriverByDriverName = (data: any) =>
  request({
    url: `${carrierPrefix}/v2/driver/getDriverNoAndNameAndBusiTypeListFromESAndRedis`,
    method: 'post',
    data
  })

/**
 * 获取司机线索列表
 * 请求参数：
 * page | 页码
 * limit | 条数
 * haveCar | 是否有车
 * onlyMe | 只看自己
 * name | 司机姓名
 * phone | 手机号
 * workCity | 城市
 * carTypes | 车型
 * contactSituations | 联系情况
 * followerId | 跟进人
 * busiType | 业务线
 * status | 状态
 * startDate 分配日期开始时间
 * endDate | 分配日期开始时间
 */
export const GetDriverClueList = (data: any) =>
  request({
    url: `${prefix}/v2/clueH5/list`,
    method: 'post',
    data
  })
/**
 * 导出司机线索
 * 请求参数：
 * haveCar | 是否有车
 * onlyMe | 只看自己
 * name | 司机姓名
 * phone | 手机号
 * workCity | 城市
 * carTypes | 车型
 * contactSituations | 联系情况
 * followerId | 跟进人
 * busiType | 业务线
 * status | 状态
 * startDate 分配日期开始时间
 * endDate | 分配日期开始时间
 */
export const ExportDriverClue = (data: any) =>
  request({
    url: `${prefix}/v2/clueH5/export`,
    method: 'post',
    data
  })

/**
 * 获取司机线索详情
 * 请求参数：
 * marketClueId | 司机线索id
 */
export const GetDriverClueDetail = (params: any) =>
  request({
    url: `${prefix}/v2/clueH5/detail`,
    method: 'get',
    params
  })

/**
 * 司机线索详情添加跟进
 * 请求参数：
 * marketClueId | 司机线索id
 * remark | 备注
 * contactSituation | 联系情况
 */
export const AddContactInfo = (data: any) =>
  request({
    url: `${prefix}/v2/clueH5/addFollow`,
    method: 'post',
    data
  })

/**
 * 司机线索详情取消面试
 * 请求参数：
 * marketClueId | 司机线索id
 * remark | 备注
 */
export const CancelInteview = (data: any) =>
  request({
    url: `${prefix}/v2/clueH5/abolishInterview`,
    method: 'post',
    data
  })

/**
 * 邀请面试
 * 请求参数：
 * marketClueId | 司机线索id
 * interviewDate | 面试日期
 */
export const InvitelInteview = (data: any) =>
  request({
    url: `${prefix}/v2/clueH5/inviteInterview`,
    method: 'post',
    data
  })

/**
 * 司机线索详情调整面试
 * 请求参数：
 * marketClueId | 司机线索id
 * interviewDate | 面试日期
 */
export const AdjustmentlInteview = (data: any) =>
  request({
    url: `${prefix}/v2/clueH5/updateInterviewTime`,
    method: 'post',
    data
  })

/**
 * 司机线索详情日志列表
 * 请求参数：
 * marketClueId | 司机线索id
 * page | 页码
 * limit | 每页条数
 */
export const GetDriverClueLogList = (data: any) =>
  request({
    url: `${prefix}/v2/clueH5/log`,
    method: 'post',
    data
  })

/**
 * 带分配线索列表
 * @param  {number} data.page 页码
 * @param  {number} data.limit 每页条数
 * @param  {number} data.busiType 业务线
 * @param  {number} data.startDate 创建开始时间
 * @param  {number} data.endDate 创建结束时间
 * @param  {string} data.phone 手机号
 * @param  {number} data.haveCar 是否有车 有1 无0
 * @param  {string} data.workCity 工作城市
 */
export const marketClue = (data: any) =>
  request({
    url: `${carrierPrefix}/v2/clueH5/waitAllocate/list`,
    method: 'post',
    data
  })

/**
 * 分配带市场分配线索
 * @param  {number} data.followerId 跟进人Id
 * @param  {string[]} data.getMarketIds 市场线索ID
 */
export const allocationClue = (data: any) =>
  request({
    url: `${carrierPrefix}/v2/clueH5/updateFollowerByMarketClueIdForFail`,
    method: 'post',
    data
  })

/**
 * 线索分配
 * @param  {number} data.followerId 跟进人Id
 * @param  {string[]} data.getMarketIds 市场线索ID
 */
export const allocationClue1 = (data: any) =>
  request({
    url: `${prefix}/v2/clueH5/updateFollowerByMarketClueIdForSuccess`,
    method: 'post',
    data
  })

/**
 * 编辑司机线索
 * 请求参数：
 * marketClueId | 期望工作城市
 * name | 姓名
 * phone | 手机号
 * haveCar | 是否有车
 * carType | 车型
 * experience | 货运经验
 * age | 年龄
 * nowProfession | 当前职业
 * nowAddress | 现住址
 * expectAddressCity | 期望工作城市
 * expectAddressCounty | 期望工作县/区
 */
export const editClue = (data: any) =>
  request({
    url: `${prefix}/v2/clueH5/edit`,
    method: 'post',
    data
  })

/**
 * 根据司机ID查询已成交订单
 * @param  {string[]}  订单ID数组
 */
export const getDealOrdersByDriverIds = (data: any) =>
  request({
    url: `${businessPrefix}/v2/order/getDealOrdersByDriverIds`,
    method: 'post',
    data
  })
