import { apiAppName } from '@/settings'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ElLoadingService, ElMessage } from 'element-plus'
import { getToken } from './token'
import store from '@/store'
import { getSymbol, Lang } from '@/lang'
import router from '@/router'

/**
 * 请求对象
 */
const request: AxiosInstance = axios.create({
  baseURL: `${process.env.VUE_APP_BASE_API}/${apiAppName}/`,
  timeout: 10000
})

/**
 * 异常状态码
 */
export const ErrorCode = {
  // 正常
  normal: 0,
  // 参数异常
  param_error: 10001,
  // 操作失败
  action_error: 10002,
  // 数据不存在
  data_not_exist: 10003,
  // Token 异常
  token_error: 10101,
  // Token 过期
  token_expire: 10102,
  // Token 刷新失败
  token_refresh_fail: 10103,
  // Token 失效
  token_failure: 10104,
  // 用户被禁用
  user_disable: 10201,
  // 用户被登录
  user_login: 10202,
  // 权限不足
  permission_denied: 10203
}

// 数据接口
export interface Data {
  map: any
  list: any[]
  limit: number
  page: number
  total: number
  items: any[]
}
// 响应数据接口
interface ResponseData {
  code: number
  message: string
  data: Data
}

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.headers) {
      config.headers.Authorization = `Token ${getToken() || ''}`
      config.headers['Accept-Language'] = getSymbol().request
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, message, data }: ResponseData = response.data
    if (code !== ErrorCode.normal) {
      if ([ErrorCode.param_error, ErrorCode.permission_denied].includes(code)) {
        ElMessage.warning(message)
      } else if (
        [ErrorCode.token_error, ErrorCode.token_expire, ErrorCode.token_failure, ErrorCode.user_login].includes(code) ||
        ErrorCode.user_disable === code
      ) {
        ElMessage.error(message)
        // 删除Token 转到登录页面
        store.dispatch('user/removeToken')
        router.replace({ name: 'Login', query: { redirect: router.currentRoute.value.path } })
      } else {
        ElMessage.error(message)
      }
      return Promise.reject(message)
    } else {
      return data as unknown as AxiosResponse
    }
  },
  error => {
    ElMessage.error(Lang.message('request_error'))
    return Promise.reject(error)
  }
)

/**
 * GET 请求
 * @param node 节点
 * @param query 请求 Query 参数
 * @param config 其他 Axios 支持的参数
 * @returns Promise
 */
export function get(node: string, query: Object = {}, config: AxiosRequestConfig = {}): Promise<Data> {
  return request.get(node, Object.assign({}, { params: query }, config))
}

/**
 * POST 请求
 * @param node  节点
 * @param data  请求 Data 数据
 * @param config  其他 Axios支持的参数
 * @returns Promise
 */
export function post(node: string, data: Object = {}, config: AxiosRequestConfig = {}): Promise<Data> {
  return request.post(node, data, config)
}

/**
 * 快捷操作方法
 * @param node 节点
 * @param data 请求数据
 * @param callback 成功之后执行的函数
 */
export function action(node: string, data: Object = {}, callback?: Function): void {
  const loading = ElLoadingService()
  post(node, data).then(() => {
    ElMessage.success(Lang.message('action_success'))
    if (callback) callback()
  }).finally(() => {
    loading.close()
  })
}

export default request
