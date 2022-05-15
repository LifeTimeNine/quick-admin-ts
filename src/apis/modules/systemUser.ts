import { BasicActionParams, ModifyStatusParams } from '@/interface'
import { FormParams, ListQueryParams, ModifyPasswordParams, PwdLoginParams, UserInfo } from '@/interface/systemUser'
import { get, post } from '@/utils/request'

export const nodes = {
  pwdLogin: 'systemuser/pwdLogin',
  logout: 'systemuser/logout',
  userInfo: 'systemuser/userInfo',
  getMenu: 'systemuser/getMenu',
  refresh: 'systemuser/refresh',
  editUserInfo: 'systemuser/editUserInfo',
  modifyPwd: 'systemuser/modifyPwd',
  list: 'systemuser/list',
  recycleList: 'systemuser/recycleList',
  add: 'systemuser/add',
  edit: 'systemuser/edit',
  modifyStatus: 'systemuser/modifyStatus',
  softDelete: 'systemuser/softDelete',
  restore: 'systemuser/restore',
  del: 'systemuser/delete',
  resetPwd: 'systemuser/resetPwd'
}

export const pwdLogin = (data: PwdLoginParams) => post(nodes.pwdLogin, data)
export const logout = () => get(nodes.logout)
export const userInfo = () => get(nodes.userInfo)
export const getMenu = () => get(nodes.getMenu)
export const refresh = () => get(nodes.refresh)
export const editUserInfo = (data: UserInfo) => post(nodes.editUserInfo, data)
export const modifyPwd = (data: ModifyPasswordParams) => post(nodes.modifyPwd, data)
export const list = (query: ListQueryParams) => get(nodes.list, query)
export const recycleList = (query: ListQueryParams) => get(nodes.recycleList, query)
export const add = (data: FormParams) => post(nodes.add, data)
export const edit = (data: FormParams) => post(nodes.edit, data)
export const modifyStatus = (data: ModifyStatusParams) => post(nodes.modifyStatus, data)
export const softDelete = (data: BasicActionParams) => post(nodes.softDelete, data)
export const restore = (data: BasicActionParams) => post(nodes.restore, data)
export const del = (data: BasicActionParams) => post(nodes.del, data)
export const resetPwd = (data: BasicActionParams) => post(nodes.resetPwd, data)
