import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw = {
  path: '/demo',
  component: () => import('@/layout/index.vue'),
  children: [
    {
      path: 'upload',
      name: 'DemoUpload',
      component: () => import('@/views/demo/Upload.vue')
    },
    {
      path: 'formDialog',
      name: 'DemoFormDialog',
      component: () => import('@/views/demo/FormDialog.vue')
    },
    {
      path: 'tinymce',
      name: 'DemoTinymce',
      component: () => import('@/views/demo/Tinymce.vue')
    }
  ]
}

export default routes
