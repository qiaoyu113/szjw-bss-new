import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const presetRouter: RouteConfig = {
  path: '/roleSystem', /* 权限管理系统 */
  component: Layout,
  redirect: '/roleSystem/organizationmanage',
  name: 'roleSystem',
  meta: {
    title: 'roleSystem',
    icon: 'system',
    apiUrl: ['/v1/base/user/menu', '/v2/base/user/create', '/v2/base/user/update',
      '/v2/base/role/create', '/v2/base/role/list', '/v1/base/authority/list', '/v2/base/duty/list',
      '/v1/base/office/list', '/v1/base/role/update', '/v2/base/role/getByRoleId', '/v2/line/label/configManager', '/v1/product/product/list/page',
      '/v1/product/product/system/setting'
    ]

  },
  children: [
    {
      path: 'organizationmanage', /* 组织管理 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/preset/organization/OrganizationManage.vue'),
      name: 'OrganizationManage',
      meta: {
        title: 'organizationManage',
        activeMenu: '/roleSystem/organizationmanage',
        noCache: false,
        icon: '',
        apiUrl: '/v1/base/office/list'
      }
    },
    {
      path: 'dutymanage', /* 职责管理 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/preset/duty/DutyManage.vue'),
      name: 'DutyManage',
      meta: {
        title: 'dutyManage',
        activeMenu: '/roleSystem/dutymanage',
        noCache: false,
        icon: '',
        apiUrl: '/v2/base/duty/list'
      }
    },
    {
      path: 'user', /* 用户管理new */
      component: () => import(/* webpackChunkName: "user" */ '@/views/preset/user/List/index.vue'),
      name: 'User',
      meta: {
        title: 'user',
        activeMenu: '/roleSystem/user',
        noCache: true,
        icon: '',
        apiUrl: '/v1/base/user/menu'
      }
    },
    {
      path: 'addUser', /* 新建用户 */
      component: () => import(/* webpackChunkName: "user" */ '@/views/preset/user/CreateUser/index.vue'),
      name: 'addUser',
      meta: {
        title: 'addUser',
        activeMenu: '/roleSystem/user',
        noCache: true,
        icon: '',
        apiUrl: '/v1/base/user/menu'
      }
    },
    {
      path: 'wtSystem', /* 梧桐管理 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/preset/wtSystem/PermissionManage.vue'),
      name: 'wtSystem',
      redirect: '/wtSystem/authority',
      meta: {
        title: 'wtSystem',
        activeMenu: '/wtSystem/authority',
        noCache: false,
        icon: '',
        apiUrl: '/v1/base/office/list'
      },
      children: [
        {
          path: 'authority',
          component: () => import('@/views/preset/wtSystem/PermissionManage.vue'),
          name: 'AuthoritySystem',
          meta: {
            title: 'authoritySystem',
            apiUrl: '/v1/base/office/list'
          }
        },
        {
          path: 'role',
          component: () => import('@/views/preset/wtSystem/RoleManage.vue'),
          name: 'RoleSystem',
          meta: {
            title: 'roleSystem',
            apiUrl: '/v1/base/office/list'
          }
        }
      ]
    },
    {
      path: 'lnSystem', /* 雷鸟管理 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/preset/lnSystem/PermissionManage.vue'),
      name: 'lnSystem',
      redirect: '/lnSystem/authority',
      meta: {
        title: 'lnSystem',
        activeMenu: '/lnSystem/authority',
        noCache: false,
        icon: '',
        apiUrl: '/v1/base/office/list'
      },
      children: [
        {
          path: 'authority',
          component: () => import('@/views/preset/lnSystem/PermissionManage.vue'),
          name: 'AuthoritySystem',
          meta: {
            title: 'authoritySystem',
            apiUrl: '/v1/base/office/list'
          }
        },
        {
          path: 'role',
          component: () => import('@/views/preset/lnSystem/RoleManage.vue'),
          name: 'roleManage',
          meta: {
            title: 'roleManage',
            apiUrl: '/v1/base/office/list'
          }
        }
      ]
    },
    {
      path: 'roleSystem', /* 权限管理系统 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/preset/roleSystem/PermissionManage.vue'),
      name: 'roleSystem',
      redirect: '/roleSystem/authority',
      meta: {
        title: 'roleSystem',
        activeMenu: '/roleSystem/authority',
        noCache: false,
        icon: '',
        apiUrl: '/v1/base/office/list'
      },
      children: [
        {
          path: 'authority',
          component: () => import('@/views/preset/roleSystem/PermissionManage.vue'),
          name: 'AuthoritySystem',
          meta: {
            title: 'authoritySystem',
            apiUrl: '/v1/base/office/list'
          }
        },
        {
          path: 'role',
          component: () => import('@/views/preset/roleSystem/RoleManage.vue'),
          name: 'roleManage',
          meta: {
            title: 'roleManage',
            apiUrl: '/v1/base/office/list'
          }
        }
      ]
    },
    {
      path: 'clueSystem', /* 线索管理系统 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/preset/clueSystem/PermissionManage.vue'),
      name: 'clueSystem',
      redirect: '/clueSystem/authority',
      meta: {
        title: 'clueSystem',
        activeMenu: '/clueSystem/authority',
        noCache: false,
        icon: '',
        apiUrl: '/v1/base/office/list'
      },
      children: [
        {
          path: 'authority',
          component: () => import('@/views/preset/clueSystem/PermissionManage.vue'),
          name: 'AuthoritySystem',
          meta: {
            title: 'authoritySystem',
            apiUrl: '/v1/base/office/list'
          }
        },
        {
          path: 'role',
          component: () => import('@/views/preset/clueSystem/RoleManage.vue'),
          name: 'roleManage',
          meta: {
            title: 'roleManage',
            apiUrl: '/v1/base/office/list'
          }
        }
      ]
    },
    {
      path: 'dataSystem', /* 数据管理系统 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/preset/dataSystem/PermissionManage.vue'),
      name: 'dataSystem',
      redirect: '/dataSystem/authority',
      meta: {
        title: 'dataSystem',
        activeMenu: '/dataSystem/authority',
        noCache: false,
        icon: '',
        apiUrl: '/v1/base/office/list'
      },
      children: [
        {
          path: 'authority',
          component: () => import('@/views/preset/dataSystem/PermissionManage.vue'),
          name: 'AuthoritySystem',
          meta: {
            title: 'authoritySystem',
            apiUrl: '/v1/base/office/list'
          }
        },
        {
          path: 'role',
          component: () => import('@/views/preset/dataSystem/RoleManage.vue'),
          name: 'roleManage',
          meta: {
            title: 'roleManage',
            apiUrl: '/v1/base/office/list'
          }
        }
      ]
    }
  ]
}

export default presetRouter
