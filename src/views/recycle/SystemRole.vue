<template>
  <div>
    <data-list ref="list" :node="$nodes.systemRole.recycleList">
    <template #search="{options}">
      <el-form-item>
        <el-input v-model="options.name" :placeholder="$t('name')" />
      </el-form-item>
    </template>
    <template #list-column>
      <el-table-column label="ID" prop="id" min-width="60" />
      <el-table-column :label="$t('name')" prop="name" />
      <el-table-column :label="$t('description')" prop="desc" />
      <el-table-column :label="$t('create_time')" prop="create_time" width="160" />
      <el-table-column :label="$t('action')" width="220" v-slot="{row}">
        <el-popconfirm :title="$t('message.restore_confirm')" @confirm="$action($nodes.systemRole.restore, {id: row.id}, refresh)">
          <template #reference>
            <el-link v-auth="$nodes.systemRole.restore" type="success">{{ $t('button.restore') }}</el-link>
          </template>
        </el-popconfirm>
        <el-popconfirm :title="$t('message.permanent_delete_confirm')" @confirm="$action($nodes.systemRole.del, {id: row.id}, refresh)">
          <template #reference>
            <el-link v-auth="$nodes.systemRole.del" type="danger">{{ $t('button.permanent_delete') }}</el-link>
          </template>
        </el-popconfirm>
      </el-table-column>
    </template>
  </data-list>
  </div>
</template>

<script lang="ts">
import { ComponentDataListInstance } from '@/interface'
import { ListItem, ListQueryParams } from '@/interface/systemRole'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'RecycleSystemRole'
})
</script>

<script lang="ts" setup>
const list = ref<ComponentDataListInstance<ListItem, ListQueryParams>>()
function refresh() {
  if (list.value) list.value.refresh()
}
</script>

<style lang="scss" scoped>

</style>
