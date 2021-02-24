import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const clueRouter: RouteConfig = {
  path: '/clue',
  component: Layout,
  redirect: '/clue/public',
  name: 'Clue',
  meta: {
    title: 'clueTitle',
    icon: 'delivery',
    apiUrl: 'root'
  },
  children: [
    {
      path: 'subdivision', /* 客群细分管理 */
      component: () => import(/* webpackChunkName: "clue" */ '@/views/clue/Subdivision.vue'),
      name: 'Subdivision',
      meta: {
        apiUrl: 'root',
        title: 'subdivision',
        noCache: false
      }
    },
    {
      path: 'public', /* 公海池 */
      component: () => import(/* webpackChunkName: "clue" */ '@/views/clue/Public.vue'),
      name: 'PublicClue',
      meta: {
        apiUrl: 'root',
        title: 'publicClue',
        noCache: false
      }
    },
    {
      path: 'private', /* 私海池 */
      component: () => import(/* webpackChunkName: "clue" */ '@/views/clue/Private.vue'),
      name: 'Private',
      meta: {
        apiUrl: 'root',
        title: 'privateClue',
        noCache: false
      }
    }
  ]
}

export default clueRouter
