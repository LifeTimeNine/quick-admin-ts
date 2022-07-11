<template>
  <div>
    <el-button v-auth="$nodes.systemMenu.add" type="primary" style="float: right; margin-bottom: 10px;" @click="onAdd">{{ $t('add') }}</el-button>
    <el-table :data="list" border stripe row-key="id" :loading="tableLoading" @row-dblclick="dbClick">
      <el-table-column label="ID" prop="id" />
      <el-table-column :label="$t('sort_weight')" min-width="125" v-slot="{row}">
        <el-input v-model="row.sort" type="number" placeholder="0" min="0" max="100000000" :disabled="!auth($nodes.systemMenu.setSort)" @blur="sortChange(row)" />
      </el-table-column>
      <el-table-column :label="$t('icon')" width="60" v-slot="{row}">
        <svg-icon :icon-class="row.icon" />
      </el-table-column>
      <el-table-column :label="$t('name')" v-slot="{row}">
        <span v-if="row.id">{{ $t(`menu.${row.title}`, row.title) }}</span>
      </el-table-column>
      <el-table-column :label="$t('page_path')" prop="url" min-width="100" show-overflow-tooltip />
      <el-table-column :label="$t('permissions_node')" prop="node" min-width="145" show-overflow-tooltip />
      <el-table-column :label="$t('create_time')" prop="create_time" width="160" />
      <el-table-column :label="$t('action')" width="180" v-slot="{row}">
        <el-link v-auth="$nodes.systemMenu.edit" type="primary" @click="onEdit(row)">{{ $t('edit') }}</el-link>
        <el-link
          v-if="row.status === 1"
          v-auth="$nodes.systemMenu.modifyStatus"
          type="warning"
          @click="$action($nodes.systemMenu.modifyStatus, {id: row.id, enable: 0}, refresh)"
        >{{ $t('button.disable') }}</el-link>
        <el-link
          v-else
          v-auth="$nodes.systemMenu.modifyStatus"
          type="success"
          @click="$action($nodes.systemMenu.modifyStatus, {id: row.id, enable: 1}, refresh)"
        >{{ $t('button.enable') }}</el-link>
        <el-popconfirm :title="$t('message.delete_confirm')" @confirm="$action($nodes.systemMenu.softDelete, {id: row.id}, refresh)">
          <template #reference>
            <el-link v-auth="$nodes.systemMenu.softDelete" type="danger">{{ $t('button.delete') }}</el-link>
          </template>
        </el-popconfirm>
      </el-table-column>
    </el-table>
    <form-dialog ref="form" :rules="rules" v-slot="{row}" @save="save">
      <el-form-item :label="$t('parent_menu')" prop="pid">
        <el-cascader
          v-model="formPids"
          :options="selectList"
          :props="{expendTrigger: 'hover', checkStrictly: true, value: 'id', label: 'title'}"
          style="width: 100%"
        >
        </el-cascader>
      </el-form-item>
      <el-form-item :label="$t('icon')" prop="icon">
        <el-input v-model="row.icon">
          <template #prepend>
            <svg-icon :icon-class="row.icon || ''" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('name')" prop="title">
        <el-input v-model="row.title" />
      </el-form-item>
      <el-form-item :label="$t('page_path')" prop="url">
        <el-autocomplete v-model="row.url" value-key="path" :fetch-suggestions="pathSearch" style="width: 100%" />
      </el-form-item>
      <el-form-item :label="$t('page_param')" prop="params">
        <el-input v-model="row.params" />
      </el-form-item>
      <el-form-item :label="$t('permissions_node')" prop="node">
        <el-autocomplete v-model="row.node" value-key="node" :fetch-suggestions="nodeSearch" v-slot="{item}" style="width: 100%">
          <p>{{ item.node }}</p>
          <p>{{ item.title }}</p>
        </el-autocomplete>
      </el-form-item>
    </form-dialog>
  </div>
</template>

<script lang="ts">
import { ComponentFormDialogInstance } from '@/interface'
import { Lang } from '@/lang'
import { FormParams, ListItem, NodeInfo } from '@/interface/systemMenu'
import { add, edit, getUserMenuNodes, list as getList, setSort } from '@/apis/modules/systemMenu'
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { ElLoadingService, ElMessage } from 'element-plus'
import router from '@/router'
import { RouteRecordRaw } from 'vue-router'
import { whitePaths } from '@/settings'

export default defineComponent({
  name: 'SystemMenu'
})
</script>

<script lang="ts" setup>
import auth from '@/utils/auth'
interface PathInfo {
  path: string
}
const list = ref<ListItem[]>([])
const form = ref<ComponentFormDialogInstance<FormParams>>()
const tableLoading = ref<boolean>(false)
const formPids = ref<number[]>([])
let userMenuNodes: NodeInfo[] = []
const selectList = computed<ListItem[]>(() => {
  return [{ id: 0, title: Lang.text('menu.top_menu'), icon: '', pid: 0, url: '', params: '', node: '', sort: 0, create_time: '', status: 1, children: [] }, ...itemLanguage(list.value)]
})
const rules = {
  pid: [
    { required: true, trigger: 'blur', message: () => Lang.validate('select', { name: 'parent_menu' }) },
    {
      trigger: 'blur',
      validator(rule: any, value: number, callback: Function) {
        if (form.value && form.value.row.id === value) {
          return callback(new Error(Lang.message('not_select_current_menu')))
        }
        return true
      }
    }
  ],
  title: [{ required: true, trigger: 'blur', message: () => Lang.validate('input', { name: 'name' }) }],
  url: [{ required: true, trigger: 'blur', message: () => Lang.validate('input', { name: 'page_path' }) }]
}
const routePaths = ref<PathInfo[]>([])
onMounted(() => {
  routePaths.value = getPaths()
  refresh()
  getUserMenuNodes().then(({ list: list_ }: { list: NodeInfo[] }) => {
    userMenuNodes = list_
  })
})
function refresh() {
  tableLoading.value = true
  getList().then(({ list: list_ }: { list: ListItem[] }) => {
    list.value = list_
  }).finally(() => {
    tableLoading.value = false
  })
}
function onAdd() {
  if (form.value) {
    form.value.open()
  }
}
function onEdit(row: ListItem) {
  if (form.value) {
    form.value.open(row)
    formPids.value = getPids(row.id)
  }
}
function dbClick(row: ListItem) {
  formPids.value = getPids(row.id, []).concat([row.id])
  if (form.value) form.value.open()
}
function nodeSearch(queryStr: string, callback: Function) {
  const nodes: NodeInfo[] = queryStr ? userMenuNodes.filter((item: NodeInfo) => item.node.indexOf(queryStr) === 0) : userMenuNodes
  callback(nodes)
}
function getPids(id: number, defaultPids: number[] = [0]): number[] {
  const search = function(menus: ListItem[], pids: number[] = []): number[] {
    for (const item of menus) {
      if (item.id === id) return pids
      if (item.children && item.children.length > 0) {
        const res = search(item.children, pids.concat([item.id]))
        if (res.length > pids.length + 1) return res
      }
    }
    return pids
  }
  return search(list.value, defaultPids)
}
function itemLanguage(menus: ListItem[]): ListItem[] {
  const menus_: ListItem[] = []
  menus.forEach(item => {
    const item_: ListItem = Object.assign({}, item)
    item_.title = Lang.text(`menu.${item.title}`)
    if (item_.children && item_.children.length > 0) {
      item_.children = itemLanguage(item_.children)
    }
    menus_.push(item_)
  })
  return menus_
}
watch(
  formPids,
  function(value) {
    if (form.value) {
      form.value.row.pid = value[value.length - 1]
    }
  },
  {
    deep: true
  }
)
function save(row: FormParams, shutDown: Function) {
  const loading = ElLoadingService()
  const promise = row.id ? edit(row) : add(row)
  promise.then(() => {
    ElMessage.success(Lang.message('save_success'))
    shutDown()
    refresh()
  }).finally(() => {
    loading.close()
  })
}
function getPaths(): PathInfo[] {
  const getPaths_ = function(routes: RouteRecordRaw[], prefix = '', paths: PathInfo[] = []): PathInfo[] {
    routes.forEach((route: RouteRecordRaw) => {
      if (route.children) {
        paths = getPaths_(route.children, route.path, paths)
      } else {
        const path = prefix ? `${prefix}${prefix === '/' ? '' : '/'}${route.path}` : route.path
        if (!whitePaths.includes(path) && path !== '/*') paths.push({ path })
      }
    })
    return paths
  }
  return getPaths_(router.options.routes)
}
function pathSearch(queryStr: string, callback: Function) {
  const paths = queryStr ? routePaths.value.filter((item: PathInfo) => item.path.indexOf(queryStr) === 0) : routePaths.value
  callback(paths)
}
function sortChange(item: ListItem) {
  setSort({
    id: item.id,
    sort: item.sort
  }).then(() => {
    ElMessage.success(Lang.message('save_success'))
  }).catch(() => {
    ElMessage.error(Lang.message('save_fail'))
  }).finally(() => {
    refresh()
  })
}
</script>

<style lang="scss" scoped>
.el-table :deep() {
  .el-table__row {
    .cell {
      &>.el-link:nth-child(n+2) {
        margin-left: .5em;
      }
    }
  }
}
.el-autocomplete-suggestion li {
  &>p {
    line-height: 1.4em;
    margin: 0;
    &:nth-child(2) {
      font-size: 0.8em;
      color: #909399;
      margin-bottom: 0.8em;
    }
  }
}
</style>
