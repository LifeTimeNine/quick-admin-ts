<template>
  <div>
    <el-upload
      v-if="props.type === 'button'"
      action=""
      :auto-upload="false"
      :show-file-list="false"
      :on-change="fileChange"
      :disabled="props.disabled"
      :accept="props.accept"
    >
      <el-button type="primary">{{ $t('button.select_file') }}</el-button>
    </el-upload>
    <ul v-if="props.type === 'button'" class="button-list" :class="{multiple: props.multiple}">
      <li v-for="(item, index) in list" v-show="!item.delete" :key="index" :class="{'show-progress': ![1, 6, 7].includes(item.status)}">
        <svg-icon
          :icon-class="buttonListIcon(index)"
          :class="{'success-icon': item.status === 6, 'warning-icon': item.status === 7, 'loading-icon': ![1, 6, 7].includes(item.status)}"
        />
        <span>{{ item.name }}</span>
        <svg-icon v-if="props.multiple && [6, 7].includes(item.status)" icon-class="close" class="close" @click="onRemove(index)" />
        <el-progress v-if="![6, 7].includes(item.status)" type="line" :percentage="parseInt(getProgress(index))" :stroke-width="3" :show-text="false" />
      </li>
    </ul>
    <div v-else-if="props.type === 'image'" class="image-list">
      <div v-for="(item, index) in list" v-show="!item.delete" :key="index" class="image-list-item" :style="{width: `${props.width}px`, height: `${props.height}px`}">
        <el-progress v-if="item.status !== 6" type="circle" :percentage="parseInt(getProgress(index))" :status="getProgressStatus(index)" :width="progressWidth" />
        <el-image v-if="item.status === 6" :src="item.url" fit="fill" :lazy="true" :style="{width: `${props.width}px`, height: `${props.height}px`}" />
        <div class="image-list-item-actions">
          <svg-icon icon-class="view" @click="openPreview(item.url)" />
          <svg-icon icon-class="delete" @click="onRemove(index)" />
        </div>
      </div>
      <el-upload
        v-if="showAdd"
        action=""
        :auto-upload="false"
        :show-file-list="false"
        :on-change="fileChange"
        :disabled="props.disabled"
        :accept="props.accept"
        class="image-list-item"
      >
        <div class="image-placeholder" :style="{width: `${props.width}px`, height: `${props.height}px`}">
          <svg-icon icon-class="plus" />
        </div>
      </el-upload>
      <el-image-viewer v-if="imagePreviewOpened" :initial-index="imagePreviewIndex" :url-list="usableList" fit="fill" @close="imagePreviewClose" />
    </div>
  </div>
</template>

<script lang="ts">
import { percentage } from '@/utils'
import Upload from '@/utils/upload'
import { UploadFile } from 'element-plus'
import { defineComponent, defineProps, defineEmits, ref, computed, watch, withDefaults } from 'vue'

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Upload'
})
</script>

<script lang="ts" setup>
interface ListItem {
  url: string
  name: string
  status: number
  progress: number
  delete: boolean
}
interface Props {
  modelValue: string|string[]
  part?: boolean
  buttonSize?: string
  accept?: string
  type?: 'button'|'image'
  width?: number
  height?: number
  multiple?: boolean
  disabled?: boolean
  limit?: number
}
const props = withDefaults(defineProps<Props>(), {
  part: false,
  buttonSize: 'default',
  accept: '*',
  type: 'image',
  width: 120,
  height: 120,
  multiple: false,
  disabled: false,
  limit: 0
})
let isEmit = false
const list = ref<ListItem[]>([])
const imagePreviewOpened = ref<boolean>(false)
const imagePreviewIndex = ref<number>(0)
const usableList = computed<string[]>(() => {
  return list.value.filter((item: ListItem) => !item.delete && item.status === 6).map((item: ListItem) => item.url)
})
const showAdd = computed<boolean>(() => {
  return (!props.multiple && list.value.filter((item: ListItem) => !item.delete).length === 0) ||
    (props.multiple && props.limit === 0) ||
    (props.multiple && usableList.value.length < props.limit)
})
const progressWidth = computed<number>(() => {
  return props.height > props.width ? props.width : props.height
})
const emit = defineEmits(['update:modelValue', 'on-progress', 'on-success', 'on-fail'])
watch(
  () => props.modelValue,
  function(value: string|string[]) {
    if (isEmit) {
      isEmit = true
    } else {
      list.value = []
      if (props.multiple) {
        (value as string[]).forEach((item: string) => {
          list.value.push({
            url: item,
            name: item,
            status: 6,
            progress: 0,
            delete: false
          })
        })
      } else {
        if (value) {
          list.value.push({
            url: value as string,
            name: value as string,
            status: 6,
            progress: 0,
            delete: false
          })
        }
      }
    }
  },
  { immediate: true }
)
function buttonListIcon(index: number): string {
  switch (list.value[index].status) {
    case 1:
      return 'document'
    case 2:
    case 3:
    case 4:
    case 5:
      return 'loading'
    case 6:
      return 'success-filled'
    case 7:
      return 'warning'
    default:
      return ''
  }
}
function openPreview(url: string) {
  imagePreviewIndex.value = usableList.value.indexOf(url)
  imagePreviewOpened.value = true
}
function onRemove(index: number) {
  list.value[index].delete = true
  updateModelValue()
}
function updateModelValue() {
  isEmit = true
  if (props.multiple) {
    emit('update:modelValue', usableList.value)
  } else {
    emit('update:modelValue', usableList.value[0] ?? '')
  }
}
function imagePreviewClose() {
  imagePreviewOpened.value = false
}
function getProgress(index: number): string {
  if ([2, 3].includes(list.value[index].status)) {
    return (Math.round(list.value[index].progress / 2 * 100) / 100).toFixed(2)
  } else if ([4, 5].includes(list.value[index].status)) {
    return (Math.round(list.value[index].progress / 2 * 100) / 100 + 50).toFixed(2)
  } else if (list.value[index].status === 7) {
    return '100'
  } else {
    return '0'
  }
}
function getProgressStatus(index: number): string {
  if (list.value[index].status === 6) {
    return 'success'
  } else if (list.value[index].status === 7) {
    return 'warning'
  } else {
    return ''
  }
}
function fileChange(e: UploadFile) {
  if (e.raw) {
    let index = 0
    if (props.multiple || list.value.length === 0) {
      index = list.value.length
      list.value.push({
        url: '',
        name: e.raw.name,
        status: 1,
        progress: 0,
        delete: false
      })
    } else {
      list.value[index].name = e.raw.name
      list.value[index].delete = false
    }
    const upload = new Upload()
    upload.onMd5Before(() => {
      list.value[index].progress = 0
      list.value[index].status = 2
    }).onMd5Progress((loaded: number, total: number) => {
      list.value[index].progress = percentage(loaded, total)
      emit('on-progress', getProgress(index))
    }).onMd5After(() => {
      list.value[index].progress = 100
      list.value[index].status = 3
    }).onBefore(() => {
      list.value[index].progress = 0
      list.value[index].status = 4
    }).onProgress((loaded: number, total: number) => {
      list.value[index].progress = percentage(loaded, total)
      emit('on-progress', getProgress(index))
    }).onAfter(() => {
      list.value[index].progress = 100
      list.value[index].status = 5
    })
    const promiseObj = props.part ? upload.partSave(e.raw) : upload.save(e.raw)
    promiseObj.then((url: string) => {
      list.value[index].status = 6
      list.value[index].url = url
      updateModelValue()
      emit('on-success', url, e.raw)
    }).catch(e => {
      list.value[index].status = 7
      emit('on-fail', e)
    })
  }
}
</script>

<style lang="scss" scoped>
.success-icon {
  color: var(--el-color-success);
}
.warning-icon {
  color: var(--el-color-warning);
}
.loading-icon {
  animation: loading-rotate 2s linear infinite;
}
.button-list {
  list-style: none;
  padding: 0;
  margin: 10px 0 0;
  li {
    font-size: 14px;
    color: var(--el-text-color-regular);
    margin-bottom: 5px;
    border-radius: var(--el-border-radius-base);
    transition: all .5s cubic-bezier(.55,0,.1,1);
    line-height: 1.8em;
    position: relative;
    span {
      margin-left: .4em;
    }
    .el-progress {
      width: 100%;
      position: absolute;
      bottom: 0;
    }
  }
  &.multiple li {
    cursor: pointer;
    .close {
      float: right;
      margin-right: .6em;
      display: none;
      &:hover {
        color: var(--el-color-danger);;
      }
    }
    &:hover {
      background-color: var(--el-fill-color-light);
      span {
        color: var(--el-color-primary);
      }
      .close {
        display: inline-block;
      }
    }
  }
}
.image-list {
  display: flex;
  &-item {
    margin: 0 5px 5px 0;
    position: relative;
    .image-placeholder {
      box-sizing: border-box;
      position: relative;
      border: 1px dashed var(--el-color-info);
      border-radius: var(--el-border-radius-base);
      &:hover {
        border-color: var(--el-color-primary);
        color: var(--el-color-primary);
      }
      .svg-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .el-image {
      border-radius: var(--el-border-radius-base);
      overflow: hidden;
    }
    &-actions {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      color: #fff;
      opacity: 0;
      font-size: 20px;
      background-color: var(--el-color-info-dark-2);
      transition: opacity var(--el-transition-duration);
      border-radius: var(--el-border-radius-base);
      display: flex;
      justify-content: space-around;
      align-items: center;
      & .svg-icon {
        cursor: pointer;
        &:hover {
          opacity: .6;
        }
      }
    }
    &:hover &-actions {
      opacity: .6;
    }
    &:hover {
      .el-progress {
        opacity: .5;
      }
    }
    .el-progress {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
