export {}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    /** 权限节点 */
    $nodes: {[key: string]: {[key: string]: string}}
    /** 操作 */
    $action: (node: string, data: Object = {}, callback ?: Function) => void
  }
}
