import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const orderRouter: RouteConfig = {
  path: '/join', /* 加盟中心 */
  component: Layout,
  redirect: '/join/ordermanage',
  name: 'Join',
  meta: {
    title: 'joinTitle',
    icon: 'join',
    apiUrl: 'root'
  },
  children: [
    {
      path: 'creatorder', /* 创建订单 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/join/CreatOrder.vue'),
      name: 'CreatOrder',
      meta: {
        hidden: true,
        apiUrl: 'root',
        activeMenu: '/join/ordermanage',
        title: 'creatOrder',
        noCache: true
      }
    },
    {
      path: 'orderdetail', /* 订单详情 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/join/OrderDetail.vue'),
      name: 'OrderDetail',
      meta: {
        hidden: true,
        apiUrl: 'root',
        activeMenu: '/join/ordermanage',
        title: 'orderDetail',
        noCache: true
      }
    },
    {
      path: 'orderlog', /* 订单日志 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/join/OrderLog.vue'),
      name: 'OrderLog',
      meta: {
        hidden: true,
        apiUrl: 'root',
        activeMenu: '/join/ordermanage',
        title: 'orderLog',
        noCache: true
      }
    },
    {
      path: 'orderaudit', /* 订单审核 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/join/OrderAudit.vue'),
      name: 'OrderAudit',
      meta: {
        hidden: true,
        apiUrl: 'root',
        activeMenu: '/join/ordermanage',
        title: 'orderAudit',
        noCache: false
      }
    },
    {
      path: 'ordermanage', /* 订单管理 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/join/OrderManage.vue'),
      name: 'OrderManage',
      meta: {
        apiUrl: '/v1/order/getOrderInfoList',
        title: 'orderManage',
        noCache: false
      }
    },
    {
      path: 'ordercheck', /* 订单确认 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/join/OrderCheck.vue'),
      name: 'OrderCheck',
      meta: {
        hidden: true,
        apiUrl: 'root',
        title: 'orderCheck',
        noCache: true
      }
    },
    {
      path: 'refundorder', /* 退款订单 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/join/RefundOrder.vue'),
      name: 'RefundOrder',
      meta: {
        hidden: true,
        apiUrl: 'root',
        title: 'refundOrder',
        noCache: false
      }
    },
    {
      path: 'contractlist', /* 合同列表 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/join/ContractList.vue'),
      name: 'ContractList',
      meta: {
        apiUrl: '/v1/contract/getContractList',
        title: 'contractList',
        noCache: false
      }
    },
    {
      path: 'contractdetail', /* 合同详情 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/join/ContractDetail.vue'),
      name: 'ContractDetail',
      meta: {
        hidden: true,
        apiUrl: 'root',
        activeMenu: '/join/contractlist',
        title: 'contractDetail',
        noCache: true
      }
    },
    {
      path: 'dealform', /* 交付 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/join/DealForm.vue'),
      name: 'DealForm',
      meta: {
        apiUrl: 'root',
        activeMenu: '/join/dealmanage',
        title: 'dealForm',
        noCache: true,
        hidden: true
      }
    },
    {
      path: 'dealmanagedetail', /* 交付详情 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/join/DealManageDetail.vue'),
      name: 'DealManageDetail',
      meta: {
        apiUrl: 'root',
        title: 'dealManageDetail',
        activeMenu: '/join/dealmanage',
        noCache: true,
        hidden: true
      }
    },
    {
      path: 'dealmanage', /* 成交管理 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/join/DealManage.vue'),
      name: 'DealManage',
      meta: {
        apiUrl: '/v1/order/deliever/getDelieverList',
        title: 'dealManage',
        noCache: false
      }
    },
    {
      path: 'dealstatistics', /* 成交统计 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/join/DealStatistics.vue'),
      name: 'DealStatistics',
      meta: {
        hidden: true,
        apiUrl: 'root',
        title: 'dealStatistics',
        noCache: false
      }
    }
  ]
}

export default orderRouter
