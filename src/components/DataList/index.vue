<template>
  <div>
    <el-form v-if="!props.hideSearch" :model="queryOptions" :inline="true">
      <slot name="search" :options="queryOptions" />
      <el-form-item>
        <el-button type="primary" @click="refresh">{{ $t('button.search') }}</el-button>
        <el-button @click="reset">{{ $t('button.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <div class="actions">
      <slot name="actions" />
    </div>
    <el-table
      ref="table"
      v-loading="tableLoading"
      :data="list"
      border
      stripe
      @sort-change="sortChange"
    >
      <template #default>
        <slot name="list-column" />
      </template>
    </el-table>
    <el-pagination
      v-if="!props.hidePagination"
      v-model:current-page="queryOptions.page"
      v-model:page-size="queryOptions.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background
      :pager-count="7"
      @size-change="pageSizeChange"
      @current-change="pageChange"
    />
  </div>
</template>

<script lang="ts">
import { BasicQueryParams } from '@/interface'
import { get } from '@/utils/request'
import { defineComponent, withDefaults, defineProps, ref, watch, onMounted, defineExpose } from 'vue'

export default defineComponent({
  name: 'DataList'
})
</script>

<script lang="ts" setup>
interface Props {
  hideSearch?: boolean
  hidePagination?: boolean
  node: string
  extendQuery?: Object
}

const props = withDefaults(defineProps<Props>(), {
  hideSearch: false,
  hidePagination: false,
  extendQuery: () => ({})
})

const defaultQueryOptions = (): BasicQueryParams => ({
  page: 1,
  limit: 10,
  sort_rule: null
})
const tableLoading = ref<boolean>(false)
const queryOptions = ref<BasicQueryParams>(defaultQueryOptions())
const list = ref<any>([])
const total = ref<number>(0)

function refresh() {
  tableLoading.value = true
  get(
    props.node,
    Object.assign({}, props.extendQuery, queryOptions.value)
  ).then(({ items, limit, page, total: total_ }:{ items: any[], limit: number, page: number, total: number }) => {
    list.value = items
    total.value = total_
    queryOptions.value.limit = limit
    queryOptions.value.page = page
  }).finally(() => {
    tableLoading.value = false
  })
}

function reset() {
  queryOptions.value = defaultQueryOptions()
  refresh()
}

function pageChange(page: number) {
  queryOptions.value.page = page
  refresh()
}

function pageSizeChange(limit: number) {
  queryOptions.value.limit = limit
  refresh()
}

function sortChange({ prop, order }: { prop: string, order: string }) {
  if (prop) {
    queryOptions.value.sort_rule = `${prop}.${order === 'ascending' ? 'asc' : 'desc'}`
  } else {
    queryOptions.value.sort_rule = null
  }
  refresh()
}

watch(
  () => props.extendQuery,
  function() {
    refresh()
  }
)

onMounted(() => {
  refresh()
})

defineExpose({
  refresh,
  reset,
  list,
  total,
  queryOptions
})

</script>

<style lang="scss" scoped>
.actions :deep(){
  text-align: right;
  &>* {
    margin-bottom: 10px;
  }
}

.el-table :deep() {
  margin-bottom: 10px;
  .el-table__row {
    .cell {
      &>.el-link:nth-child(n+2) {
        margin-left: .5em;
      }
    }
  }
}
</style>
