import request from '@/utils/request'

const payFix = '/mock/112'
const prefix = '/bill'
const driverFix = '/business_center'
const billFix = '/bill_center'
const wayBillFix = '/waybill'
let prefix2 = '/mock/25'

/**
 * 给司机打标签-查询接口
 */
export const searchMatchDriverInfo = (driverId: any) =>
  request({
    url: `${prefix}/v1/matchDriverLabel/getMatchDriverLabel/${driverId}`,
    method: 'get'
  })
  /**
 * 给司机打标签-保存接口
 */
export const updateDriverTag = (data:any) =>
  request({
    url: `${prefix}/v3/updateDriverTag`,
    method: 'put',
    data
  })
