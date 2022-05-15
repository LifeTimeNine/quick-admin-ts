import { BasicActionParams, ModifyStatusParams, SetSortParams } from '@/interface'
import { FormParams } from '@/interface/systemMenu'
import { get, post } from '@/utils/request'

export const nodes = {
  list: 'systemmenu/list',
  recycleList: 'systemmenu/recycleList',
  add: 'systemmenu/add',
  edit: 'systemmenu/edit',
  modifyStatus: 'systemmenu/modifyStatus',
  softDelete: 'systemmenu/softDelete',
  restore: 'systemmenu/restore',
  del: 'systemmenu/delete',
  setSort: 'systemmenu/setSort',
  getUserMenuNodes: 'systemmenu/getUserMenuNodes'
}

export const list = () => get(nodes.list)
export const recycleList = () => get(nodes.recycleList)
export const add = (data: FormParams) => post(nodes.add, data)
export const edit = (data: FormParams) => post(nodes.edit, data)
export const modifyStatus = (data: ModifyStatusParams) => post(nodes.modifyStatus, data)
export const softDelete = (data: BasicActionParams) => post(nodes.softDelete, data)
export const restore = (data: BasicActionParams) => post(nodes.restore, data)
export const del = (data: BasicActionParams) => post(nodes.del, data)
export const setSort = (data: SetSortParams) => post(nodes.setSort, data)
export const getUserMenuNodes = () => get(nodes.getUserMenuNodes)
