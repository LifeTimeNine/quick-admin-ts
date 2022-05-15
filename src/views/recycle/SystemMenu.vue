<template>
  <div>
    <data-list ref="list" :node="$nodes.systemMenu.recycleList" :hide-search="true">
    <template #list-column>
      <el-table-column label="ID" prop="id" />
      <el-table-column :label="$t('sort_weight')" prop="sort" min-width="125" />
      <el-table-column :label="$t('icon')" width="60" v-slot="{row}">
        <svg-icon :icon-class="row.icon" />
      </el-table-column>
      <el-table-column :label="$t('name')" prop="title" />
      <el-table-column :label="$t('page_path')" prop="url" min-width="100" />
      <el-table-column :label="$t('permissions_node')" prop="node" min-width="145" />
      <el-table-column :label="$t('create_time')" prop="create_time" width="160" />
      <el-table-column :label="$t('action')" min-width="220" v-slot="{row}">
        <el-popconfirm :title="$t('message.restore_confirm')" @confirm="$action($nodes.systemMenu.restore, {id: row.id}, refresh)">
          <template #reference>
            <el-link v-auth="$nodes.systemMenu.restore" type="success">{{ $t('button.restore') }}</el-link>
          </template>
        </el-popconfirm>
        <el-popconfirm :title="$t('message.permanent_delete_confirm')" @confirm="$action($nodes.systemMenu.del, {id: row.id}, refresh)">
          <template #reference>
            <el-link v-auth="$nodes.systemMenu.del" type="danger">{{ $t('button.permanent_delete') }}</el-link>
          </template>
        </el-popconfirm>
      </el-table-column>
    </template>
  </data-list>
  </div>
</template>

<script lang="ts">
import { BasicQueryParams, ComponentDataListInstance } from '@/interface'
import { ListItem } from '@/interface/systemMenu'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'RecycleSystemMenu'
})
</script>

<script lang="ts" setup>
const list = ref<ComponentDataListInstance<ListItem, BasicQueryParams>>()
function refresh() {
  if (list.value) list.value.refresh()
}
</script>

<style lang="scss" scoped>

</style>
