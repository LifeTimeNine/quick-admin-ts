import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw = {
  path: '/system',
  component: () => import('@/layout/index.vue'),
  children: [
    {
      path: 'actionLog',
      name: 'SystemActionLog',
      component: () => import('@/views/system/ActionLog.vue')
    },
    {
      path: 'config',
      name: 'SystemConfig',
      component: () => import('@/views/system/Config.vue')
    },
    {
      path: 'errorLog',
      name: 'SystemErrorLog',
      component: () => import('@/views/system/ErrorLog.vue')
    },
    {
      path: 'menu',
      name: 'SystemMenu',
      component: () => import('@/views/system/Menu.vue')
    },
    {
      path: 'role',
      name: 'SystemRole',
      component: () => import('@/views/system/Role.vue')
    },
    {
      path: 'task',
      name: 'SystemTask',
      component: () => import('@/views/system/Task.vue')
    },
    {
      path: 'user',
      name: 'SystemUser',
      component: () => import('@/views/system/User.vue')
    }
  ]
}

export default routes
