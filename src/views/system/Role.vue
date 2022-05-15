<template>
  <div>
    <data-list ref="list" :node="$nodes.systemRole.list">
      <template #search="{options}">
        <el-form-item>
          <el-input v-model="options.name" :placeholder="$t('name')" />
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
        <el-button v-auth="$nodes.systemRole.add" type="primary" @click="onAdd">{{ $t('add') }}</el-button>
      </template>
      <template #list-column>
        <el-table-column label="ID" prop="id" sortable="custom" min-width="65" />
        <el-table-column :label="$t('name')" prop="name" min-width="100" />
        <el-table-column :label="$t('description')" prop="desc" min-width="120" show-overflow-tooltip />
        <el-table-column :label="$t('create_time')" prop="create_time" min-width="160" />
        <el-table-column :label="$t('action')" width="280" v-slot="{row}">
          <el-link v-auth="$nodes.systemRole.modifyRoleNodes" @click="onSetNodes(row)">{{ $t('button.authorization') }}</el-link>
          <el-link v-auth="$nodes.systemRole.edit" type="primary" @click="onEdit(row)">{{ $t('button.edit') }}</el-link>
          <el-link
            v-if="row.status === 1"
            v-auth="$nodes.systemRole.modifyStatus"
            type="warning"
            @click="$action($nodes.systemRole.modifyStatus, {id: row.id, enable: 0}, refresh)"
          >{{ $t('button.disable') }}</el-link>
          <el-link
            v-else
            v-auth="$nodes.systemRole.modifyStatus"
            type="success"
            @click="$action($nodes.systemRole.modifyStatus, {id: row.id, enable: 1}, refresh)"
          >{{ $t('button.enable') }}</el-link>
          <el-popconfirm :title="$t('message.delete_confirm')" @confirm="$action($nodes.systemRole.softDelete, {id: row.id}, refresh)">
            <template #reference>
              <el-link v-auth="$nodes.systemRole.softDelete" type="danger">{{ $t('button.delete') }}</el-link>
            </template>
          </el-popconfirm>
        </el-table-column>
      </template>
    </data-list>
    <form-dialog
      ref="roleForm"
      :rules="rules"
      @save="formOnSave"
      v-slot="{row}"
    >
      <el-form-item :label="$t('name')" prop="name">
        <el-input v-model="row.name" />
      </el-form-item>
      <el-form-item :label="$t('description')" prop="desc">
        <el-input v-model="row.desc" />
      </el-form-item>
    </form-dialog>
    <el-dialog
      v-model="authOpened"
      :title="$t('authorization')"
      width="40%"
      top="4%"
      destroy-on-close
    >
      <el-tree
        ref="nodeTree"
        :data="userNodeTree"
        :props="nodeTreeProps"
        :show-checkbox="true"
        :highlight-current="true"
        :expand-on-click-node="false"
        :check-on-click-node="true"
        node-key="node"
        accordion
      />
      <template #footer>
        <el-button @click="authOpened = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="saveNodes">{{ $t('button.save') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { add, edit, getRoleNodes, getUserNodeTree, modifyRoleNodes } from '@/apis/modules/systemRole'
import { ComponentDataListInstance, ComponentFormDialogInstance } from '@/interface'
import { FormParams, ListItem, ListQueryParams, UserNodeTree } from '@/interface/systemRole'
import { Lang } from '@/lang'
import { ElLoadingService, ElMessage, ElTree } from 'element-plus'
import { TreeKey } from 'element-plus/es/components/tree/src/tree.type'
import { defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
  name: 'SystemRole'
})
</script>

<script lang="ts" setup>
const list = ref<ComponentDataListInstance<ListItem, ListQueryParams>>()
const roleForm = ref<ComponentFormDialogInstance<FormParams>>()
const userNodeTree = ref<UserNodeTree[]>()
const nodeTree = ref<InstanceType<typeof ElTree>>()
const rules = {
  name: [{ required: true, trigger: 'blur', message: () => Lang.validate('input', { name: 'name' }) }]
}
const nodeTreeProps = {
  label: 'title',
  children: 'actions'
}
const authOpened = ref<boolean>(false)
let authRoleId = 0
onMounted(() => {
  getUserNodeTree().then(({ list }: { list: UserNodeTree[] }) => {
    userNodeTree.value = list
  })
})
function refresh() {
  if (list.value) list.value.refresh()
}
function onAdd() {
  if (roleForm.value) roleForm.value.open()
}
function onEdit(row: ListItem) {
  if (roleForm.value) {
    roleForm.value.open({
      id: row.id,
      name: row.name,
      desc: row.desc
    })
  }
}
function formOnSave(row: FormParams, shutDown: Function) {
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
function onSetNodes(row: ListItem) {
  authRoleId = row.id
  getRoleNodes({ srid: row.id }).then(({ list }: { list: string[] }) => {
    if (nodeTree.value) nodeTree.value.setCheckedKeys(list)
  })
  authOpened.value = true
}

function saveNodes() {
  if (nodeTree.value) {
    const loading = ElLoadingService()
    modifyRoleNodes({
      srid: authRoleId,
      nodes: nodeTree.value.getCheckedKeys().filter((item: TreeKey) => item !== undefined) as string[]
    }).then(() => {
      ElMessage.success(Lang.message('save_success'))
      authOpened.value = false
    }).finally(() => {
      loading.close()
    })
  }
}

</script>

<style lang="scss" scoped>

</style>
