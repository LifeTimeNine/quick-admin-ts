/** 值类型 */
export enum ValueType {
  TEXT = 1,
  LIST = 2,
  MAP = 3,
  IMG = 4
}

/** 基础配置接口 */
export interface BasicConfig {
  system_name: string
}

/** 列表查询参数 */
export interface ListQueryParams {
  name?: string
  key?:string
}

/** 值类型 */
export type Value = string|string[]|{[key in string]: string}

/** 配置信息 */
export interface ItemInfo {
  id?: number
  key: string
  name: string
  type: number
  value: Value
}
