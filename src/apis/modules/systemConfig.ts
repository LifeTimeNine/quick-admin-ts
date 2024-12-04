import { ItemInfo, SaveForm } from '@/interface/systemConfig'
import { get, post } from '@/utils/request'

export const nodes = {
  basic: 'systemconfig/basic',
  list: 'systemconfig/list',
  edit: 'systemconfig/edit'
}

export const basic = () => get(nodes.basic)
export const list = () => get(nodes.list)
export const edit = (data: SaveForm) => post(nodes.edit, data)
