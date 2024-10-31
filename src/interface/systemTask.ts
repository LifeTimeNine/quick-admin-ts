import { BasicQueryParams } from '.'

/** 列表查询参数 */
export interface ListQueryParams extends BasicQueryParams {
  title: string
  status: string
}

/** 列表数据 */
export interface ListItem {
  args: string
  exec_file: string
  create_time: string
  cron: string
  exec_num: number
  exec_status: number
  fail_num: number
  id: number
  last_exec_result: number|null
  last_exec_time: string|null
  next_exec_time: string|null
  status: number
  success_num: number
  title: string
  type: 1|2
}

/** 表单参数 */
export interface FormParams {
  id?: number
  title: string
  exec_file: string
  args: string
  type: 1|2
  cron?: string
}

/** 服务状态 */
export interface ServerStatus {
  command: string
  running: false
}

/** 执行日志信息 */
export interface ExecLogInfo {
  start_time: string
  end_time: string
  id: number
  out: string
  err: string
  result: number
  runtime: string
}
