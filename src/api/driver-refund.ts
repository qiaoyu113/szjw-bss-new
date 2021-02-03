import request from '@/utils/request'
let prefix2 = '/mock/25'
let prefix = '/bill'
const billFix = '/bill_center'
/*
  退费管理列表
  请求参数：
  workCity：所属城市
  busiType：业务线
  joinManagerId：所属加盟经理
  refundApplyId：退费编号
  driverId：司机姓名编号
  startDate：开始时间
  endDate：结束时间
  status：退费状态
*/
export const refundList = (data: any) =>
  request({
    url: `${billFix}/v2/wt-driver-account/refund/list`,
    method: 'post',
    data
  })
/*
  退费管理详情
  请求参数：
  refundApplyId：退费编号
*/
export const refundDetail = (params: any) =>
  request({
    url: `${prefix}/v2/wt-driver-account/refund/getRefundDetail`,
    method: 'get',
    params
  })
/*
  退费管理审核
  请求参数：
  refundApplyId：退费编号
*/
export const refundAudit = (data: any) =>
  request({
    url: `${prefix}/v2/wt-driver-account/refund/approve`,
    method: 'post',
    data
  })
/*
  退费管理导出
  请求参数：
  workCity：所属城市
  busiType：业务线
  joinManagerId：所属加盟经理
  refundApplyId：退费编号
  driverId：司机姓名编号
  startDate：开始时间
  endDate：结束时间
  status：退费状态
*/
export const refundExport = (data: any) =>
  request({
    url: `${billFix}/v2/wt-driver-account/refund/export`,
    method: 'post',
    data
  })
/*
  下载
  applyRefundId：退费编号
*/
export const refundDownLod = (params: any) =>
  request({
    url: `${billFix}/v2/wt-driver-account/refund/downTemplate`,
    method: 'get',
    params
  })

/*
  退费
  applyRefundId：退费编号
*/
export const refundExecute = (params: any) =>
  request({
    url: `${prefix}/v2/wt-driver-account/refund/execute`,
    method: 'get',
    params
  })
// 批量退费
export const batchRefundExecute = (data: any) =>
  request({
    url: `${prefix}/v2/wt-driver-account/refund/batch/execute`,
    method: 'post',
    data
  })
// 驳回   批量驳回
export const refundRejection = (data: any) =>
  request({
    url: `${prefix}/v2/wt-driver-account/refund/batch/reject`,
    method: 'post',
    data
  })
/*
  创建申请退费
  请求参数：
  bankCardNo：银行卡号
  bankName：开户行
  driverId：司机Id
  hasReceipt：是否有收据
  money：申请退款金额
  payMethod：退款方式
  payeeName：持卡人姓名
  reason：退款原因
  recoveryReceipt：是否回收收据
  remarks：备注
*/
export const createRefund = (data:any) => request({
  url: `/bill/v2/wt-driver-account/refund/create`,
  method: 'post',
  data
})

/*
  用户账户信息回显
  driverId：司机Id
*/
export const getRefundEcho = (params:any) => request({
  url: `/bill/v2/wt-driver-account/refund/create/echo`,
  method: 'get',
  params
})
// 是否有待退款
// driverId：司机Id
// http://szjw-domain-bill.m2.yunniao.cn/v2/wt-driver-account/refund/haveRecordToBeApproved?driverId=ewqweqeqe
export const haveRecordToBeApproved = (params:any) => request({
  url: `/bill/v2/wt-driver-account/refund/haveRecordToBeApproved`,
  method: 'get',
  params
})

//
// 批量驳回/退费 前置校验是否有非待退费数据
export const checkBatch = (data:any) => request({
  url: `/bill/v2/wt-driver-account/refund/batch/check`,
  method: 'post',
  data
})
