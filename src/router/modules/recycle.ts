import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw = {
  path: '/recycle',
  component: () => import('@/layout/index.vue'),
  children: [
    {
      path: 'systemMenu',
      name: 'RecycleSystemMenu',
      component: () => import('@/views/recycle/SystemMenu.vue')
    },
    {
      path: 'systemRole',
      name: 'RecycleSystemRole',
      component: () => import('@/views/recycle/SystemRole.vue')
    },
    {
      path: 'systemUser',
      name: 'RecycleSystemUser',
      component: () => import('@/views/recycle/SystemUser.vue')
    }
  ]
}

export default routes
