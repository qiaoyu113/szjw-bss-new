import request from '@/utils/request'
// const baseUrl = '/mock/271'
const baseUrl = ''
// 确定开始打分
export const goToOpenScore = (data: any) =>
  request({
    url: `${baseUrl}/score/v1/score/assess/back/open`,
    method: 'post',
    data
  })

// 查询打分规则
export const getRuleData = () =>
  request({
    url: `${baseUrl}/score/v1/score/rule/web/getRuleData`
  })

// 设置打分规则
export const saveOrEditRuleData = (data: any) =>
  request({
    url: `${baseUrl}/score/v1/score/rule/web/saveOrEditRuleData`,
    method: 'post',
    data
  })
// 实时获取打分人数量
export const getScorerNum = () =>
  request({
    url: `${baseUrl}/score/v1/score/monitor/web/getScorerNum`
  })

// 获取打分人状态
export const getScoreStatusList = (params: any) =>
  request({
    url: `${baseUrl}/score/v1/score/monitor/web/getScoreStatusList`,
    method: 'post',
    params
  })

// 查询历史场次列表
export const getHistorySessionList = () =>
  request({
    url: `${baseUrl}/score/v1/score/report/getHistorySessionList`
  })
// 查询报表详情
export const getReportInfo = (params: any) =>
  request({
    url: `${baseUrl}/score/v1/score/report/getReportInfo`,
    params
  })
