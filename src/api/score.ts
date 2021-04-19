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
// 实时获取打分人数量
export const getScorerNum = (data: any) =>
  request({
    url: `${baseUrl}/api/score/v1/score/monitor/web/getScorerNum`,
    method: 'get',
    data
  })

// 实时获取打分人数量
export const getScoreStatusList = (data: any) =>
  request({
    url: `${baseUrl}/api/score/v1/score/monitor/web/getScoreStatusList`,
    method: 'post',
    data
  })
