<template>
  <div>
    <el-row :gutter="20">
      <el-col v-for="(item, index) in list" :key="index" :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="header">
              <span>{{ item.name }}</span>
              <el-link type="primary" @click="onEdit(item)">{{ $t('edit') }}</el-link>
            </div>
          </template>
          <div class="value-content">
            <template v-if="item.type === ValueType.TEXT">
              <span class="value value-text">{{ item.value }}</span>
            </template>
            <template v-else-if="item.type === ValueType.LIST">
              <el-scrollbar>
                <el-descriptions :column="1" border>
                  <el-descriptions-item
                    v-for="(v, i) in item.value"
                    :key="i"
                    :span="1"
                    :label="i + 1"
                    >
                    {{ v }}
                  </el-descriptions-item>
                </el-descriptions>
              </el-scrollbar>
            </template>
            <template v-else-if="item.type === ValueType.MAP">
              <el-scrollbar>
                <el-descriptions :column="1" border>
                  <el-descriptions-item
                    v-for="(v, i) in item.value"
                    :key="i"
                    :span="1"
                    :label="i"
                    >
                    {{ v }}
                  </el-descriptions-item>
                </el-descriptions>
              </el-scrollbar>
            </template>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <form-dialog ref="form" v-slot="{row}" width="600" @save="save">
      <el-form-item :label="$t('config_name')" prop="name">
        <el-input v-model="row.name" readonly />
      </el-form-item>
      <el-form-item :label="$t('value')" prop="value">
        <template v-if="row.type === ValueType.TEXT">
          <el-input v-model="row.value" type="textarea" />
        </template>
        <template v-if="row.type === ValueType.LIST">
          <el-scrollbar class="edit-list-scrollbar" ref="editListScrollbar">
            <el-descriptions ref="editListDescription" :column="1" border>
              <el-descriptions-item
                v-for="(item, index) in editList"
                :key="index"
                :span="1"
                :label="index + 1"
                >
                <div class="edit-value-item">
                  <el-input v-model="editList[index]" type="textarea" />
                  <svg-icon icon-class="delete-filled" @click="removeItem(index)" />
                </div>
              </el-descriptions-item>
            </el-descriptions>
          </el-scrollbar>
          <div class="add-btn-box">
            <el-button icon="el-icon-plus" class="add-btn" @click="addItem" />
          </div>
        </template>
        <template v-if="row.type === ValueType.MAP">
          <el-scrollbar class="edit-map-scrollbar">
            <el-descriptions :column="1" border>
              <el-descriptions-item
                v-for="(item, index) in editMap"
                :key="index"
                :span="1"
                :label="editMap[index].key"
                >
                <el-input v-model="editMap[index].value" type="textarea" />
              </el-descriptions-item>
            </el-descriptions>
          </el-scrollbar>
        </template>
      </el-form-item>
    </form-dialog>
  </div>
</template>

<script lang="ts">
import { list as getList, add, edit } from '@/apis/modules/systemConfig'
import { ComponentFormDialogInstance, KeyValue } from '@/interface'
import { ItemInfo } from '@/interface/systemConfig'
import { Lang } from '@/lang'
import { DescriptionInstance, ElLoadingService, ElMessage, ScrollbarInstance } from 'element-plus'
import { defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
  name: 'SystemConfig'
})
</script>

<script lang="ts" setup>

import { ValueType } from '@/interface/systemConfig'

const list = ref<ItemInfo[]>([])
const form = ref<ComponentFormDialogInstance<ItemInfo>>()
const editList = ref<string[]>([])
const editMap = ref<KeyValue<string>[]>([])
const editListDescription = ref<DescriptionInstance>()
const editListScrollbar = ref<ScrollbarInstance>()

onMounted(() => {
  init()
})

function init() {
  getList().then(({ list: list_ }: {list: ItemInfo[]}) => {
    list.value = list_
  })
}

const tempValue = ref<string|string[]|KeyValue<string>[]>('')

function onEdit(row: ItemInfo) {
  const data = Object.assign({}, row)
  if (data.type === ValueType.LIST) {
    data.value = (row.value as string[]).slice()
    editList.value = data.value as string[]
  } else if (data.type === ValueType.MAP) {
    data.value = Object.assign({}, row.value)
    const value = data.value as {[x: string]: string}
    editMap.value = Object.keys(value).map(key => {
      return {
        key: key,
        value: value[key]
      }
    })
  }
  form.value?.open(data)
}
function addItem() {
  editList.value.push('')
  editListDescription.value?.$nextTick(() => {
    editListScrollbar.value?.setScrollTop(editListDescription.value?.$el.offsetHeight)
  })
}
function removeItem(index: number) {
  editList.value.splice(index, 1)
}
function save(row: ItemInfo, shutDown: Function) {
  const loading = ElLoadingService()
  if (row.type === ValueType.LIST) {
    row.value = editList.value
  } else if (row.type === ValueType.MAP) {
    const map: {[x: string]: string} = {}
    editMap.value.forEach(item => {
      map[item.key] = item.value
    })
    row.value = map
  }
  const promise = row.id ? edit(row) : add(row)
  promise.then(() => {
    ElMessage.success(Lang.message('save_success'))
    shutDown()
    init()
  }).finally(() => {
    loading.close()
  })
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
}
.value-content {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  .value {
    font-weight: bold;
  }
  .el-scrollbar {
    width: 100%;
  }
}

.el-form {
  .el-form-item__content {
    display: block;
    .el-scrollbar {
      width: 100%;
      max-height: 400px;
      &.edit-list-scrollbar :deep() {
        height: calc(100% - 32px);
        .el-descriptions__label {
          width: 3em;
        }
      }
    }
  }
}

.edit-value-item {
  display: flex;
  align-items: center;
  .svg-icon {
    display: none;
    margin-left: .5em;
    cursor: pointer;
    color: #F56C6C;
  }
  &:hover {
    .svg-icon {
      display: inline-block;
    }
  }
}

</style>
