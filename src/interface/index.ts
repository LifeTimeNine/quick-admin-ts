
/** Key-Value 接口 */
export interface KeyValue<T> {
  key: string
  value: T
}

/** 语言标志 */
export interface LanguageSymbol {
  request: string
  elementPlus: string
  tinymce: string
}

/** 基础查询参数 */
export interface BasicQueryParams {
  page?: number
  limit?: number
  sort_rule?: string|null
}

/** 操作基础请求参数 */
export interface BasicActionParams {
  id: number
}

/** 修改状态参数 */
export interface ModifyStatusParams extends BasicActionParams {
  enable: 0|1|boolean
}

/** 设置排序权重参数 */
export interface SetSortParams extends BasicActionParams {
  sort: number
}

/** 表单对话框实例接口 */
export interface ComponentFormDialogInstance<T> {
  /**
   * 打开对话框
   * @param row   默认数据
   * @param title 对话框标题
   */
  open: (row?: T, title?: string) => void
  /** 数据集 */
  row: T
}

/** 数据列表实例接口 */
export interface ComponentDataListInstance<R, Q> {
  /** 刷新列表 */
  refresh: () => void
  /** 重置列表 */
  reset: () => void
  /** 列表数据 */
  list: R[]
  /** 总数 */
  total: number
  /** 查询参数 */
  query: Q
}
