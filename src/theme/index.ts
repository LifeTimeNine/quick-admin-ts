
const req = require.context('./modules', false, /\.scss$/)

// 导出主题列表
export const themes: string[] = req.keys().map(item => {
  const reqRes = item.match(/[\w-]+(?=\.scss)/)
  return reqRes ? reqRes[0] : null
}).filter(item => item !== null) as string[]

const requireAll = (requireContext: __WebpackModuleApi.RequireContext) => requireContext.keys().map(requireContext)
requireAll(req)
