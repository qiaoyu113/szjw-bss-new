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
    apiUrl: ['/v3/base/office/list', '/v3/base/duty/list', '/v3/base/user/page/list', '/v3/base/authority/list/wt', '/v3/base/role/list/1', '/v3/base/authority/list/ln', '/v3/base/role/list/3', '/v3/base/authority/list/role', '/v3/base/role/list/6', '/v3/base/authority/list/clue', '/v3/base/role/list/7', '/v3/base/authority/list/data', '/v3/base/role/list/8'],
    alwaysShow: true
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
        apiUrl: '/v3/base/office/list'
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
        apiUrl: '/v3/base/duty/list'
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
        apiUrl: '/v3/base/user/page/list'
      }
    },
    {
      path: 'addUser', /* 新建用户 */
      component: () => import(/* webpackChunkName: "user" */ '@/views/preset/user/CreateUser/index.vue'),
      name: 'addUser',
      meta: {
        title: 'addUserNew',
        activeMenu: '/v3/base/user/create',
        noCache: true,
        hidden: true,
        icon: '',
        apiUrl: 'root'
      }
    },
    {
      path: 'wtSystem', /* 梧桐管理 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/preset/wtSystem/index.vue'),
      name: 'Index',
      redirect: '/wtSystem/authority',
      meta: {
        title: 'wtSystem',
        activeMenu: '/wtSystem/authority',
        noCache: false,
        alwaysShow: true,
        icon: '',
        apiUrl: ['/v3/base/authority/list/wt', '/v3/base/role/list/1']
      },
      children: [
        {
          path: 'authority',
          component: () => import('@/views/preset/wtSystem/PermissionManage.vue'),
          name: 'AuthoritySystem',
          meta: {
            title: 'authoritySystem',
            apiUrl: '/v3/base/authority/list/1'
          }
        },
        {
          path: 'role',
          component: () => import('@/views/preset/wtSystem/RoleManage.vue'),
          name: 'RoleManage',
          meta: {
            title: 'roleManage',
            apiUrl: '/v3/base/role/list/1',
            sysType: 1
          }
        },
        {
          path: 'showUser', /* 查看用户 */
          component: () => import(/* webpackChunkName: "user" */ '@/views/preset/user/List/showUser.vue'),
          name: 'ShowUser',
          meta: {
            apiUrl: 'root',
            activeMenu: '/roleSystem/wtSystem/role',
            title: 'showUser',
            noCache: true,
            hidden: true
          }
        },
        {
          path: 'roleOperate', /* 编辑角色 */
          component: () => import(/* webpackChunkName: "user" */ '@/views/preset/wtSystem/RoleOperate.vue'),
          name: 'RoleOperate',
          meta: {
            apiUrl: '/v1/base/role/update/1',
            activeMenu: '/roleSystem/wtSystem/role',
            title: 'editRole',
            noCache: true,
            hidden: true
          }
        },
        {
          path: 'roleCreate', /* 新建角色 */
          component: () => import(/* webpackChunkName: "user" */ '@/views/preset/wtSystem/RoleOperate.vue'),
          name: 'RoleCreate',
          meta: {
            apiUrl: '/v1/base/role/create/1',
            activeMenu: '/roleSystem/wtSystem/role',
            title: 'createRole',
            noCache: true,
            hidden: true
          }
        }
      ]
    },
    {
      path: 'lnSystem', /* 雷鸟管理 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/preset/lnSystem/index.vue'),
      name: 'Index',
      redirect: '/lnSystem/authority',
      meta: {
        title: 'lnSystem',
        activeMenu: '/lnSystem/authority',
        noCache: false,
        alwaysShow: true,
        icon: '',
        apiUrl: ['/v3/base/authority/list/ln', '/v3/base/role/list/3']
      },
      children: [
        {
          path: 'authority',
          component: () => import('@/views/preset/lnSystem/PermissionManage.vue'),
          name: 'AuthoritySystem',
          meta: {
            title: 'authoritySystem',
            apiUrl: '/v3/base/authority/list/3'
          }
        },
        {
          path: 'role',
          component: () => import('@/views/preset/wtSystem/RoleManage.vue'),
          name: 'roleManage',
          meta: {
            title: 'roleManage',
            apiUrl: ['/v3/base/role/list/3'],
            sysType: 3
          }
        },
        {
          path: 'showUser', /* 查看用户 */
          component: () => import(/* webpackChunkName: "user" */ '@/views/preset/user/List/showUser.vue'),
          name: 'ShowUser',
          meta: {
            title: 'showUser',
            noCache: true,
            hidden: true,
            icon: '',
            apiUrl: 'root',
            activeMenu: '/roleSystem/lnSystem/role'
          }
        },
        {
          path: 'roleOperate', /* 编辑角色 */
          component: () => import(/* webpackChunkName: "user" */ '@/views/preset/wtSystem/RoleOperate.vue'),
          name: 'RoleOperate',
          meta: {
            apiUrl: ['/v1/base/role/update/3'],
            activeMenu: '/roleSystem/lnSystem/role',
            title: 'editRole',
            noCache: true,
            hidden: true
          }
        },
        {
          path: 'roleCreate', /* 新建角色 */
          component: () => import(/* webpackChunkName: "user" */ '@/views/preset/wtSystem/RoleOperate.vue'),
          name: 'RoleCreate',
          meta: {
            apiUrl: ['/v1/base/role/create/3'],
            activeMenu: '/roleSystem/lnSystem/role',
            title: 'createRole',
            noCache: true,
            hidden: true
          }
        }
      ]
    },
    {
      path: 'roleSystem', /* 权限管理系统 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/preset/wtSystem/index.vue'),
      name: 'Index',
      redirect: '/roleSystem/authority',
      meta: {
        title: 'roleSystem',
        activeMenu: '/roleSystem/authority',
        noCache: false,
        alwaysShow: true,
        icon: '',
        apiUrl: ['/v3/base/authority/list/role', '/v3/base/role/list/6']
      },
      children: [
        {
          path: 'authority',
          component: () => import('@/views/preset/roleSystem/PermissionManage.vue'),
          name: 'AuthoritySystem',
          meta: {
            title: 'authoritySystem',
            apiUrl: '/v3/base/authority/list/6'
          }
        },
        {
          path: 'role',
          component: () => import('@/views/preset/wtSystem/RoleManage.vue'),
          name: 'roleManage',
          meta: {
            title: 'roleManage',
            apiUrl: ['/v3/base/role/list/6'],
            sysType: 6
          }
        },
        {
          path: 'showUser', /* 查看用户 */
          component: () => import(/* webpackChunkName: "user" */ '@/views/preset/user/List/showUser.vue'),
          name: 'ShowUser',
          meta: {
            title: 'showUser',
            noCache: true,
            hidden: true,
            icon: '',
            apiUrl: 'root',
            activeMenu: '/roleSystem/roleSystem/role'
          }
        },
        {
          path: 'roleOperate', /* 编辑角色 */
          component: () => import(/* webpackChunkName: "user" */ '@/views/preset/wtSystem/RoleOperate.vue'),
          name: 'RoleOperate',
          meta: {
            activeMenu: '/roleSystem/roleSystem/role',
            title: 'editRole',
            apiUrl: ['/v1/base/role/update/6'],
            noCache: true,
            hidden: true
          }
        },
        {
          path: 'roleCreate', /* 新建角色 */
          component: () => import(/* webpackChunkName: "user" */ '@/views/preset/wtSystem/RoleOperate.vue'),
          name: 'RoleCreate',
          meta: {
            apiUrl: ['/v1/base/role/create/6'],
            activeMenu: '/roleSystem/roleSystem/role',
            title: 'createRole',
            noCache: true,
            hidden: true
          }
        }
      ]
    },
    {
      path: 'clueSystem', /* 线索管理系统 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/preset/wtSystem/index.vue'),
      name: 'Index',
      redirect: '/clueSystem/authority',
      meta: {
        title: 'clueSystem',
        activeMenu: '/clueSystem/authority',
        noCache: false,
        alwaysShow: true,
        icon: '',
        apiUrl: ['/v3/base/authority/list/clue', '/v3/base/role/list/7']
      },
      children: [
        {
          path: 'authority',
          component: () => import('@/views/preset/clueSystem/PermissionManage.vue'),
          name: 'AuthoritySystem',
          meta: {
            title: 'authoritySystem',
            apiUrl: '/v3/base/authority/list/7'
          }
        },
        {
          path: 'role',
          component: () => import('@/views/preset/wtSystem/RoleManage.vue'),
          name: 'roleManage',
          meta: {
            title: 'roleManage',
            apiUrl: ['/v3/base/role/list/7'],
            sysType: 7
          }
        },
        {
          path: 'showUser', /* 查看用户 */
          component: () => import(/* webpackChunkName: "user" */ '@/views/preset/user/List/showUser.vue'),
          name: 'ShowUser',
          meta: {
            title: 'showUser',
            noCache: true,
            hidden: true,
            icon: '',
            apiUrl: 'root',
            activeMenu: '/roleSystem/clueSystem/role'
          }
        },
        {
          path: 'roleOperate', /* 编辑角色 */
          component: () => import(/* webpackChunkName: "user" */ '@/views/preset/wtSystem/RoleOperate.vue'),
          name: 'RoleOperate',
          meta: {
            apiUrl: ['/v1/base/role/update/7'],
            activeMenu: '/roleSystem/clueSystem/role',
            title: 'editRole',
            noCache: true,
            hidden: true
          }
        },
        {
          path: 'roleCreate', /* 新建角色 */
          component: () => import(/* webpackChunkName: "user" */ '@/views/preset/wtSystem/RoleOperate.vue'),
          name: 'RoleCreate',
          meta: {
            apiUrl: ['/v1/base/role/create/7'],
            activeMenu: '/roleSystem/clueSystem/role',
            title: 'createRole',
            noCache: true,
            hidden: true
          }
        }
      ]
    },
    {
      path: 'dataSystem', /* 数据管理系统 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/preset/wtSystem/index.vue'),
      name: 'Index',
      redirect: '/dataSystem/authority',
      meta: {
        title: 'dataSystem',
        activeMenu: '/dataSystem/authority',
        noCache: false,
        alwaysShow: true,
        icon: '',
        apiUrl: ['/v3/base/authority/list/data', '/v3/base/role/list/8']
      },
      children: [
        {
          path: 'authority',
          component: () => import('@/views/preset/dataSystem/PermissionManage.vue'),
          name: 'AuthoritySystem',
          meta: {
            title: 'authoritySystem',
            apiUrl: '/v3/base/authority/list/8'
          }
        },
        {
          path: 'role',
          component: () => import('@/views/preset/wtSystem/RoleManage.vue'),
          name: 'roleManage',
          meta: {
            title: 'roleManage',
            apiUrl: ['/v3/base/role/list/8'],
            sysType: 8
          }
        },
        {
          path: 'showUser', /* 查看用户 */
          component: () => import(/* webpackChunkName: "user" */ '@/views/preset/user/List/showUser.vue'),
          name: 'ShowUser',
          meta: {
            title: 'showUser',
            noCache: true,
            hidden: true,
            icon: '',
            apiUrl: 'root',
            activeMenu: '/roleSystem/dataSystem/role'
          }
        },
        {
          path: 'roleOperate', /* 编辑角色 */
          component: () => import(/* webpackChunkName: "user" */ '@/views/preset/wtSystem/RoleOperate.vue'),
          name: 'RoleOperate',
          meta: {
            apiUrl: ['/v1/base/role/update/8'],
            activeMenu: '/roleSystem/dataSystem/role',
            title: 'editRole',
            noCache: true,
            hidden: true
          }
        },
        {
          path: 'roleCreate', /* 新建角色 */
          component: () => import(/* webpackChunkName: "user" */ '@/views/preset/wtSystem/RoleOperate.vue'),
          name: 'RoleCreate',
          meta: {
            apiUrl: ['/v1/base/role/create/8'],
            activeMenu: '/roleSystem/dataSystem/role',
            title: 'createRole',
            noCache: true,
            hidden: true
          }
        }
      ]
    }
  ]
}

export default presetRouter
