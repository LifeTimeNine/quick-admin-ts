<template>
  <div>
    <el-card :body-style="{padding: '0 20px'}">
      <p class="service-status-box">
        <span>
          {{ $t('service_status') }}:
          <el-tag v-if="serverStatus.running" type="success">{{ $t('running') }}</el-tag>
          <el-tag v-else type="warning">{{ $t('stop') }}</el-tag>
        </span>
        <span>{{ $t('start_command') }}: <el-link type="info" @click="copyCommand">{{ serverStatus.command }}</el-link></span>
      </p>
    </el-card>
    <data-list ref="list" :node="$nodes.systemTask.list">
      <template #search="{options}">
        <el-form-item>
          <el-input v-model="options.title" :placeholder="$t('name')" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="options.status" :placeholder="$t('status')">
            <el-option :label="$t('all')" value="" />
            <el-option :label="$t('enable')" value="1" />
            <el-option :label="$t('disable')" value="2" />
          </el-select>
        </el-form-item>
      </template>
      <template #actions>
        <el-button v-auth="$nodes.systemTask.add" type="primary" @click="onAdd">{{ $t('button.add') }}</el-button>
      </template>
      <template #list-column>
        <el-table-column label="ID" prop="id" width="65" sortable="custom" />
        <el-table-column :label="$t('task_name')" prop="title" min-width="100" />
        <el-table-column :label="$t('task_info')" min-width="180" v-slot="{row}">
          <div>{{ $t('command_info') }}: <span>{{ row.exec_file }}</span></div>
          <div>{{ $t('params_info') }}: <span>{{ row.args || '' }}</span></div>
          <div>{{ $t('execute_type') }}: <span>{{ row.type === 2 ? $t('manual_execute') : row.cron }}</span></div>
        </el-table-column>
        <el-table-column :label="$t('execute_info')" min-width="255" v-slot="{row}">
          <div>{{ $t('execute_number') }}: <span>{{ row.exec_num }}</span></div>
          <div>{{ $t('last_execute_time') }}: <span>{{ row.last_exec_time }}</span></div>
          <div>{{ $t('last_execute_result') }}: <el-tag v-if="row.last_exec_result" :type="row.last_exec_result === 1 ? 'success' : 'danger'">{{ row.last_exec_result === 1 ? $t('success') : $t('fail') }}</el-tag></div>
        </el-table-column>
        <el-table-column :label="$t('current_status')" min-width="120" v-slot="{row}">
          <el-tag :type="row.exec_status === 1 ? 'info' : 'success'" effect="dark">{{ row.exec_status === 1 ? $t('waiting') : $t('running') }}</el-tag>
        </el-table-column>
        <el-table-column :label="$t('create_time')" prop="create_time" width="160" />
        <el-table-column :label="$t('action')" width="180" v-slot="{row}">
          <el-link v-if="serverStatus.running" v-auth="$nodes.systemTask.exec" @click="$action($nodes.systemTask.exec, {id: row.id})">{{ $t('button.execute') }}</el-link>
          <el-link v-auth="$nodes.systemTask.logList" type="info" @click="onLog(row)">{{ $t('button.log') }}</el-link>
          <el-link v-auth="$nodes.systemTask.edit" type="primary" @click="onEdit(row)">{{ $t('button.edit') }}</el-link>
          <el-link v-if="row.status === 1" v-auth="$nodes.systemTask.modifyStatus" type="warning" @click="$action($nodes.systemTask.modifyStatus, {id: row.id, enable: 0}, refresh)">{{ $t('button.disable') }}</el-link>
          <el-link v-else v-auth="$nodes.systemTask.modifyStatus" type="success" @click="$action($nodes.systemTask.modifyStatus, {id: row.id, enable: 1}, refresh)">{{ $t('button.enable') }}</el-link>
          <el-popconfirm :title="$t('message.delete_confirm')" class="delete-btn" @confirm="$action($nodes.systemTask.del, {id: row.id})">
            <template #reference>
              <el-link v-auth="$nodes.systemTask.del" type="danger">{{ $t('button.delete') }}</el-link>
            </template>
          </el-popconfirm>
        </el-table-column>
      </template>
    </data-list>
    <form-dialog ref="form" :rules="formRules" @save="save" v-slot="{row}">
      <el-form-item :label="$t('task_name')" prop="title">
        <el-input v-model="row.title" />
      </el-form-item>
      <el-form-item :label="$t('task_command')" prop="exec_file">
        <el-input v-model="row.exec_file" />
      </el-form-item>
      <el-form-item :label="$t('command_params')" prop="args">
        <el-input v-model="row.args" />
      </el-form-item>
      <el-form-item :label="$t('task_type')" prop="type">
        <el-radio-group v-model="row.type">
          <el-radio-button :label="1">{{ $t('timing_execute') }}</el-radio-button>
          <el-radio-button :label="2">{{ $t('manual_execute') }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="row.type === 1" :label="$t('timing_params')" prop="cron" :required="true">
        <el-input v-model="row.cron" />
      </el-form-item>
    </form-dialog>
    <el-dialog
      v-model="execLogOpened"
      :title="$t('execute_log')"
      width="70%"
      :destroy-on-close="true"
      top="3%"
    >
      <data-list :node="$nodes.systemTask.logList" :extend-query="{stid: execLogTaskId}" :hide-search="true">
        <template #list-column>
          <el-table-column label="ID" prop="id" sortable="custom" width="65" />
          <el-table-column :label="$t('start_time')" prop="start_time" min-width="160" />
          <el-table-column :label="$t('end_time')" prop="end_time" min-width="160" />
          <el-table-column :label="$t('running_time')" min-width="100" v-slot="{row}">
            {{ row.runtime }} S
          </el-table-column>
          <el-table-column :label="$t('execute_result')" v-slot="{row}" min-width="90">
            <el-tag v-if="row.result === 2" type="danger" size="small" effect="dark">{{ $t('fail') }}</el-tag>
            <el-tag v-else-if="row.result === 1" type="success" size="small" effect="dark">{{ $t('success') }}</el-tag>
          </el-table-column>
          <el-table-column :label="$t('action')" min-width="90" v-slot="{row}">
            <el-link type="primary" @click="onOutput(row)">{{ $t('output_content') }}</el-link>
          </el-table-column>
        </template>
      </data-list>
      <template #footer>
        <el-button @click="execLogOpened = false">{{ $t('button.close') }}</el-button>
      </template>
    </el-dialog>
    <el-dialog
      v-model="outputOpened"
      :title="$t('output_content')"
      width="50%"
      custom-class="task-log-dialog"
    >
      <el-scrollbar class="task-log-output">
        <div v-html="formatOutputContent" />
      </el-scrollbar>
      <template #footer>
        <el-button @click="outputOpened = false">{{ $t('button.close') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref } from 'vue'
import { ExecLogInfo, FormParams, ListItem, ListQueryParams, ServerStatus } from '@/interface/systemTask'
import { add, edit, status } from '@/apis/modules/systemTask'
import Clipboard from '@/utils/clipboard'
import { ElLoadingService, ElMessage } from 'element-plus'
import { Lang } from '@/lang'
import { ComponentDataListInstance, ComponentFormDialogInstance } from '@/interface'

export default defineComponent({
  name: 'SystemTask'
})
</script>

<script lang="ts" setup>
const serverStatus = ref<ServerStatus>({ command: '', running: false })
const list = ref<ComponentDataListInstance<ListItem, ListQueryParams>>()
const formRules = {
  title: [{ required: true, trigger: 'blur', message: () => Lang.validate('input', { name: 'name' }) }],
  exec_file: [{ required: true, message: () => Lang.validate('input', { name: 'task_command' }), trigger: 'blur' }],
  args: [{ required: true, message: () => Lang.validate('input', { name: 'command_params' }), trigger: 'blur' }],
  type: [{ required: true, message: () => Lang.validate('select', { name: 'task_type' }), trigger: 'blur' }],
  cron: [{
    trigger: 'blur',
    validator(rule: any, value: string, callback: Function) {
      if (form.value && form.value.row.type === 1 && !value) {
        return callback(new Error(Lang.validate('input', { name: 'timing_paras' })))
      }
      return true
    }
  }]
}
const form = ref<ComponentFormDialogInstance<FormParams>>()
// eslint-disable-next-line no-undef
let statusTimer: number
const execLogOpened = ref<boolean>(false)
const execLogTaskId = ref<number>()
const outputOpened = ref<boolean>(false)
const outputContent = ref<string>('')
const formatOutputContent = computed(() => {
  return outputContent.value.replace(/(\r\n|\r|\n)/g, '<br/>')
})
onMounted(() => {
  getStatus()
  statusTimer = setInterval(() => {
    getStatus()
  }, 10000)
})
onUnmounted(() => {
  if (statusTimer) clearInterval(statusTimer)
})
function getStatus() {
  status().then(({ map }: { map: ServerStatus }) => {
    serverStatus.value = map
  })
}
function refresh() {
  if (list.value) list.value.refresh()
}
function copyCommand() {
  Clipboard.copyText(serverStatus.value.command).then(() => {
    ElMessage.success(Lang.message('copy_success'))
  }).catch(() => {
    ElMessage.error(Lang.message('copy_fail'))
  })
}
function onAdd() {
  if (form.value) {
    form.value.open({
      title: '',
      exec_file: '',
      args: '',
      type: 1,
      cron: ''
    })
  }
}
function onEdit(row: ListItem) {
  if (form.value) {
    form.value.open({
      id: row.id,
      title: row.title,
      exec_file: row.exec_file,
      args: row.args,
      type: row.type,
      cron: row.cron
    })
  }
}
function onLog(row: ListItem) {
  execLogTaskId.value = row.id
  execLogOpened.value = true
}
function save(row: FormParams, shutDown: Function) {
  const loading = ElLoadingService()
  const promise = row.id ? edit(row) : add(row)
  promise.then(() => {
    ElMessage.success(Lang.message('save_success'))
    refresh()
    shutDown()
  }).finally(() => {
    loading.close()
  })
}
function onOutput(row: ExecLogInfo) {
  outputContent.value = row.out
  outputOpened.value = true
}
</script>

<style lang="scss" scoped>
.el-card {
    margin-bottom: 10px;
}
.service-status-box {
  display: flex;
  justify-content: flex-start;
  >span:nth-child(n+2) {
    margin-left: 2em;
  }
}
</style>

<style lang="scss">
.task-log-dialog {
  .el-dialog__body {
    background-color: #303133;
    .task-log-output {
      height: 220px;
      .el-scrollbar__wrap {
        overflow-x: hidden;
        .el-scrollbar__view {
          color: #C0C4CC;
          font-size: 12px;
          line-height: 1.4em;
        }
      }
    }
  }
}
</style>
