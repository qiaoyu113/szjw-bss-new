import request from '@/utils/request'
const baseUrl = '/mock/271'
// 提交打分
export const PostScoreCommit = (data: any) =>
  request({
    url: `${baseUrl}/api/score/v1/score/assess/h5/commit`,
    method: 'post',
    data
  })
// 设置打分规则
export const saveOrEditRuleData = (data: any) =>
  request({
    url: `${baseUrl}/api/score/v1/score/rule/web/saveOrEditRuleData`,
    method: 'post',
    data
  })
