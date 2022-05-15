<template>
  <el-scrollbar>
    <div class="main">
      <router-view v-slot="{Component}">
        <transition name="fade-transform" mode="out-in">
          <component :is="Component"></component>
        </transition>
      </router-view>
    </div>
  </el-scrollbar>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Main'
})
</script>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>
.el-scrollbar {
  position: initial;
  .main {
    padding: 20px;
    height: 100%;
    background-color: var(--el-bg-color);
  }
}
</style>
