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
      path: 'lineList', /* 线路列表 */
      component: () => import(/* webpackChunkName: "depart" */ '@/views/departCenter/lineList/index.vue'),
      name: 'LineList',
      meta: {
        apiUrl: 'root',
        title: 'lineList',
        noCache: false
      }
    },
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
      path: 'demo', /* 客邀列表 */
      component: () => import(/* webpackChunkName: "depart" */ '@/views/departCenter/demo/index.vue'),
      name: 'GuestList',
      meta: {
        apiUrl: 'root',
        title: 'guestList',
        noCache: false,
        hidden: true
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
