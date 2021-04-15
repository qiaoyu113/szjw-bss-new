/*
 * @Author: your name
 * @Date: 2021-04-13 14:28:38
 * @LastEditTime: 2021-04-13 15:04:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \szjw_bss_web\src\router\modules\departCenter.ts
 */
import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const departCenterRouter: RouteConfig = {
  path: '/depart',
  component: Layout,
  redirect: '/depart/guestList',
  name: 'Depart',
  meta: {
    title: 'depart',
    icon: 'delivery',
    apiUrl: 'root',
    alwaysShow: true
  },
  children: [
    {
      path: 'guestList', /* 客邀列表 */
      component: () => import(/* webpackChunkName: "depart" */ '@/views/departCenter/guestList/index.vue'),
      name: 'GuestList',
      meta: {
        apiUrl: 'root',
        title: 'guestList',
        noCache: false
      }
    },
    {
      path: 'chauffeurList', /* 司推列表 */
      component: () => import(/* webpackChunkName: "depart" */ '@/views/departCenter/chauffeurList/index.vue'),
      name: 'ChauffeurList',
      meta: {
        apiUrl: 'root',
        title: 'chauffeurList',
        noCache: false
      }
    }
  ]
}

export default departCenterRouter
