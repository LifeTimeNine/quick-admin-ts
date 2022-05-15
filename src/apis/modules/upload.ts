import { CompleteParams, InfoParams, PartOptionParams } from '@/interface/upload'
import { post } from '@/utils/request'

export const nodes = {
  info: 'upload/info',
  partInfo: 'upload/partInfo',
  partOptions: 'upload/partOptions',
  partComplete: 'upload/partComplete'
}

export const info = (data: InfoParams) => post(nodes.info, data)
export const partInfo = (data: InfoParams) => post(nodes.partInfo, data)
export const partOptions = (data: PartOptionParams) => post(nodes.partOptions, data)
export const partComplete = (data: CompleteParams) => post(nodes.partComplete, data)
