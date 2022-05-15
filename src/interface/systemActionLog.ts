import { BasicQueryParams } from '.'

/** 列表数据 */
export interface ListItem {
  id: number
  node: string
  node_title: string
  request_ip: string
  request_param: {[key in string]: any}
  request_time: string
  response_code: number
  response_content: string
  run_time: string
  systemUser: {
    username: string
    avatar: string
    name: string
  }
}

/** 列表查询参数 */
export interface ListQueryParams extends BasicQueryParams {
  node?: string
  username?: string
}
