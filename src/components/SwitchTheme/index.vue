<template>
  <div class="switch-theme">
    <el-dropdown trigger="click" @command="onChange">
      <slot />
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="theme in themes" :key="theme" :command="theme" :disabled="theme === currentTheme">
            {{ $t(`themes.${theme}`) }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'SwitchTheme'
})
</script>

<script lang="ts" setup>
import { themes } from '@/theme'
import { useStore } from 'vuex'

const { getters, dispatch } = useStore()

const currentTheme = computed<string>(() => {
  return getters['app/theme']
})

function onChange(command: string) {
  dispatch('app/setTheme', command)
}
</script>

<style lang="scss" scoped>
.switch-theme {
  display: inline-block;
  cursor: pointer;
}
</style>
