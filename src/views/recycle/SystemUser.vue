<template>
  <div>
    <data-list ref="list" :node="$nodes.systemUser.recycleList">
    <template #search="{options}">
      <el-form-item>
        <el-input v-model="options.username" :placeholder="$t('username')" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="options.name" :placeholder="$t('name')" />
      </el-form-item>
    </template>
    <template #list-column>
      <el-table-column label="ID" prop="id" min-width="65" />
      <el-table-column :label="$t('avatar')" width="70" v-slot="{row}">
        <el-avatar shape="square" :src="row.avatar" fit="fill" />
      </el-table-column>
      <el-table-column :label="$t('username')" prop="username" min-width="100" />
      <el-table-column :label="$t('name')" prop="name" />
      <el-table-column :label="$t('role')" v-slot="{row}">
        <el-tag v-for="(item, index) in row.roles" :key="index" type="info">{{ item.name }}</el-tag>
      </el-table-column>
      <el-table-column :label="$t('create_time')" prop="create_time" min-width="155" />
      <el-table-column :label="$t('last_login_time')" prop="last_login_time" min-width="155" />
      <el-table-column :label="$t('last_login_ip')" prop="last_login_ip" min-width="140" />
      <el-table-column :label="$t('action')" width="220" v-slot="{row}">
        <el-popconfirm :title="$t('message.restore_confirm')" @confirm="$action($nodes.systemUser.restore, {id: row.id}, refresh)">>
          <template #reference>
            <el-link v-auth="$nodes.systemUser.restore" type="success">{{ $t('button.restore') }}</el-link>
          </template>
        </el-popconfirm>
        <el-popconfirm :title="$t('message.permanent_delete_confirm')" @confirm="$action($nodes.systemUser.del, {id: row.id}, refresh)">>
          <template #reference>
            <el-link v-auth="$nodes.systemUser.del" type="danger">{{ $t('button.permanent_delete') }}</el-link>
          </template>
        </el-popconfirm>
      </el-table-column>
    </template>
  </data-list>
  </div>
</template>

<script lang="ts">
import { ComponentDataListInstance } from '@/interface'
import { ListItem, ListQueryParams } from '@/interface/systemUser'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'RecycleSystemUser'
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
