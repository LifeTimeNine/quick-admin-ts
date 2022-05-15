import * as ElIcons from '@element-plus/icons-vue'
import { App } from 'vue'

const req = require.context('./svg', false, /\.svg$/)

// 导出 svg 列表
export const svgIcons: Array<string|null> = req.keys().map(item => {
  const reqRes = item.match(/[\w-]+(?=\.svg)/)
  return reqRes ? reqRes[0] : null
}).filter(item => item !== null)

const requireAll = (requireContext: __WebpackModuleApi.RequireContext) => requireContext.keys().map(requireContext)
requireAll(req)

// 导出 Element-Icon 的图标列表
export const elIcons = Object.keys(ElIcons).map(item => {
  return item.toLocaleLowerCase()
})

export default {
  install(app: App) {
    // 导入所有 Element-icon
    Object.keys(ElIcons).forEach(key => {
      // 重命名，防止和已有组件冲突
      app.component(`ElIcon${ElIcons[key as keyof typeof ElIcons].name}`, ElIcons[key as keyof typeof ElIcons])
    })
  }
}
