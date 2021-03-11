import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const matchCenterRouter: RouteConfig = {
  path: '/matchCenter', /* 撮合中心 */
  component: Layout,
  redirect: '/matchCenter/linelist',
  name: 'matchCenter',
  meta: {
    title: 'matchCenterTitle',
    icon: 'matchCenter',
    apiUrl: 'root',
    alwaysShow: true
  },
  children: [
    {
      path: 'linelist', /* 线路列表 */
      component: () => import('@/views/matchCenter/linelist.vue'),
      name: 'LineList',
      meta: {
        activeMenu: '/matchCenter/linelist',
        title: 'lineList',
        icon: '',
        noCache: false,
        apiUrl: 'root'
      }
    },
    {
      path: 'customerInvite',
      component: () => import( '@/views/set-center/CustomerInvite.vue'),
      name: 'customerInvite',
      meta: {
        apiUrl: 'root',
        hidden: false,
        title: 'customerInvite',
        noCache: false
      }
    }
  ]
}
export default matchCenterRouter
