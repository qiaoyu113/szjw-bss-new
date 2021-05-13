import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const departCenterRouter: RouteConfig = {
  path: '/depart',
  component: Layout,
  redirect: '/depart/guestList',
  name: 'Depart',
  meta: {
    title: 'depart',
    icon: 'depart',
    apiUrl: ['/v1/matchLineInfo/search', '/v1/matchLineInfo/queryInvitedLines', '/v1/matchDriverInfo/list'],
    alwaysShow: true
  },
  children: [
    {
      path: 'lineList', /* 线路列表 */
      component: () => import(/* webpackChunkName: "depart" */ '@/views/departCenter/lineList/index.vue'),
      name: 'LineList',
      meta: {
        apiUrl: '/v1/matchLineInfo/search',
        title: 'lineList',
        noCache: false
      }
    },
    {
      path: 'guestList', /* 客邀列表 */
      component: () => import(/* webpackChunkName: "depart" */ '@/views/departCenter/guestList/index.vue'),
      name: 'GuestList',
      meta: {
        apiUrl: '/v1/matchLineInfo/queryInvitedLines',
        title: 'guestList',
        noCache: false
      }
    },
    {
      path: 'chauffeurList', /* 司推列表 */
      component: () => import(/* webpackChunkName: "depart" */ '@/views/departCenter/chauffeurList/index.vue'),
      name: 'ChauffeurList',
      meta: {
        apiUrl: '/v1/matchDriverInfo/list',
        title: 'chauffeurList',
        noCache: false
      }
    }
  ]
}

export default departCenterRouter
