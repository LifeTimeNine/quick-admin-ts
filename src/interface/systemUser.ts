import { BasicQueryParams } from '.'
import { Role } from './systemRole'

/** 密码登录参数接口 */
export interface PwdLoginParams {
  username: string
  password: string
}

/** 登录返回数据 */
export interface LoginData {
  access_token: string
}

/** 用户信息接口 */
export interface UserInfo {
  username: string
  mobile: string
  email: string|null
  avatar: string|null
  name: string
}

/** 修改密码参数 */
export interface ModifyPasswordParams {
  old_password: string
  new_password: string
  confirm_password: string
}

/** 菜单信息接口 */
export interface Menu {
  id: number
  title: string
  icon: string|null
  url: string
  params: string|null
  children: Array<Menu>
}

/** 列表查询参数 */
export interface ListQueryParams extends BasicQueryParams {
  username: string
  name: string
  status: string
}

/** 列表数据信息 */
export interface ListItem {
  id: number
  avatar: string
  create_time: string
  desc: string
  last_login_ip: string|null
  last_login_time: string|null
  login_num: number
  name: string
  roles: Role[]
  status: number
  username: string
}

/** 表单参数 */
export interface FormParams {
  id?: number
  username: string
  name: string
  desc: string
  rids: number[]
}
