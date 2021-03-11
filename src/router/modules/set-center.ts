/*
 * @Author: your name
 * @Date: 2021-03-11 14:55:26
 * @LastEditTime: 2021-03-11 15:18:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \szjw_bss_web\src\router\modules\set-center.ts
 */
import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const setcenterRouter: RouteConfig = {
  path: '/setcenter', /* 撮合中心 */
  component: Layout,
  redirect: '/setcenter/linelist',
  name: 'setCenter',
  meta: {
    title: 'setcenterTitle',
    icon: 'setcenter',
    apiUrl: 'root',
    alwaysShow: true
  },
  children: [
    {
      path: 'linelist', /* 线路列表 */
      component: () => import('@/views/set-center/linelist.vue'),
      name: 'LineList',
      meta: {
        activeMenu: '/setcenter/linelist',
        title: 'lineList',
        icon: '',
        noCache: false,
        apiUrl: 'root'
      }
    },
    {
      path: 'driverMatch', /* 司推列表 */
      component: () => import('@/views/set-center/driverMatch.vue'),
      name: 'DriverMatch',
      meta: {
        title: 'driverMatch',
        noCache: false,
        apiUrl: 'root'
      }
    }]
}
export default setcenterRouter
