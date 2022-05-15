<template>
  <div class="switch-language">
    <el-dropdown trigger="click" @command="onChange">
      <slot />
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="lang in langs" :key="lang" :command="lang" :disabled="lang === locale">
            {{ $t('_', null, {locale: lang}) }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SwitchLanguage'
})
</script>

<script lang="ts" setup>
import { langs, languageStorageKey } from '@/lang'
import storage from '@/utils/storage'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

function onChange(command: string) {
  storage.set(languageStorageKey, command)
  locale.value = command
}
</script>

<style lang="scss" scoped>
.switch-language {
  display: inline-block;
  cursor: pointer;
}
</style>
