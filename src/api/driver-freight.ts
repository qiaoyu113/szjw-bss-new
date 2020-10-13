import request from '@/utils/request'
// 司机运费账户

let prefix = '/mock/112'
// let prefix = '/waybill_center'

// 获取司机运费流水列表
export const GetFreightChargeList = (data: any) =>
  request({
    url: `${prefix}/v2/driverBilling/freightCharge/list`,
    method: 'post',
    data
  })
  // 司机运费流水导出
export const ExportFreightChargeList = (data: any) =>
  request({
    url: `${prefix}/v2/driverBilling/freightCharge/export`,
    method: 'post',
    data
  })

// 司机运费流水-标记收款
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

// 获取司机运费调整原因列表
export const GetSubjectList = () =>
  request({
    url: `${prefix}/v2/driverBilling/subject`,
    method: 'get'
  })
