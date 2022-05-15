import auth from '@/utils/auth'
import { DirectiveBinding } from 'vue'

export default {
  mounted(el: Element, binding: DirectiveBinding<string>) {
    if (!auth(binding.value) && el.parentNode) {
      el.parentNode.removeChild(el)
    }
  }
}
