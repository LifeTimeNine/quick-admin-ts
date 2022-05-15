
/** 列表数据 */
export interface ListItem {
  create_time: string
  icon: string|null
  id: number
  node: string
  params: string|null
  pid: number
  sort: number
  status: number
  title: string
  url: string
  children?: ListItem[]
}

/** 表单参数 */
export interface FormParams {
  id?: number
  pid: number
  icon: string|null
  title: string
  url: string
  params: string|null
  node: string|null
}

/** 菜单节点信息 */
export interface NodeInfo {
  node: string
  title: string
}
