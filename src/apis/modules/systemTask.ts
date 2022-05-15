import { BasicActionParams, ModifyStatusParams } from '@/interface'
import { FormParams, ListQueryParams } from '@/interface/systemTask'
import { get, post } from '@/utils/request'

export const nodes = {
  status: 'systemtask/status',
  list: 'systemtask/list',
  add: 'systemtask/add',
  edit: 'systemtask/edit',
  modifyStatus: 'systemtask/modifyStatus',
  del: 'systemtask/delete',
  logList: 'systemtask/logList',
  exec: 'systemtask/exec'
}

export const status = () => get(nodes.status)
export const list = (query: ListQueryParams) => get(nodes.list, query)
export const add = (data: FormParams) => post(nodes.add, data)
export const edit = (data: FormParams) => post(nodes.edit, data)
export const modifyStatus = (data: ModifyStatusParams) => post(nodes.modifyStatus, data)
export const del = (data: BasicActionParams) => post(nodes.del, data)
export const logList = (query: BasicActionParams) => get(nodes.logList, query)
export const exec = (data: BasicActionParams) => post(nodes.exec, data)
