import { commentPaths, whitePaths } from '@/settings'
import store from '@/store'
import router from '@/router'
import { RouteLocationNormalized } from 'vue-router'
import { menuPathToIndex } from './utils'
import { Menu, UserInfo } from './interface/systemUser'

/**
 * 判断是否是白名单地址
 * @param path 地址
 * @returns boolean
 */
export function isWhitePath(path: string): boolean {
  return whitePaths.includes(path)
}

export function allowPath(path: string): boolean {
  if (commentPaths.includes(path)) return true
  if (store.getters['user/menuPaths'].includes(path)) return true
  return false
}

router.beforeEach(async(to: RouteLocationNormalized, from: RouteLocationNormalized, next: any): Promise<void> => {
  if (store.getters['user/token']) {
    if (to.path === '/login') {
      next('/')
    } else {
      if (isWhitePath(to.path)) {
        next()
        return Promise.resolve()
      }
      const userInfo: UserInfo = store.getters['user/userInfo']
      if (!userInfo.username) {
        try {
          await store.dispatch('user/getUserInfo')
          const { map: { menus } }: { map: { menus: Menu[] } } = await store.dispatch('user/getMenu')
          store.commit('app/MENU_ACTIVE', menuPathToIndex(menus, to.path))
        } catch (error) {
          store.dispatch('user/removeToken')
          next(`/login?redirect=${to.path}`)
          return Promise.resolve()
        }
      }
      if (allowPath(to.path)) {
        next()
      } else {
        next('/404')
      }
    }
  } else {
    if (isWhitePath(to.path)) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})
