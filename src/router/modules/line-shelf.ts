import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const lineShelfRouter: RouteConfig = {
  path: '/lineshelf',
  component: Layout,
  redirect: 'noredirect',
  name: 'Lineshelf',
  meta: {
    title: 'lineShelf',
    icon: 'chart',
    apiUrl: 'root'
  },
  children: [
    {
      path: 'agent',
      component: () => import(/* webpackChunkName: "driver" */ '@/views/line-shelf/agent/index.vue'),
      name: 'Agent',
      meta: {
        apiUrl: 'root',
        title: 'agent',
        noCache: false
      }
    },
    {
      path: 'complete',
      component: () => import(/* webpackChunkName: "driver" */ '@/views/line-shelf/complete/index.vue'),
      name: 'Complete',
      meta: {
        apiUrl: 'root',
        title: 'complete',
        noCache: false
      }
    }
  ]
}

export default lineShelfRouter
