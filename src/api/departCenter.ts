import request from '@/utils/request'
const base = '/base_center'

// 创建试跑意向
export const CreateLntentionRun = (data: any) =>
  request({
    url: `/waybill/v2/runtest/creatIntentionRun`,
    method: 'post',
    data
  })
