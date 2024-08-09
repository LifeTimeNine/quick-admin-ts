import { KeyValue } from '.'

/** 获取上传信息参数接口 */
export interface InfoParams {
  fileName: string
  fileMd5: string
}

/** 上传直传参数接口 */
export interface UploadOption {
  server: string
  method: string
  content_type: string
  header: KeyValue<string>[]
  query: KeyValue<string>[]
  body: KeyValue<string>[]
  file_key: string
}

/** 上传切片上传参数接口 */
export interface PartOption {
  server: string
  method: string
  content_type: string
  header: KeyValue<string>[]
  query: KeyValue<string>[]
  body?: KeyValue<string>[]
  file_key?: string
  part_number: number
}

/** 上传接口切片参数 */
export interface PartInfoOption {
  part_size: number
  upload_id: string
}

/** 获取上传信息返回的数据 */
export interface UploadInfo<T> {
  url: string
  options: T|null
}

/** 获取切片参数信息API的参数接口 */
export interface PartOptionParams {
  fileName: string
  fileMd5: string
  uploadId: string
  partNumbers: string
}

/** 上传完成切片信息 */
export interface CompletePartInfo {
  partNumber: number
  etag: string
}

/** 上传完成请求参数 */
export interface CompleteParams {
  fileName: string
  fileMd5: string
  uploadId: string
  parts: CompletePartInfo[]
}
