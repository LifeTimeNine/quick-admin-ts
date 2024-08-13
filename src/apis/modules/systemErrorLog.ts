
import { ListQueryParams, ResolveParams } from '@/interface/systemErrorLog'
import { get, post } from '@/utils/request'

export const nodes = {
  list: 'systemerrorlog/list',
  resolve: 'systemerrorlog/resolve'
}

export const list = (query: ListQueryParams) => get(nodes.list, query)
export const resolve = (data: ResolveParams) => post(nodes.resolve, data)
