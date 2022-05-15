<template>
  <div>
    <el-button ref="button" type="primary" size="default" @click="open">open</el-button>
    <form-dialog ref="form" :rules="rules" @save="save" v-slot="{row}">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="row.name" />
      </el-form-item>
    </form-dialog>
  </div>
</template>

<script lang="ts">
import { ComponentFormDialogInstance } from '@/interface'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'DemoFormDialog'
})
</script>

<script lang="ts" setup>
const form = ref<ComponentFormDialogInstance<{ name: string }>>()
const rules = {
  name: [{ required: true, trigger: 'blur', message: '请输入姓名' }]
}
function open() {
  if (form.value) {
    form.value.open({ name: '张三' }, '编辑')
  }
}
function save(row: { [key in string]: any }, shutDown: Function) {
  console.log(row)
  shutDown()
}
</script>

<style lang="scss" scoped>

</style>
