<template>
  <div>
    <data-list ref="list" :node="$nodes.systemConfig.list">
      <template #search="{options}">
        <el-form-item>
          <el-input v-model="options.name" :placeholder="$t('config_name')" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="options.key" :placeholder="$t('config_key')" />
        </el-form-item>
      </template>
      <template #actions>
        <el-button v-auth="$nodes.systemConfig.add" type="primary" @click="onAdd">{{ $t('add') }}</el-button>
      </template>
      <template #list-column>
        <el-table-column label="ID" prop="id" sortable="custom" />
        <el-table-column :label="$t('name')" prop="name" sortable />
        <el-table-column :label="$t('config_key')" prop="key" />
        <el-table-column :label="$t('config_value')" v-slot="{row}">
          <span v-if="row.type === 1">{{ row.value }}</span>
          <template v-else-if="row.type === 2">
            <el-tag v-for="(item, index) in row.value" :key="index" class="table-value-item">{{ item }}</el-tag>
          </template>
          <template v-else-if="row.type === 3">
            <el-tag v-for="(item, index) in Object.keys(row.value)" :key="index" class="table-value-item">{{ item }}: {{ row.value[item] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('action')" v-slot="{row}">
          <el-link v-auth="$nodes.systemConfig.edit" type="primary" @click="onEdit(row)">{{ $t('button.edit') }}</el-link>
          <el-popconfirm :title="$t('message.delete_confirm')" @confirm="$action($nodes.systemConfig.del, {id: row.id}, refresh)">
            <template #reference>
              <el-link v-auth="$nodes.systemConfig.del" type="danger">{{ $t('button.delete') }}</el-link>
            </template>
          </el-popconfirm>
        </el-table-column>
      </template>
    </data-list>
    <form-dialog ref="form" v-slot="{row}" width="60%" @save="save">
      <el-form-item :label="$t('config_key')" prop="key">
        <el-input v-model="row.key" />
      </el-form-item>
      <el-form-item :label="$t('config_name')" prop="name">
        <el-input v-model="row.name" />
      </el-form-item>
      <el-form-item :label="$t('type')" prop="type">
        <el-select v-model="row.type" style="width: 100%" @change="typeChange">
          <el-option :label="$t('string')" :value="1" />
          <el-option :label="$t('list')" :value="2" />
          <el-option :label="$t('maps')" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('value')" prop="value">
        <template v-if="row.type === 1">
          <el-input v-model="tempValue" />
        </template>
        <template v-if="row.type === 2">
          <div v-for="(item, index) in tempValue" :key="index" class="value-list-items">
            {{ index + 1 }}：
            <el-input v-model="tempValue[index]" type="textarea" />
            <svg-icon icon-class="delete-filled" @click="removeItem(index)" />
          </div>
          <div class="add-btn-box">
            <el-button icon="el-icon-plus" class="add-btn" @click="addItem" />
          </div>
        </template>
        <template v-if="row.type === 3">
          <div v-for="(item, index) in tempValue" :key="index" class="value-map-items">
            <div class="value-map-items-box">
              <div class="value-map-items-label">
                {{ $t('key') }}：<el-input v-model="tempValue[index].key" />
              </div>
              <div>
                {{ $t('value') }}：<el-input v-model="tempValue[index].value" type="textarea" />
              </div>
            </div>
            <svg-icon icon-class="delete-filled" @click="removeItem(index)" />
          </div>
          <div class="add-btn-box">
            <el-button icon="el-icon-plus" class="add-btn" @click="addItem" />
          </div>
        </template>
      </el-form-item>
    </form-dialog>
  </div>
</template>

<script lang="ts">
import { add, edit } from '@/apis/modules/systemConfig'
import { ComponentDataListInstance, ComponentFormDialogInstance, KeyValue } from '@/interface'
import { ItemInfo, ListQueryParams } from '@/interface/systemConfig'
import { Lang } from '@/lang'
import { ElLoadingService, ElMessage } from 'element-plus'
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'SystemConfig'
})
</script>

<script lang="ts" setup>
const list = ref<ComponentDataListInstance<ItemInfo, ListQueryParams>>()
const form = ref<ComponentFormDialogInstance<ItemInfo>>()
const tempValue = ref<string|string[]|KeyValue<string>[]>()
function refresh() {
  if (list.value) list.value.refresh()
}
function onAdd() {
  if (form.value) {
    form.value.open({
      key: '',
      name: '',
      type: 1,
      value: ''
    })
    tempValue.value = ''
  }
}
function onEdit(row: ItemInfo) {
  const data: ItemInfo = {
    id: row.id,
    key: row.key,
    name: row.name,
    type: row.type,
    value: row.value
  }
  if (row.type === 1) {
    data.value = row.value
    tempValue.value = row.value as string
  } else if (row.type === 2) {
    tempValue.value = [] as string[]
    (row.value as string[]).forEach(item => {
      (tempValue.value as string[]).push(item)
    })
  } else if (row.type === 3) {
    tempValue.value = [] as KeyValue<string>[]
    for (const key in row.value as {[key in string]:string}) {
      tempValue.value.push({ key, value: (row.value as {[key in string]:string})[key] })
    }
  }
  if (form.value) {
    form.value.open(data)
  }
}
function typeChange(value: number) {
  if (form.value) {
    if (value === 1) {
      form.value.row.value = ''
      tempValue.value = ''
    } else if (value === 2) {
      form.value.row.value = [] as string[]
      tempValue.value = [] as string[]
    } else if (value === 3) {
      form.value.row.value = {} as {[key in string]: string}
      tempValue.value = [] as KeyValue<string>[]
    }
  }
}
function addItem() {
  if (form.value) {
    if (form.value.row.type === 2) {
      (tempValue.value as string[]).push('')
    } else if (form.value.row.type === 3) {
      (tempValue.value as KeyValue<string>[]).push({ key: 'key', value: 'value' })
    }
  }
}
function removeItem(index: number) {
  (tempValue.value as string[]|KeyValue<string>[]).splice(index, 1)
}
watch(
  tempValue,
  function(value) {
    if (form.value) {
      if (form.value.row.type === 1 || form.value.row.type === 2) {
        form.value.row.value = value as string|string[]
      } else if (form.value.row.type === 3) {
        form.value.row.value = {} as {[key in string]: string}
        (value as KeyValue<string>[]).forEach((item: KeyValue<string>) => {
          if (form.value) (form.value.row.value as {[key in string]: string})[item.key] = item.value
        })
      }
    }
  },
  {
    deep: true
  }
)
function save(row: ItemInfo, shutDown: Function) {
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
</script>

<style lang="scss" scoped>
.el-form :deep() {
  .el-form-item__content {
    display: inline-block;
  }
}
.value-list-items,
.value-map-items {
  display: flex;
  width: 100%;
  align-items: center;
  margin-bottom: .3em;
  .svg-icon {
    width: 20px;
    margin-left: .5em;
    cursor: pointer;
    &:hover {
      color: #F56C6C;
    }
  }
}
.value-map-items {
  &-box {
    width: 100%;
    margin-bottom: .1em;
    div {
      display: flex;
      flex-wrap: nowrap;
    }
  }
}
.add-btn-box {
  width: 100%;
}
</style>
