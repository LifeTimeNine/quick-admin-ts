<template>
  <el-config-provider :locale="elLocale">
    <router-view />
  </el-config-provider>
</template>

<script lang="ts" setup>
import { ref, watch, watchEffect } from 'vue'
import * as Language from 'element-plus/es/locale/index'
import { useI18n } from 'vue-i18n'
import { getSymbol } from './lang'
import { useStore } from 'vuex'
import { BasicConfig } from './interface/systemConfig'

const { locale } = useI18n()
const { getters, dispatch } = useStore()

const elLocale = ref<typeof Language.zhCn>(Language.zhCn)

watchEffect(() => {
  document.body.setAttribute('data-theme', getters['app/theme'])
})

watch(
  locale,
  function() {
    elLocale.value = Language[getSymbol().elementPlus as keyof typeof Language] as typeof Language.zhCn
  }
)

dispatch('app/getBasicConfig').then((config: BasicConfig) => {
  document.title = config.system_name
})

</script>

<style>

</style>
