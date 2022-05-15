import { BasicQueryParams } from '.'

/** 列表查询参数 */
export interface ListQueryParams extends BasicQueryParams {
  title: string
  status: string
}

/** 列表数据 */
export interface ListItem {
  command: string
  create_time: string
  crontab: string
  exec_num: number
  exec_status: number
  id: number
  last_exec_result: number|null
  last_exec_time: number|null
  params: string|null
  status: number
  title: string
  type: number
}

/** 表单参数 */
export interface FormParams {
  id?: number
  title: string
  command: string
  params: string
  type: number
  crontab?: string
}

/** 服务状态 */
export interface ServerStatus {
  command: string
  running: false
}

/** 执行日志信息 */
export interface ExecLogInfo {
  exec_time: string
  id: number
  output: string
  pid: number
  result: number
  run_time: string
  stid: number
}
