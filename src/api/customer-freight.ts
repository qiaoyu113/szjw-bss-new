import request from '@/utils/request'
// 客户运费账户
let prefix = '/waybill_center'

/**
 * 客户运费流水列表
 * 请求参数：
 * page | 页码
 * limit | 每页条数
 * customerName | 客户名称
 * customerId | 客户编号
 * customerProperty | 客户属性
 * recordNo | 流水编号
 * subject | 变动类型
 * driverName | 司机姓名
 * projectName | 项目名称
 * projectId | 项目id
 * businessNo | 出车单编号
 * paymentReceivedFlag | 是否已付款
 * departureDateStart | 出车日期开始时间
 * departureDateEnd | 出车日期结束时间
 * createDateStart | 创建时间开始时间
 * createDateEnd | 创建时间结束时间
 */
export const GetFreightChargeList = (data: any) =>
  request({
    url: `${prefix}/v2/waybill/custBilling/freightCharge/list`,
    method: 'post',
    data
  })

/**
 * 客户运费流水列表导出
 * 请求参数：
 * customerName | 客户名称
 * customerId | 客户编号
 * customerProperty | 客户属性
 * recordNo | 流水编号
 * subject | 变动类型
 * driverName | 司机姓名
 * projectName | 项目名称
 * projectId | 项目id
 * businessNo | 出车单编号
 * paymentReceivedFlag | 是否已付款
 * departureDateStart | 出车日期开始时间
 * departureDateEnd | 出车日期结束时间
 * createDateStart | 创建时间开始时间
 * createDateEnd | 创建时间结束时间
 */
export const ExportFreightChargeList = (data: any) =>
  request({
    url: `${prefix}/v2/waybill/custBilling/freightCharge/export`,
    method: 'post',
    data
  })

/**
 * 客户运费流水-标记付款
 * 请求参数：
 * fileUrl | 上传凭证
 * ids | id结合
 * remark | 备注
 */
export const BjfreightChargeReceive = (data: any) =>
  request({
    url: `${prefix}/v2/waybill/custBilling/freightCharge/receive`,
    method: 'post',
    data
  })

/**
 * 获取客户月账单
 * 请求参数：
 * page | 页码
 * limit | 每页条数
 * monthBillId | 月账单编号
 * customerName | 客户名称
 * customerId | 客户编号
 * customerCity | 客户城市
 * dutyManagerId | 上岗经理
 * lineSaleId | 外线销售
 * closeStatus | 是否封账
 * projectId | 项目名称
 * checkStatus | 对账状态
 * monthBillDateStart | 账单月份开始时间
 * monthBillDateEnd | 账单月份结束时间
 */
export const GetMonthlyBillList = (data: any) =>
  request({
    url: `${prefix}/v2/waybill/custBilling/monthlyBill/list`,
    method: 'post',
    data
  })

/**
 * 客户运费月账单导出
 * 请求参数：
 * monthBillId | 月账单编号
 * customerName | 客户名称
 * customerId | 客户编号
 * customerCity | 客户城市
 * dutyManagerId | 上岗经理
 * lineSaleId | 外线销售
 * closeStatus | 是否封账
 * projectId | 项目名称
 * checkStatus | 对账状态
 * monthBillDateStart | 账单月份开始时间
 * monthBillDateEnd | 账单月份结束时间
 */
export const ExportMonthlyBill = (data: any) =>
  request({
    url: `${prefix}/v2/waybill/custBilling/monthlyBill/export`,
    method: 'post',
    data
  })

/**
 * 客户运费月账单--客户确认
 * 请求参数：
 * fileUrl | 上传凭证
 * ids | id集合
 */
export const CustomerMonthlyBillCheck = (data: any) =>
  request({
    url: `${prefix}/v2/waybill/custBilling/monthlyBill/check`,
    method: 'post',
    data
  })

/**
 * 获取项目列表
 * 请求参数：
 * page | 页码
 * limit | 条数
 * key | 关键字
 */
export const GetProjectSearch = (data: any) =>
  request({
    url: `/line_center/v2/line/project/fuzzy/check1`,
    method: 'post',
    data
  })
