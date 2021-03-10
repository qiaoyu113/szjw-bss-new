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
      component: () => import('@/views/setcenter/linelist.vue'),
      name: 'LineList',
      meta: {
        activeMenu: '/setcenter/linelist',
        title: 'lineList',
        icon: '',
        noCache: false,
        apiUrl: 'root'
      }
    }]
}
export default setcenterRouter
