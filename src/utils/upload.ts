import { info, partComplete, partInfo, partOptions as getPartOptions } from '@/apis/modules/upload'
import { Lang } from '@/lang'
import { KeyValue } from '@/interface'
import Axios, { AxiosProgressEvent, AxiosRequestHeaders, AxiosResponse } from 'axios'
import SparkMD5 from 'spark-md5'
import { CompletePartInfo, PartInfoOption, PartOption, UploadInfo, UploadOption } from '@/interface/upload'

type Md5Callback = (loaded: number, total: number) => void

class Upload {
  /** 是否是异步上传 */
  private async: boolean
  /** 最大任务数 */
  private maxTaskNum: number
  /** 计算文件MD5之前的回调 */
  private md5BeforeCallback: Function|null
  /** 计算文件MD5进度的回调 */
  private md5ProgressCallback: Md5Callback|null
  /** 计算文件MD5之后的回调 */
  private md5AfterCallback: Function|null
  /** 上传文件之前的回调 */
  private beforeCallback: Function|null
  /** 上传进度回调 */
  private progressCallback: Md5Callback|null
  /** 上传之后回调 */
  private afterCallback: Function|null
  /** 构造函数 */
  constructor() {
    this.async = true
    this.maxTaskNum = 8
    this.md5BeforeCallback = null
    this.md5ProgressCallback = null
    this.md5AfterCallback = null
    this.beforeCallback = null
    this.progressCallback = null
    this.afterCallback = null
  }

  /**
   * 文件切片
   * @param file File对象
   * @param start 开始位置
   * @param end 结束位置
   * @returns Blob
   */
  private slice(file: File, start: number, end: number): Blob {
    return File.prototype.slice.call(file, start, end)
  }

  /**
   * KeyValue 生成FormData
   * @param keyValues keyValue数据列表
   * @returns FormData
   */
  private keyValueToFormData(keyValues: KeyValue<string>[]): FormData {
    const formData = new FormData()
    keyValues.forEach((item: KeyValue<string>) => {
      formData.append(item.key, item.value)
    })
    return formData
  }

  private keyValueToObject(keyValues: KeyValue<string>[]): Object {
    const obj: { [key in string]: string|number|boolean } = {}
    keyValues.forEach((item: KeyValue<string>) => {
      obj[item.key] = item.value
    })
    return obj
  }

  /**
   * 设置是否是异步上传
   * @param async 异步
   * @returns Upload
   */
  public setAsync(async: boolean): Upload {
    this.async = async
    return this
  }

  /**
   * 设置最大上传任务数量（只有在异步的切片上传时生效）
   * @param num 数量
   * @returns Upload
   */
  public setMaxTaskNum(num: number): Upload {
    num = Math.round(num)
    if (num <= 1) num = 1
    this.maxTaskNum = num
    return this
  }

  /**
   * 设置计算文件MD5之前的回调
   * @param callback 回调函数
   * @returns Upload
   */
  public onMd5Before(callback: Function): Upload {
    this.md5BeforeCallback = callback
    return this
  }

  /**
   * 设置计算MD5进度的回调
   * @param callback 回调函数
   * @returns Upload
   */
  public onMd5Progress(callback: Md5Callback): Upload {
    this.md5ProgressCallback = callback
    return this
  }

  /**
   * 设置计算MD5之后的回调
   * @param callback 回调函数
   * @returns Upload
   */
  public onMd5After(callback: Function): Upload {
    this.md5AfterCallback = callback
    return this
  }

  /**
   * 设置上传之前的回调
   * @param callback 回调函数
   * @returns Upload
   */
   public onBefore(callback: Function): Upload {
    this.beforeCallback = callback
    return this
  }

  /**
   * 设置计上传进度的回调
   * @param callback 回调函数
   * @returns Upload
   */
  public onProgress(callback: Md5Callback): Upload {
    this.progressCallback = callback
    return this
  }

  /**
   * 设置上传之后的回调
   * @param callback 回调函数
   * @returns Upload
   */
  public onAfter(callback: Function): Upload {
    this.afterCallback = callback
    return this
  }

  /**
   * 获取文件MD5
   * @param file File对象
   * @returns Promise<string>
   */
  public fileMd5(file: File): Promise<string> {
    // 每一块的大小
    const chunkSize: number = 1024 * 1204 * 5
    // 块数量
    const chunkNum: number = Math.ceil(file.size / chunkSize)
    // 当前块
    let currentChunk = 1
    const spark = new SparkMD5.ArrayBuffer()
    const fileReader = new FileReader()
    if (this.md5BeforeCallback) this.md5BeforeCallback()
    return new Promise((resolve, reject) => {
      const next = () => {
        const start: number = (currentChunk - 1) * chunkSize
        const end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize
        fileReader.readAsArrayBuffer(this.slice(file, start, end))
      }
      fileReader.onload = (e: ProgressEvent<FileReader>): void => {
        if (e.target && e.target.result) {
          spark.append(e.target.result as ArrayBuffer)
          if (this.md5ProgressCallback) this.md5ProgressCallback(currentChunk >= chunkNum ? file.size : currentChunk * chunkSize, file.size)
          if (currentChunk >= chunkNum) {
            const md5 = spark.end()
            if (this.md5AfterCallback) this.md5AfterCallback(md5)
            resolve(md5)
          } else {
            currentChunk++
            next()
          }
        }
      }
      fileReader.onerror = () => {
        reject(new Error(Lang.message('file_read_fail')))
      }
      next()
    })
  }

  /**
   * 上传文件（小文件直传）
   * @param file File对象
   * @returns Promise<string>
   */
  public save(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      this.fileMd5(file).then((md5: string) => {
        info({
          fileName: file.name,
          fileMd5: md5
        }).then(({ map: { url, options } }: { map: UploadInfo<UploadOption> }) => {
          if (!options) {
            resolve(url)
          } else {
            if (this.afterCallback) this.afterCallback()
            const body = this.keyValueToFormData(options.body)
            body.append(options.file_key, file)
            Axios.request({
              url: options.server,
              method: options.method,
              headers: this.keyValueToObject(options.header) as AxiosRequestHeaders,
              data: body,
              onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                if (this.progressCallback) this.progressCallback(progressEvent.loaded, progressEvent.total || 0)
              }
            }).then((response: AxiosResponse) => {
              if (response.status === 200) {
                if (this.afterCallback) this.afterCallback(url)
                resolve(url)
              } else {
                return Promise.reject(new Error(Lang.message('upload_fail')))
              }
            }).catch(e => {
              reject(e)
            })
          }
        }).catch(e => {
          reject(e)
        })
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * 切片上传（大文件切片上传）
   * @param file File对象
   * @returns Promise<string>
   */
  public partSave(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      this.fileMd5(file).then((md5: string) => {
        partInfo({
          fileName: file.name,
          fileMd5: md5
        }).then(({ map: { url, options } }: { map: UploadInfo<PartInfoOption> }) => {
          if (!options) {
            resolve(url)
          } else {
            if (this.beforeCallback) this.beforeCallback()
            /** 单个切片大小 */
            const partSize: number = Math.floor(options.part_size) * 1024 * 1024
            /** 上传ID */
            const uploadId: string = options.upload_id
            /** 切片数量 */
            const partNum: number = Math.ceil(file.size / partSize)
            /** 已申请切片数量 */
            let applyNum = 0
            /** 切片参数列表 */
            const partOptions: PartOption[] = []
            /** 已完成切片信息列表 */
            const completePart: { [key in number]: { completeSize: number, etag: null|string } } = {}
            /** 正在进行的任务数量 */
            let taskNum = 0
            /** 异常状态 */
            let errorStatus = false
            /** 获取参数的任务数量 */
            let getOptionsTaskNum = 0

            const next = (): undefined => {
              if (errorStatus) return undefined
              if (taskNum >= this.maxTaskNum) return undefined
              if (partOptions.length <= 4 && applyNum < partNum && getOptionsTaskNum === 0) {
                const start = applyNum + 1
                const end = start + 10 >= partNum ? partNum + 1 : start + 10
                getPartOptions({
                  fileName: file.name,
                  fileMd5: md5,
                  uploadId,
                  partNumbers: Array.from({ length: end - start }, (v: any, k: number) => start + k).join(',')
                }).then(({ list }: { list: PartOption[] }) => {
                  list.forEach((item: PartOption) => {
                    partOptions.push(item)
                    applyNum++
                  })
                  getOptionsTaskNum--
                  next()
                }).catch(e => {
                  errorStatus = true
                  reject(e)
                })
                getOptionsTaskNum++
              }
              if (!this.async && taskNum >= 1) return undefined
              if (partOptions.length > 0) {
                const option = partOptions.shift() as PartOption
                const start = (option.part_number - 1) * partSize
                const end = start + partSize >= file.size ? file.size : start + partSize
                let data = null
                if (option.body && option.file_key) {
                  data = this.keyValueToFormData(option.body)
                  data.append(option.file_key, this.slice(file, start, end))
                } else {
                  data = this.slice(file, start, end)
                }
                Axios.request({
                  url: option.server,
                  method: option.method,
                  headers: this.keyValueToObject(option.header) as AxiosRequestHeaders,
                  data: data,
                  onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                    completePart[option.part_number] = { completeSize: progressEvent.loaded, etag: null }
                    if (this.progressCallback) this.progressCallback(Object.values(completePart).map(item => item.completeSize).reduce((total, cur) => total + cur, 0), file.size)
                  }
                }).then((response: AxiosResponse) => {
                  if (response.status !== 200 && response.status !== 204) {
                    errorStatus = true
                  } else {
                    taskNum--
                    completePart[option.part_number].etag = response.data.etag || response.headers.etag
                    if (taskNum === 0 && partOptions.length === 0 && applyNum === partNum) {
                      if (this.afterCallback) this.afterCallback()
                      const parts: CompletePartInfo[] = []
                      for (const partNumber in completePart) {
                        parts.push({ partNumber: parseInt(partNumber), etag: completePart[partNumber].etag as string })
                      }
                      partComplete({
                        fileName: file.name,
                        fileMd5: md5,
                        uploadId,
                        parts
                      }).then(() => {
                        resolve(url)
                      }).catch(e => {
                        reject(e)
                      })
                    } else {
                      next()
                    }
                  }
                }).catch(e => {
                  errorStatus = true
                  reject(e)
                })
                taskNum++
              }
            }
            next()
          }
        }).catch(e => {
          reject(e)
        })
      }).catch(e => {
        reject(e)
      })
    })
  }
}

export default Upload
