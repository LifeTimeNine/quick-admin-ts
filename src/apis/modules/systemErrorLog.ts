
import { BasicActionParams } from '@/interface'
import { ListQueryParams } from '@/interface/systemErrorLog'
import { get, post } from '@/utils/request'

export const nodes = {
  list: 'systemerrorlog/list',
  resolve: 'systemerrorlog/resolve'
}

export const list = (query: ListQueryParams) => get(nodes.list, query)
export const resolve = (data: BasicActionParams) => post(nodes.resolve, data)
