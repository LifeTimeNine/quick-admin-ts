<template>
  <div>
    <template v-if="item.url !== '#' && item.children.length === 0">
      <side-bar-link :to="item.params ? (item.url + '?' + item.params) : item.url">
        <el-menu-item :index="item.id + ''">
          <svg-icon :icon-class="item.icon" />
          <span v-if="item.title">{{ $t(`menu.${item.title}`, item.title) }}</span>
        </el-menu-item>
      </side-bar-link >
    </template>
    <el-sub-menu v-if="item.url === '#' && item.children.length !== 0" :index="item.id + ''" popper-class="menu-popper-class">
      <template #title>
        <svg-icon :icon-class="item.icon || ''" />
        <span v-if="item.title">{{ $t(`menu.${item.title}`, item.title) }}</span>
      </template>
      <side-bar-item v-for="children in item.children" :key="children.id" :item="children" />
    </el-sub-menu>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, defineProps } from 'vue'

export default defineComponent({
  name: 'SideBarItem'
})
</script>

<script lang="ts" setup>
import SideBarLink from './Link.vue'
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})
const item = computed(() => {
  return props.item
})
</script>
