import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const energizeMarkRouter: RouteConfig = {
  path: '/energizeMark',
  component: Layout,
  redirect: 'noredirect',
  name: 'EnergizeMark',
  meta: {
    title: 'energizeMark',
    icon: 'mark',
    apiUrl: 'root'
  },
  children: [
    {
      path: 'statistic',
      component: () => import(/* webpackChunkName: "driver" */ '@/views/energize-mark/statistic.vue'),
      name: 'Statistic',
      meta: {
        apiUrl: '/v1/score/assess/statistical',
        title: 'statistic',
        noCache: false
      }
    },
    {
      path: 'monitor',
      component: () => import(/* webpackChunkName: "driver" */ '@/views/energize-mark/monitor.vue'),
      name: 'Monitor',
      meta: {
        apiUrl: '/v1/score/monitor',
        title: 'monitor',
        noCache: true
      }
    },
    {
      path: 'set',
      component: () => import(/* webpackChunkName: "driver" */ '@/views/energize-mark/set.vue'),
      name: 'Set',
      meta: {
        apiUrl: '/v1/score/rule/setting',
        title: 'set',
        noCache: false
      }
    }
  ]
}

export default energizeMarkRouter
