import { BasicActionParams, ModifyStatusParams } from '@/interface'
import { FormParams, GetRoleNodesParams, ListQueryParams, ModifyRoleNodesParams } from '@/interface/systemRole'
import { get, post } from '@/utils/request'

export const nodes = {
  getUserRole: 'systemrole/getUserRole',
  getUserNodeTree: 'systemrole/getUserNodeTree',
  list: 'systemrole/list',
  recycleList: 'systemrole/recycleList',
  add: 'systemrole/add',
  edit: 'systemrole/edit',
  modifyStatus: 'systemrole/modifyStatus',
  softDelete: 'systemrole/softDelete',
  restore: 'systemrole/restore',
  del: 'systemrole/delete',
  getRoleNodes: 'systemrole/getRoleNodes',
  modifyRoleNodes: 'systemrole/modifyRoleNodes'
}

export const getUserRole = () => get(nodes.getUserRole)
export const getUserNodeTree = () => get(nodes.getUserNodeTree)
export const list = (query: ListQueryParams) => get(nodes.list, query)
export const recycleList = (query: ListQueryParams) => get(nodes.recycleList, query)
export const add = (data: FormParams) => post(nodes.add, data)
export const edit = (data: FormParams) => post(nodes.edit, data)
export const modifyStatus = (data: ModifyStatusParams) => post(nodes.modifyStatus, data)
export const softDelete = (data: BasicActionParams) => post(nodes.softDelete, data)
export const restore = (data: BasicActionParams) => post(nodes.restore, data)
export const del = (data: BasicActionParams) => post(nodes.del, data)
export const getRoleNodes = (query: GetRoleNodesParams) => get(nodes.getRoleNodes, query)
export const modifyRoleNodes = (data: ModifyRoleNodesParams) => post(nodes.modifyRoleNodes, data)
