<template>
  <component :is="type" v-bind="linkProps">
    <slot />
  </component>
</template>

<script lang="ts">
import { isExternal } from '@/utils'
import { computed, defineComponent, defineProps } from 'vue'

export default defineComponent({
  name: 'SideBarLink'
})
</script>

<script lang="ts" setup>
const props = defineProps({
  to: {
    type: String,
    required: true
  }
})
const type = computed(() => {
  if (isExternal(props.to)) {
    return 'a'
  } else {
    return 'router-link'
  }
})
const linkProps = computed(() => {
  if (isExternal(props.to)) {
    return {
      href: props.to,
      target: '_blank',
      rel: 'noopener'
    }
  } else {
    return {
      to: props.to
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
