import { Menu } from '@/interface/systemUser'

/**
 * 判断是否是外部连接
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path: string): boolean {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 根据菜单路径获取菜单索引
 * @param menus 菜单数据
 * @param path 菜单地址
 * @returns string
 */
export function menuPathToIndex(menus: Menu[], path: string): string {
  for (const menu of menus) {
    if (menu.url === '#' && menu.children.length > 0) {
      const res = menuPathToIndex(menu.children, path)
      if (res !== '') return res
    } else {
      if (menu.url === path) return menu.id + ''
    }
  }
  return ''
}

/**
 * 计算百分比
 * @param current 当前值
 * @param total 总和
 * @returns number
 */
export function percentage(current: number, total: number): number {
  return Math.round((current / total) * 10000) / 100
}
