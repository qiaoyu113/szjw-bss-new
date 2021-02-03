import request from '@/utils/request'

const payFix = '/mock/112'
const prefix = '/bill'
const driverFix = '/business_center'
const billFix = '/bill_center'
const wayBillFix = '/waybill'
let prefix2 = '/mock/25'
/**
 * XXXX
 */
export const CreateActivity = (data: any) =>
  request({
    url: `${prefix}/v1/driver/clue/create/manually`,
    method: 'post',
    data
  })
/*
  获取梧桐账户列表
  请求参数：
  workCity：所属城市
  driverId：司机Id
  busiType：所属业务线
  joinManagerId：所属加盟经理
  balance：账户余额
  time：司机创建日期
*/
export const getAcountList = (data: any) =>
  request({
    url: `${billFix}/v2/wt-driver-account/management/list`,
    method: 'post',
    data
  })

/*
  梧桐账户列表冻结
*/
export const accountFreeze = (data: any) =>
  request({
    url: `${prefix}/v2/wt-driver-account/management/freeze`,
    method: 'post',
    data
  })
/*
  梧桐账户列表冻结
*/
export const accountUnfreeze = (data: any) =>
  request({
    url: `${prefix}/v2/wt-driver-account/management/unfreeze`,
    method: 'post',
    data
  })
/*
  梧桐账户列表导出
  请求参数：
  workCity：所属城市
  driverId：司机Id
  busiType：所属业务线
  joinManagerId：所属加盟经理
  balance：账户余额
  time：司机创建日期
*/
export const managementExport = (data: any) =>
  request({
    url: `${billFix}/v2/wt-driver-account/management/export`,
    method: 'post',
    data
  })

/**
 * 订单列表
 */
export const orderList = (data: any) => {
  return request({
    url: `${driverFix}/v2/order/getOrderListByDriverId`,
    method: 'get',
    params: data
  })
}

/**
 * 订单详情
 */
export const orderDetail = (data: any) => {
  return request({
    url: `${driverFix}/v2/order/getOrderDetialByDriverId`,
    method: 'get',
    params: data
  })
}

/**
 * 获取订单冻结金额
 */
export const orderMoney = (data: any) => {
  return request({
    url: `${prefix}/v2/wt-driver-account/management/order-freezing-money/orderid`,
    method: 'get',
    params: data
  })
}

/**
 * 获取订单冻结金额
 */
export const orderCanExtractMoney = (data: any) => {
  return request({
    url: `${prefix}/v2/wt-driver-account/management/getCanExtractByUserId`,
    method: 'post',
    params: data
  })
}
/**
 * 订单是否确认
 */
export const countConfirmByDriver = (data: any) => {
  return request({
    url: `${wayBillFix}/v2/waybill/shipping/getWayBillStatusByOrderId`,
    method: 'get',
    params: data
  })
}

/**
 * 获取财务流水列表
 * @param  {number} data.busiType 业务线
 * @param  {string} data.city 工作城市
 * @param  {string} data.driverCode 司机编号
 * @param  {number} data.gmId 加盟经理Id
 * @param  {number} data.limit 每页条数
 * @param  {number} data.page 页码
 * @param  {number} data.startDate 开始时间
 * @param  {number} data.endDate 结束时间
 */
export const getFlowList = (data: any) =>
  request({
    url: `/bill_center/v2/wt-driver-account/flow/list`,
    method: 'post',
    data
  })

/**
 * 导出财务流水
 * @param  {number} data.busiType 业务线
 * @param  {string} data.city 工作城市
 * @param  {string} data.driverCode 司机编号
 * @param  {number} data.gmId 加盟经理Id
 * @param  {number} data.startDate 开始时间
 * @param  {number} data.endDate 结束时间
 */
export const exportFlowList = (data: any) =>
  request({
    url: `/bill_center/v2/wt-driver-account/flow/export`,
    method: 'post',
    data
  })

/**
 * 手动添加流水
 * @param  {number} data.driverName 司机姓名
 * @param  {string} data.orderCode 订单ID
 * @param  {string} data.driverCode 司机编号
 * @param  {number} data.orderStatus 订单状态
 * @param  {number} data.billingId 账户ID
 * @param  {number} data.amount 金额
 * @param  {number} data.reason 原因
 */
export const saveFlowData = (data: any) =>
  request({
    url: `/bill/v2/wt-driver-account/flow/manual/create`,
    method: 'post',
    data
  })

/**
 * 根据司机id获取已终止订单列表
 * @param  {string} data.driverId 司机ID
 * @param  {string} data.operateFlag 操作标识
 */
export const getOrderListByDriverId = (params: any) =>
  request({
    url: `/order/v2/order/getOnlyOrderListByDriverId`,
    method: 'get',
    params
  })

/**
 * 根据司机id订单id获取订单详情
 * @param  {string} data.driverId 司机ID
 * @param  {string} data.operateFlag 操作标识
 * @param  {string} data.orderId 订单ID
 */
export const getOrderDetailByDriverId = (params: any) =>
  request({
    url: `/order/v2/order/getOrderOnlyDetialByDriverId`,
    method: 'get',
    params
  })

// 通过加盟经理id获取司机列表
export const getDriverListByGmId = (params: any) =>
  request({
    url: `/driver/v2/driver/getDriverListByGmId`,
    method: 'get',
    params
  })

/**
 * 获取计费类型列表
 * @param  {number} data.busiType 业务线
 */
export const getListAll = (params:any) =>
  request({
    url: `/bill/v2/wt-driver-account/billing/getChargeByBusiType`,
    method: 'get',
    params
  })

/**
 * 获取计费金额
 * @param  {number} data.chargeId 账户ID
 * @param  {number} data.orderId 订单ID
 */
export const GetChargeAmountByChargeId = (params:any) =>
  request({
    url: `${prefix}/v2/wt-driver-account/billing/getChargeAmountByChargeId`,
    method: 'get',
    params
  })
/*
  缴费管理列表
  请求参数:
  payStatus：缴费状态
  workCity：所属城市
  driverId：司机Id
  payType：缴费类型
  payNo：缴费编号
  gmId：加盟经理
  sno：交易流水号
  busiType：业务线
  driverStatus：司机状态
  applyDate：缴费申请日期
*/
export const getPayList = (params: any) =>
  request({
    url: `${billFix}/v2.4/wt-driver-account/pay/list`,
    method: 'get',
    params
  })

// 缴费详情
export const payDetail = (params: any) =>
  request({
    url: `${billFix}/v2.4/wt-driver-account/pay/getPayCostInfoById`,
    method: 'get',
    params
  })

/*
  缴费审核
  checkStatus：审核状态
*/
export const payAudit = (data: any) =>
  request({
    url: `${billFix}/v2.4/wt-driver-account/pay/check`,
    method: 'post',
    data
  })
/*
  缴费导出
  请求参数:
  payStatus：缴费状态
  workCity：所属城市
  driverId：司机Id
  payType：缴费类型
  payNo：缴费编号
  gmId：加盟经理
  sno：交易流水号
  busiType：业务线
  driverStatus：司机状态
  applyDate：缴费申请日期
*/
export const payExport = (params: any) =>
  request({
    url: `${billFix}/v2.4/wt-driver-account/pay/export`,
    method: 'get',
    params
  })
  // 缴费管理 交易流水号
export const getSnoList = (params: any) =>
  request({
    url: `${billFix}/v2.4/wt-driver-account/pay/tradeNoList`,
    method: 'get',
    params
  })
  // 缴费编号
export const getPayNoList = (params: any) =>
  request({
    url: `${billFix}/v2.4/wt-driver-account/pay/payNoList`,
    method: 'get',
    params
  })
/*
  缴费管理-新增缴费
  请求参数：
  driverCode：司机姓名(司机编号/手机号)
  existReceipt：是否开收据
  orderCode：订单编号
  payAmount：缴费金额（元）
  payDate：打款日期
  payModel：支付方式
  payProof：上传交易凭证
  payType：缴费类型
  sno：交易流水号
*/
export const payCostBillsCreate = (data:any) =>
  request({
    url: `${billFix}/v2.4/wt-driver-account/pay/payCostBills/create`,
    method: 'post',
    data
  })

/*
  缴费管理-新增编辑缴费
  id：id
  existReceipt：是否开收据
  orderCode：订单编号
  payAmount：缴费金额（元）
  payDate：打款日期
  payModel：支付方式
  payProof：上传交易凭证
  payType：缴费类型
  sno：交易流水号
*/
export const payCostBillsUpdate = (data:any) =>
  request({
    url: `${billFix}/v2.4/wt-driver-account/pay/payCostBills/update`,
    method: 'post',
    data
  })
  // 获取计费管理列表
export const GetChargingList = (params:any) =>
  request({
    url: `${payFix}/getChargingList`,
    method: 'get',
    params
  })

// 获取计费管理详情
export const GetChargingDetail = (params:any) =>
  request({
    url: `${payFix}/getChargingDetail`,
    method: 'get',
    params
  })
// 计费管理修改状态
export const ChangeChargingStatus = (data:any) =>
  request({
    url: `${payFix}/changeChargingStatus`,
    method: 'post',
    data
  })

// 计费管理操作日志
export const GetChargingLog = (params:any) =>
  request({
    url: `${payFix}/getChargingLog`,
    method: 'get',
    params
  })
  // 计费管理-新建
export const AddCharging = (data:any) =>
  request({
    url: `${payFix}/addCharging`,
    method: 'post',
    data
  })

// 计费管理-调整
export const EditCharging = (data:any) =>
  request({
    url: `${payFix}/editCharging`,
    method: 'post',
    data
  })

// 根据司机编号查询梧桐账户详情
export const detailByUserId = (params:any) =>
  request({
    url: `${prefix}/v2/wt-driver-account/management/detailByUserId`,
    method: 'get',
    params
  })
