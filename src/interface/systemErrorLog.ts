import { BasicQueryParams } from '.'

/** 列表查询参数 */
export interface ListQueryParams extends BasicQueryParams {
  hash: string
  path_info: string
}

/** 列表数据信息 */
export interface ListItem {
  access_ip: string
  app_name: string
  error_code: number
  error_file: string
  error_line: number
  error_message: string
  error_trace: string
  happen_num: number
  happen_time: string
  hash: string
  id: number
  last_happen_time: string
  path_info: string
  request_param: any
  request_time: string
  resolveUser: {
    username: string
  }
  resolve_suid: number
  resolve_time: string
  status: number
}
