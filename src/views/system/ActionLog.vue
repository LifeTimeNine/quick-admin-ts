<template>
  <div>
    <data-list :node="$nodes.systemActionLog.list">
      <template #search="{options}">
        <el-form-item>
          <el-input v-model="options.node" :placeholder="$t('permissions_node')" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="options.username" :placeholder="$t('username')" />
        </el-form-item>
      </template>
      <template #list-column>
        <el-table-column label="ID" prop="id" sortable="custom" min-width="65" />
        <el-table-column :label="$t('action_user')" v-slot="{row}" min-width="140">
          <span>{{ row.systemUser.username }}</span>
        </el-table-column>
        <el-table-column :label="$t('permissions_node')" prop="node" min-width="155" />
        <el-table-column :label="$t('action_name')" prop="node_title" min-width="130" />
        <el-table-column :label="$t('action_time')" prop="request_time" width="160" />
        <el-table-column :label="$t('from_ip')" prop="request_ip" min-width="120" />
        <el-table-column :label="$t('action')" v-slot="{row}" min-width="90">
          <el-link type="primary" @click="onDetail(row)">{{ $t('detail') }}</el-link>
        </el-table-column>
      </template>
    </data-list>
    <el-dialog
      v-model="detailOpened"
      :title="$t('detail')"
      width="60%"
    >
    <el-descriptions :column="1" border>
      <el-descriptions-item :label="$t('permissions_node')">{{ detail.node }}</el-descriptions-item>
      <el-descriptions-item :label="$t('action_name')">{{ detail.node_title }}</el-descriptions-item>
      <el-descriptions-item :label="$t('action_user')">{{ detail.systemUser ? detail.systemUser.username : '' }}</el-descriptions-item>
      <el-descriptions-item :label="$t('action_time')">{{ detail.request_time }}</el-descriptions-item>
      <el-descriptions-item :label="$t('from_ip')">{{ detail.request_ip }}</el-descriptions-item>
      <el-descriptions-item :label="$t('request_data')">{{ detail.request_param }}</el-descriptions-item>
      <el-descriptions-item :label="$t('response_code')">{{ detail.response_code }}</el-descriptions-item>
      <el-descriptions-item :label="$t('response_content')">{{ detail.response_content }}</el-descriptions-item>
    </el-descriptions>
      <template #footer>
        <el-button @click="detailOpened = false">{{ $t('button.close') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { ListItem } from '@/interface/systemActionLog'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'SystemActionLog'
})
</script>

<script lang="ts" setup>
const detailOpened = ref<boolean>(false)
const detail = ref<ListItem>()
function onDetail(row: ListItem) {
  detail.value = row
  detailOpened.value = true
}
</script>

<style lang="scss" scoped>
:deep() .el-descriptions {
  &__label {
    min-width: 7em;
  }
}
</style>
