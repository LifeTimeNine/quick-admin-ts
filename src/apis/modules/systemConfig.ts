import { BasicActionParams } from '@/interface'
import { ListQueryParams } from '@/interface/systemActionLog'
import { ItemInfo } from '@/interface/systemConfig'
import { get, post } from '@/utils/request'

export const nodes = {
  basic: 'systemconfig/basic',
  list: 'systemconfig/list',
  add: 'systemconfig/add',
  edit: 'systemconfig/edit',
  del: 'systemconfig/delete'
}

export const basic = () => get(nodes.basic)
export const list = (query: ListQueryParams) => get(nodes.list, query)
export const add = (data: ItemInfo) => post(nodes.add, data)
export const edit = (data: ItemInfo) => post(nodes.edit, data)
export const del = (data: BasicActionParams) => post(nodes.del, data)
