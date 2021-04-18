import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const energizeMarkRouter: RouteConfig = {
  path: '/energizeMark',
  component: Layout,
  redirect: 'noredirect',
  name: 'EnergizeMark',
  meta: {
    title: 'energizeMark',
    icon: 'chart',
    apiUrl: 'root'
  },
  children: [
    {
      path: 'statistic',
      component: () => import(/* webpackChunkName: "driver" */ '@/views/energize-mark/statistic.vue'),
      name: 'Statistic',
      meta: {
        apiUrl: 'root',
        title: 'statistic',
        noCache: false
      }
    },
    {
      path: 'monitor',
      component: () => import(/* webpackChunkName: "driver" */ '@/views/energize-mark/monitor.vue'),
      name: 'Monitor',
      meta: {
        apiUrl: 'root',
        title: 'monitor',
        noCache: false
      }
    },
    {
      path: 'set',
      component: () => import(/* webpackChunkName: "driver" */ '@/views/energize-mark/set.vue'),
      name: 'Set',
      meta: {
        apiUrl: 'root',
        title: 'set',
        noCache: false
      }
    }
  ]
}

export default energizeMarkRouter
