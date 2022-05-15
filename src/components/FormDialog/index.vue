<template>
  <el-dialog
    v-model="opened"
    :title="title"
    :width="width || '30%'"
    :close-on-click-modal="false"
    destroy-on-close
    @close="close"
  >
    <el-form ref="form" :model="row" :rules="props.rules" :label-width="props.labelWidth" :size="props.size" :label-position="props.labelPosition">
      <slot :row="row" />
    </el-form>
    <template #footer>
      <el-button :size="props.size" @click="opened = false">{{ props.cancelText }}</el-button>
      <el-button type="primary" :size="props.size" @click="save">{{ props.saveText }}</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { Lang } from '@/lang'
import { FormInstance } from 'element-plus'
import { defineComponent, withDefaults, defineProps, defineEmits, ref, defineExpose } from 'vue'

export default defineComponent({
  name: 'FormDialog'
})
</script>

<script lang="ts" setup>
interface Props {
  width?: string
  labelWidth?: string
  labelPosition?: string
  size?: string
  rules?: Object
  saveText?: string
  cancelText?: string
}
const props = withDefaults(defineProps<Props>(), {
  width: '30%',
  labelWidth: 'auto',
  labelPosition: 'right',
  size: 'default',
  rules: () => ({}),
  saveText: Lang.button('save'),
  cancelText: Lang.button('cancel')
})
const emit = defineEmits(['save'])
const row = ref<{ [key in string]: any }>({})
const title = ref<string>('')
const opened = ref<boolean>(false)
const form = ref<FormInstance>()
function open(row_: { [key in string]: any } = {}, title_?: string) {
  row.value = Object.assign({}, row_)
  title.value = title_ || (row_.id ? Lang.text('edit') : Lang.text('add'))
  opened.value = true
}
function save() {
  if (form.value) {
    form.value.validate((valid: boolean) => {
      if (!valid) return
      emit('save', row.value, () => {
        opened.value = false
      })
    })
  }
}
function close() {
  if (form.value) {
    form.value.clearValidate()
  }
}
defineExpose({ open, row })
</script>

<style lang="scss" scoped>

</style>
