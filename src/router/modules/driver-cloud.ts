import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'
// 司机云
const driverCloud: RouteConfig = {
  path: '/driverClond',
  component: Layout,
  redirect: '/driverClond/selfDriverTag',
  name: 'DriverClond',
  meta: {
    title: 'driverClond',
    icon: 'driver-cloud',
    apiUrl: ['/v2/driver/label-sync/list', '/v2/clueH5/waitAllocate/list', '/v2/clueH5/list']
  },
  children: [
    {
      path: 'list',
      component: () => import(/* webpackChunkName: "driverCloud" */ '@/views/driver-cloud/SelfDriverTag.vue'),
      name: 'SelfDriverTag',
      meta: {
        apiUrl: '/v2/driver/label-sync/list',
        title: 'selfDriverTag',
        noCache: false
      }
    },
    {
      path: 'marketclue',
      component: () => import(/* webpackChunkName: "driverCloud" */ '@/views/driver-cloud/MarketClue.vue'),
      name: 'MarketClue',
      meta: {
        apiUrl: '/v2/clueH5/waitAllocate/list',
        title: 'marketClue',
        noCache: false
      }
    },
    {
      path: 'driverClue',
      component: () => import(/* webpackChunkName: "driverCloud" */ '@/views/driver-cloud/DriverClue.vue'),
      name: 'DriverClue',
      meta: {
        apiUrl: '/v2/clueH5/list',
        title: 'DriverClueNew',
        noCache: false
      }
    },
    {
      path: 'driverClueDetail',
      component: () => import(/* webpackChunkName: "driverCloud" */ '@/views/driver-cloud/DriverClueDetail/index.vue'),
      name: 'DriverClueDetail',
      meta: {
        apiUrl: 'root',
        hidden: true,
        title: 'DriverClueDetail',
        noCache: false
      }
    }
  ]
}

export default driverCloud
