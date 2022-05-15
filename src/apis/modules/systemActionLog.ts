import { ListQueryParams } from '@/interface/systemActionLog'
import { get } from '@/utils/request'

export const nodes = {
  list: 'systemactionlog/list'
}

export const list = (query: ListQueryParams) => get(nodes.list, query)
