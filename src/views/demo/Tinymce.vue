<template>
  <div>
    <tinymce v-model="value" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'DemoTinymce'
})
</script>

<script lang="ts" setup>
import Tinymce from '@/components/Tinymce/index.vue'
const value = ref('')
</script>

<style lang="scss" scoped>

</style>
