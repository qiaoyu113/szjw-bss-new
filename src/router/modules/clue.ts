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
<<<<<<< src/router/modules/clue.ts
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
      name: 'PrivateClue',
      meta: {
        apiUrl: 'root',
        title: 'privateClue',
        noCache: false
      }
    },
    {
      path: 'privateDetail', /* 私海池详情 */
      component: () => import(/* webpackChunkName: "clue" */ '@/views/clue/PrivateDetail.vue'),
      name: 'PrivateDetail',
      meta: {
        apiUrl: 'root',
        title: 'privateDetail',
        activeMenu: '/clue/private',
        hidden: true,
        noCache: true
      }
    },
    {
      path: 'backflowPolicy', /* 配置管理 */
      component: () => import(/* webpackChunkName: "clue" */ '@/views/clue/policy/BackflowPolicy.vue'),
      name: 'BackflowPolicy',
      meta: {
        apiUrl: 'root',
        title: 'BackflowPolicy',
        noCache: false
      }
    },
    {
      path: 'randomlyAssigned', /* 配置管理 */
      component: () => import(/* webpackChunkName: "clue" */ '@/views/clue/policy/RandomlyAssigned.vue'),
      name: 'RandomlyAssigned',
      meta: {
        apiUrl: 'root',
        title: 'RandomlyAssigned',
        noCache: false
      }
    },
    {
      path: 'campaignList', /* CamPaign列表 */
      component: () => import(/* webpackChunkName: "clue" */ '@/views/clue/CampaignMa/List/index.vue'),
      name: 'CampaignList',
      meta: {
        apiUrl: 'root',
        title: 'campaignList',
        noCache: false
      }
    },
    {
      path: 'campaignDetail', /* CamPaign详情 */
      component: () => import(/* webpackChunkName: "clue" */ '@/views/clue/CampaignMa/Detail/index.vue'),
      name: 'CampaignDetail',
      meta: {
        apiUrl: 'root',
        hidden: true,
        title: 'campaignList',
        noCache: false
      }
    },
    {
      path: 'phoneDemo', /* CamPaign详情 */
      component: () => import(/* webpackChunkName: "clue" */ '@/views/clue/PhoneDemo.vue'),
      name: 'phoneDemo',
      meta: {
        apiUrl: 'root',
        hidden: true,
        title: 'campaignList',
        noCache: false
      }
    }
  ]
}

export default clueRouter
