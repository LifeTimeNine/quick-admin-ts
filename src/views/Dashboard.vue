<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎你:</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DashBoard'
})
</script>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
    height: 1000px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
