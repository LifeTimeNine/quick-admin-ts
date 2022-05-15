<template>
  <el-scrollbar>
    <el-menu
      mode="vertical"
      :default-active="menuActive"
      :collapse="!sidebarOpened"
      :collapse-transition="false"
      :unique-opened="false"
      @select="menuSelect"
    >
      <side-bar-item v-for="menu in menus" :key="menu.id" :item="menu"></side-bar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script lang="ts">
import { Menu } from '@/interface/systemUser'
import { menuPathToIndex } from '@/utils'
import { computed, defineComponent, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'SideBar'
})
</script>

<script lang="ts" setup>
import SideBarItem from './Item.vue'

const { getters, commit } = useStore()
const route = useRoute()

const menus = computed<Menu>(() => {
  return getters['user/menus']
})

const sidebarOpened = computed<boolean>(() => {
  return getters['app/sidebarOpened']
})

const menuActive = computed<string>(() => {
  return getters['app/menuActive']
})

function menuSelect(index: string): void {
  commit('app/MENU_ACTIVE', index)
}

onMounted(() => {
  commit('app/MENU_ACTIVE', menuPathToIndex(getters['user/menus'], route.path))
})

</script>

<style lang="scss" scoped>
.el-scrollbar {
  background-color: var(--menu-bg) !important;
}
.el-menu {
  width: 100%;
  border: none;
  background-color: var(--menu-bg);
  :deep() {
    .svg-icon * {
      vertical-align: middle;
      margin-right: .5em;
    }
    .el-menu-item {
      color: var(--menu-text);
      &:hover {
        background-color: var(--menu-hover-bg);
      }
      &.is-active {
        color: var(--menu-active-text);
      }
    }
    .el-sub-menu {
      &__title {
        color: var(--menu-text);
        &:hover {
          background-color: var(--menu-hover-bg);
        }
      }
      .el-menu {
        background-color: var(--sub-menu-bg);
        .el-menu-item{
          &:hover {
            background-color: var(--sub-menu-hover-bg);
          }
          &.is-active {
            color: var(--sub-menu-active-text);
          }
        }
      }
    }
  }
  &.el-menu--collapse :deep() {
    .el-menu-item,
    .el-sub-menu__title {
      span {
        display: none;
      }
    }
    .el-sub-menu__icon-arrow {
      display: none;
    }
  }
}
</style>

<style lang="scss">
.el-popper.menu-popper-class {
  background-color: var(--menu-bg);
  .el-menu {
    background-color: var(--menu-bg);
    .svg-icon * {
      vertical-align: middle;
      margin-right: .5em;
    }
    .el-menu-item {
      color: var(--menu-text);
      &:hover {
        background-color: var(--menu-hover-bg);
      }
    }
    .el-sub-menu {
      &__title {
        color: var(--menu-text);
        &:hover {
          background-color: var(--menu-hover-bg);
        }
      }
      .el-menu {
        background-color: var(--sub-menu-bg);
        .el-menu-item:hover {
          background-color: var(--sub-menu-hover-bg);
        }
      }
    }
  }
}
</style>
