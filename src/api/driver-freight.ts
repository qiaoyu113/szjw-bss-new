import request from '@/utils/request'
// 司机运费账户

let prefix = '/waybill_center'

/**
 * 获取司机运费流水列表
 * 请求参数：
 * page | 页码
 * limit | 条数
 * driverName | 司机姓名
 * businessType | 业务线
 * gmId | 加盟经理
 * paymentReceivedFlag | 是否已收款
 * recordNo | 流水编号
 * businessNo | 出车单编号
 * driverCity | 司机城市
 * subject | 变动类型
 * monthBillDate | 关键字
 * departureDateStart | 出车日期开始时间
 * departureDateEnd | 出车日期结束时间
 * createDateStart | 创建时间开始时间
 * createDateEnd | 创建时间结束时间
 */
export const GetFreightChargeList = (data: any) =>
  request({
    url: `${prefix}/v2/driverBilling/freightCharge/list`,
    method: 'post',
    data
  })
/**
 * 司机运费流水导出
 * 请求参数：
 * driverName | 司机姓名
 * businessType | 业务线
 * gmId | 加盟经理
 * paymentReceivedFlag | 是否已收款
 * recordNo | 流水编号
 * businessNo | 出车单编号
 * driverCity | 司机城市
 * subject | 变动类型
 * monthBillDate | 关键字
 * departureDateStart | 出车日期开始时间
 * departureDateEnd | 出车日期结束时间
 * createDateStart | 创建时间开始时间
 * createDateEnd | 创建时间结束时间
 */
export const ExportFreightChargeList = (data: any) =>
  request({
    url: `${prefix}/v2/driverBilling/freightCharge/export`,
    method: 'post',
    data
  })

/**
 * 司机运费流水-标记收款
 * 请求参数：
 * fileUrl | 上传凭证
 * ids | id集合
 * remark | 备注
 */
export const ReceiveFreightChargeList = (data: any) =>
  request({
    url: `${prefix}/v2/driverBilling/freightCharge/receive`,
    method: 'post',
    data
  })
// 获取司机运费月账单列表
export const GetMonthlyBillList = (data: any) =>
  request({
    url: `${prefix}/v2/driverBilling/monthlyBill/list`,
    method: 'post',
    data
  })

// 司机运费月账单导出
export const ExportMonthlyBillList = (data: any) =>
  request({
    url: `${prefix}/v2/driverBilling/monthlyBill/export`,
    method: 'post',
    data
  })

// 司机对账月账单保存
export const driverMonthlyBillCheck = (data: any) =>
  request({
    url: `${prefix}/v2/driverBilling/monthlyBill/check`,
    method: 'post',
    data
  })

// 司机运费调整列表
export const GetShippingChangeList = (data: any) =>
  request({
    url: `${prefix}/v2/driverBilling/shippingChange/list`,
    method: 'post',
    data
  })
  // 司机运费调整列表导出
export const GetShippingChangeExport = (data: any) =>
  request({
    url: `${prefix}/v2/driverBilling/shippingChange/export`,
    method: 'post',
    data
  })

// 司机运费调整-新增
export const SaveShippingChange = (data: any) =>
  request({
    url: `${prefix}/v2/driverBilling/shippingChange/save`,
    method: 'post',
    data
  })

/**
 * 获取司机运费调整原因列表
 * 请求参数：无
 */
export const GetSubjectList = (params?:any) =>
  request({
    url: `${prefix}/v2/driverBilling/subject`,
    method: 'get',
    params
  })

// 获取已终止的司机列表
export const GetOrderDriverList = (data?:any) =>
  request({
    // url: `/carrier_center/v2/driver/getDriverNameAndPhoneList`,
    url: `/carrier_center/v2/driver/getDriverListByRoute`,
    method: 'post',
    data
  })
