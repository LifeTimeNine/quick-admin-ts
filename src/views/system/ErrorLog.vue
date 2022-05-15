<template>
  <div>
    <data-list :node="$nodes.systemErrorLog.list">
      <template #search="{options}">
        <el-form-item>
          <el-input v-model="options.hash" :placeholder="$t('hash_value')" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="options.path_info" :placeholder="$t('request_address')" />
        </el-form-item>
      </template>
      <template #list-column>
        <el-table-column label="ID" prop="id" min-width="65" sortable="custom" />
        <el-table-column :label="$t('hash_value')" prop="hash" show-overflow-tooltip />
        <el-table-column :label="$t('app_name')" prop="app_name" min-width="100" />
        <el-table-column :label="$t('request_address')" prop="path_info" min-width="140" />
        <el-table-column :label="$t('error_message')" prop="error_message" min-width="190" show-overflow-tooltip />
        <el-table-column :label="$t('first_happen_time')" prop="happen_time" min-width="190" sortable="custom" />
        <el-table-column :label="$t('last_happen_time')" prop="last_happen_time" min-width="190" sortable="custom" />
        <el-table-column :label="$t('happen_number')" prop="happen_num" min-width="100" />
        <el-table-column :label="$t('resolve_user')" prop="row.resolveUser.username" min-width="110" />
        <el-table-column :label="$t('resolve_time')" prop="resolve_time" width="160" />
        <el-table-column :label="$t('action')" v-slot="{row}" min-width="90">
          <el-link type="primary" @click="onDetail(row)">{{ $t('detail') }}</el-link>
        </el-table-column>
      </template>
    </data-list>
    <el-dialog
      v-model="detailOpened"
      :title="$t('detail')"
      width="50%"
      top="3%"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item :label="$t('app_name')">{{ detail.app_name }}</el-descriptions-item>
        <el-descriptions-item :label="$t('request_address')">{{ detail.path_info }}</el-descriptions-item>
        <el-descriptions-item :label="$t('from_ip')">{{ detail.access_ip }}</el-descriptions-item>
        <el-descriptions-item :label="$t('request_data')">{{ detail.request_param }}</el-descriptions-item>
        <el-descriptions-item :label="$t('error_message')">
          {{ detail.error_message }}
          <el-button type="text" @click="copyTraceData">{{$t('copy_trace_data')}}</el-button>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('error_code')">{{ detail.error_code }}</el-descriptions-item>
        <el-descriptions-item :label="$t('error_file')">{{ detail.error_file }}</el-descriptions-item>
        <el-descriptions-item :label="$t('error_line')">{{ detail.error_line }}</el-descriptions-item>
        <el-descriptions-item :label="$t('first_happen_time')">{{ detail.first_happen_time }}</el-descriptions-item>
        <el-descriptions-item :label="$t('last_happen_time')">{{ detail.last_happen_time }}</el-descriptions-item>
        <el-descriptions-item :label="$t('happen_number')">{{ detail.happen_num }}</el-descriptions-item>
        <el-descriptions-item :label="$t('resolve_user')">{{ detail.resolveUser ? detail.resolveUser.username : '' }}</el-descriptions-item>
        <el-descriptions-item :label="$t('resolve_time')">{{ detail.resolve_time }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailOpened = false">{{$t('button.close')}}</el-button>
        <el-button type="primary">OK</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Clipboard from '@/utils/clipboard'
import { Lang } from '@/lang'
import { ElMessage } from 'element-plus'
import { defineComponent, ref } from 'vue'
import { ListItem } from '@/interface/systemErrorLog'

export default defineComponent({
  name: 'SystemErrorLog'
})
</script>

<script lang="ts" setup>
const detailOpened = ref<boolean>(false)
const detail = ref<ListItem>()
function onDetail(row: ListItem) {
  detail.value = row
  detailOpened.value = true
}
function copyTraceData() {
  if (detail.value) {
    Clipboard.copyText(detail.value.error_trace).then(() => {
      ElMessage.success(Lang.message('copy_success'))
    }).catch(e => {
      ElMessage.error(Lang.message('copy_fail'))
    })
  }
}
</script>

<style lang="scss" scoped>
:deep() .el-descriptions {
  .el-descriptions__cell {
    padding: 2px 11px !important;
  }
  &__label {
    min-width: 8em;
  }
}
</style>
