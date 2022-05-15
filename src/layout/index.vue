<template>
  <el-container class="app-wrapper">
    <el-aside :width="sidebarOpened ? '210px' : '54px'">
      <side-bar />
    </el-aside>
    <el-container>
      <el-header>
        <nav-bar />
      </el-header>
      <el-main>
        <app-main />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Layout'
})
</script>

<script lang="ts" setup>
import SideBar from './modules/sideBar/index.vue'
import NavBar from './modules/navBar/index.vue'
import AppMain from './modules/Main.vue'
import { useStore } from 'vuex'

const { getters } = useStore()

const sidebarOpened = computed<boolean>(() => {
  return getters['app/sidebarOpened']
})
</script>

<style lang="scss" scoped>
.app-wrapper {
  height: 100%;
  background-color: var(--el-bg-color);
  .el-aside {
    transition: width .28s;
    background-color: var(--menu-bg);
    border-right: 1px solid var(--el-border-color);
  }
  .el-header {
    height: 50px;
    position: relative;
    box-shadow: var(--el-box-shadow-lighter);
    background-color: var(--header-bg);
  }
  .el-main {
    padding: 0;
  }
}
</style>
