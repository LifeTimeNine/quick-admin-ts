<template>
  <div>
    <!--
      上传文件组件
      v-model 绑定url值
      part    是否是切片上传
      accept  接受上传的文件类型
      type    展示类型 button-按钮，image-图片
      width   图片宽
      height  图片高
      multiple  是否支持多选文件
      disabled  是否禁用上传
      limit  允许上传文件的最大数量
      on-status 状态改变事件 (status) 1-未开始 2-开始计算MD5 3-MD5计算完成 4-开始上传 5-正在合并 6-上传成功 7-上传失败
      on-progress 上传进度事件 (progress) progress：进度百分比
      on-success  上传成功事件 (url, file) url:图片地址 file:File对象
      on-faill  上传失败事件 (e) e:Error对象
     -->
    <upload
      v-model="url"
      type="button"
      :part="true"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'DemoUpload'
})
</script>

<script lang="ts" setup>
const url = ref<string>('')
</script>

<style lang="scss" scoped>

</style>
