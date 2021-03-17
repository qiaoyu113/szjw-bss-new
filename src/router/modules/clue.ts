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
        apiUrl: '/v2/market-clue/user-group',
        title: 'subdivision',
        noCache: false
      }
    },
    {
      path: 'campaignList', /* CamPaign列表 */
      component: () => import(/* webpackChunkName: "clue" */ '@/views/clue/CampaignMa/List/index.vue'),
      name: 'CampaignList',
      meta: {
        apiUrl: '/v2/clue/campaign/getClueCampaignList',
        title: 'campaignList',
        noCache: false
      }
    },
    // /v2/clue/campaign/getClueCampaignList
    {
      path: 'campaignDetail', /* CamPaign详情 */
      component: () => import(/* webpackChunkName: "clue" */ '@/views/clue/CampaignMa/Detail/index.vue'),
      name: 'CampaignDetail',
      meta: {
        apiUrl: '/v2/clue/campaign/getClueCampaignList',
        hidden: true,
        title: 'campaignList',
        noCache: false
      }
    },
    {
      path: 'backflowPolicy', /* 配置管理回流 */
      component: () => import(/* webpackChunkName: "clue" */ '@/views/clue/policy/BackflowPolicy.vue'),
      name: 'BackflowPolicy',
      meta: {
        apiUrl: '/v2/market-clue/reflow_conf/list',
        title: 'BackflowPolicy',
        noCache: false
      }
    },
    {
      path: 'randomlyAssigned', /* 配置管理随机 */
      component: () => import(/* webpackChunkName: "clue" */ '@/views/clue/policy/RandomlyAssigned.vue'),
      name: 'RandomlyAssigned',
      meta: {
        apiUrl: '/v2/market-clue/config/list',
        title: 'RandomlyAssigned',
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
    }
  ]
}

export default clueRouter
