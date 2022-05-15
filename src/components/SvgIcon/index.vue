<template>
  <div class="svg-icon">
    <svg v-if="props.iconClass && isSvgIcon">
      <use :xlink:href="iconName" />
    </svg>
    <component v-else-if="props.iconClass && isElIcon" :is="`el-icon-${props.iconClass}`" />
  </div>
</template>

<script lang="ts">
import { elIcons, svgIcons } from '@/icon'
import { computed, defineComponent, defineProps } from 'vue'

export default defineComponent({
  name: 'SvgIcon'
})
</script>

<script lang="ts" setup>
const props = defineProps({
  iconClass: {
    required: true,
    type: String
  }
})
const isSvgIcon = computed(() => {
  return svgIcons.includes(props.iconClass)
})
const isElIcon = computed(() => {
  return elIcons.includes(props.iconClass.replace('-', '').toLocaleLowerCase())
})
const iconName = computed(() => {
  return `#icon-${props.iconClass}`
})
</script>

<style lang="scss" scoped>
.svg-icon {
  display: inline-flex;
  align-items: center;
  svg {
    width: 1em;
    height: 1em;
    fill: currentColor;
  }
}
</style>
