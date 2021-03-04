
import request from '@/utils/request'
// let prefix = '/carrier_center'
let prefix = '/mock/81'

/**
   *
   * 私海池 雷鸟车池线索详情
   */
export const getClueLCXDetail = (params: any) =>
  request({
    url: `${prefix}/v2/market-clue/getClueLCXDetail`,
    method: 'get',
    params
  })

/**
   *
   * 私海池 梧桐线索详情
   */
export const getClueWSXDetail = (params: any) =>
  request({
    url: `${prefix}/v2/market-clue/getClueWSXDetail`,
    method: 'get',
    params
  })

/**
   *
   * 私海池 雷鸟租赁线索详情
   */
export const getClueLZXDetail = (params: any) =>
  request({
    url: `${prefix}/v2/market-clue/getClueLZXDetail`,
    method: 'get',
    params
  })

/**
   *
   * 私海池 线索详情-操作日志
   */
export const getClueDetailLogs = (data: any) =>
  request({
    url: `${prefix}/v2/market-clue/getClueDetailLogs`,
    method: 'post',
    data
  })

/**
   *
   * 私海池 线索详情-取消面试
   */
export const cancelInterview = (data: any) =>
  request({
    url: `${prefix}/v2/market-clue/cancelInterview`,
    method: 'post',
    data
  })

/**
   *
   * 私海池 线索详情-标记爽约
   */
export const clueBreakAnAppointment = (data: any) =>
  request({
    url: `${prefix}/v2/market-clue/clueBreakAnAppointment`,
    method: 'post',
    data
  })

/**
   *
   * 私海池 发送短信
   */
export const sendMessageApi = (data: any) =>
  request({
    url: `${prefix}/v2/market-clue/sendMessage`,
    method: 'post',
    data
  })

/**
   *
   * 线索跟进-专车共享
   */
export const followClueToFirmiana = (data: any) =>
  request({
    url: `${prefix}/v2/market-clue/followClueToFirmiana`,
    method: 'post',
    data
  })

/**
   *
   * 线索跟进-雷鸟车池
   */
export const followClueToThunderBirdTruckPool = (data: any) =>
  request({
    url: `${prefix}/v2/market-clue/followClueToThunderBirdTruckPool`,
    method: 'post',
    data
  })

/**
   *
   * 线索跟进-雷鸟租赁B/C
   */
export const followClueToThunderBirdRental = (data: any) =>
  request({
    url: `${prefix}/v2/market-clue/followClueToThunderBirdRental`,
    method: 'post',
    data
  })

/**
   *
   * 线索基本信息编辑
   */
export const editClue = (data: any) =>
  request({
    url: `${prefix}/v2/market-clue/editClue`,
    method: 'post',
    data
  })
