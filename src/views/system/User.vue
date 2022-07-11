<template>
  <div>
    <data-list ref="list" :node="$nodes.systemUser.list">
      <template #search="{options}">
        <el-form-item>
          <el-input v-model="options.username" :placeholder="$t('username')" />
        </el-form-item>
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
        <el-button v-auth="$nodes.systemUser.add" type="primary" @click="onAdd">{{ $t('add') }}</el-button>
      </template>
      <template #list-column>
        <el-table-column label="ID" prop="id" sortable="custom" min-width="65" />
        <el-table-column :label="$t('avatar')" width="70" v-slot="{row}">
          <el-avatar shape="square" :src="row.avatar" fit="fill" />
        </el-table-column>
        <el-table-column :label="$t('username')" min-width="100" prop="username" />
        <el-table-column :label="$t('name')" prop="name" />
        <el-table-column :label="$t('role')" v-slot="{row}">
          <el-tag v-for="(item, index) in row.roles" :key="index" type="info">{{ item.name }}</el-tag>
        </el-table-column>
        <el-table-column :label="$t('create_time')" prop="create_time" min-width="155" />
        <el-table-column :label="$t('last_login_time')" prop="last_login_time" min-width="155" />
        <el-table-column :label="$t('last_login_ip')" prop="last_login_ip" min-width="140" />
        <el-table-column :label="$t('action')" width="300" v-slot="{row}">
          <el-popconfirm :title="$t('message.reset_pwd_confirm')" @confirm="$action($nodes.systemUser.resetPwd, {id: row.id})">
            <template #reference>
              <el-link v-auth="$nodes.systemUser.resetPwd">{{ $t('button.reset_pwd') }}</el-link>
            </template>
          </el-popconfirm>
          <el-link v-auth="$nodes.systemUser.edit" type="primary" @click="onEdit(row)">{{ $t('button.edit') }}</el-link>
          <el-link
            v-if="row.status === 1"
            v-auth="$nodes.systemUser.modifyStatus"
            type="warning"
            @click="$action($nodes.systemUser.modifyStatus, {id: row.id, enable: 0}, refresh)"
          >{{ $t('button.disable') }}</el-link>
          <el-link
            v-else
            v-auth="$nodes.systemUser.modifyStatus"
            type="success"
            @click="$action($nodes.systemUser.modifyStatus, {id: row.id, enable: 1}, refresh)"
          >{{ $t('button.enable') }}</el-link>
          <el-popconfirm :title="$t('message.delete_confirm')" @confirm="$action($nodes.systemUser.softDelete, {id: row.id}, refresh)">
            <template #reference>
              <el-link v-auth="$nodes.systemUser.softDelete" type="danger">{{ $t('button.delete') }}</el-link>
            </template>
          </el-popconfirm>
        </el-table-column>
      </template>
    </data-list>
    <form-dialog ref="form" :rules="rules" @save="save" v-slot="{row}">
      <el-form-item :label="$t('username')" prop="username">
        <el-input v-model="row.username" :disabled="!!row.id" />
      </el-form-item>
      <el-form-item :label="$t('name')" prop="name">
        <el-input v-model="row.name" />
      </el-form-item>
      <el-form-item :label="$t('description')" prop="desc">
        <el-input v-model="row.desc" />
      </el-form-item>
      <el-form-item :label="$t('role')" prop="rids">
        <el-select v-model="row.rids" clearable filterable multiple style="width:100%">
          <el-option
            v-for="item in userRoles"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </form-dialog>
  </div>
</template>

<script lang="ts">
import { getUserRole } from '@/apis/modules/systemRole'
import { add, edit } from '@/apis/modules/systemUser'
import { ComponentDataListInstance, ComponentFormDialogInstance } from '@/interface'
import { Role } from '@/interface/systemRole'
import { FormParams, ListItem, ListQueryParams } from '@/interface/systemUser'
import { Lang } from '@/lang'
import { ElLoadingService, ElMessage } from 'element-plus'
import { defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
  name: 'SystemUser'
})
</script>

<script lang="ts" setup>
const list = ref<ComponentDataListInstance<ListItem, ListQueryParams>>()
const form = ref<ComponentFormDialogInstance<FormParams>>()
const rules = {
  username: [{ required: true, trigger: 'blur', message: () => Lang.validate('input', { name: 'username' }) }],
  name: [{ required: true, trigger: 'blur', message: () => Lang.validate('input', { name: 'name' }) }],
  rids: [{ required: true, trigger: 'blur', message: () => Lang.validate('select', { name: 'role' }) }]
}
const userRoles = ref<Role[]>([])
onMounted(() => {
  getUserRole().then(({ list }: { list: Role[] }) => {
    userRoles.value = list
  })
})
function refresh() {
  if (list.value) list.value.refresh()
}
function onAdd() {
  if (form.value) form.value.open()
}
function onEdit(row: ListItem) {
  if (form.value) {
    form.value.open({
      id: row.id,
      username: row.username,
      name: row.name,
      desc: row.desc,
      rids: row.roles.map((item: Role) => item.id)
    })
  }
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
</script>

<style lang="scss" scoped>

</style>
