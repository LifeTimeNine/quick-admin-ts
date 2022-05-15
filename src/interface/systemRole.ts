import { BasicQueryParams } from '.'

/** 列表查询参数 */
export interface ListQueryParams extends BasicQueryParams {
  name: string
  status: string
}

/** 列表数据 */
export interface ListItem {
  id: number
  name: string
  desc: string|null
  create_time: string
  status: number
}

/** 表单参数 */
export interface FormParams {
  id?: number
  name: string
  desc?: string|null
}

/** 获取角色节点参数 */
export interface GetRoleNodesParams {
  srid: number
}

/** 修改角色节点参数 */
export interface ModifyRoleNodesParams {
  srid: number
  nodes: string[]
}

/** 用户节点树 */
export interface UserNodeTree {
  title: string
  actions: {
    node: string
    title: string
  }[]
}

/** 角色基本信息 */
export interface Role {
  id: number
  name: string
}
