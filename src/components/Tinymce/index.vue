<template>
  <div class="tinymce" :style="{width: containerWidth}">
    <textarea :id="props.tinymceId" class="tinymce-textarea" />
  </div>
</template>

<script lang="ts">
import { getSymbol, Lang } from '@/lang'
import { defineComponent, withDefaults, defineProps, computed, onMounted, defineEmits, ref, onUnmounted, watch } from 'vue'
import { plugins, tinymceCDN, toolbar } from './config'
import asyncLoadScript from '@/utils/asyncLoadScript'
import { ElLoadingService } from 'element-plus'
import Upload from '@/utils/upload'
import { percentage } from '@/utils'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Tinymce'
})
</script>

<script lang="ts" setup>
interface Props {
  modelValue: string
  tinymceId?: string
  height?: string|number
  width?: string|number
}
const props = withDefaults(defineProps<Props>(), {
  tinymceId: 'vue-tinymce-' + new Date().getTime() + ((Math.random() * 1000).toFixed(0) + ''),
  height: 360,
  width: 'auto'
})
const fullscreen = ref<boolean>(false)
const containerWidth = computed<string>(() => {
  if (typeof props.width === 'number') {
    return `${props.width}px`
  } else {
    return props.width
  }
})

let change = false

const emit = defineEmits(['update:modelValue'])

const { locale } = useI18n()

function initTinymce() {
  const config: {[key in string]: any} = {
    selector: `#${props.tinymceId}`,
    height: props.height,
    body_class: 'panel-body ',
    object_resizing: false,
    toolbar: toolbar,
    menubar: 'file edit insert view format table',
    plugins: plugins,
    end_container_on_empty_block: true,
    powerpaste_word_import: 'clean',
    code_dialog_height: 450,
    code_dialog_width: 1000,
    advlist_bullet_styles: 'square',
    advlist_number_styles: 'default',
    imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
    default_link_target: '_blank',
    link_title: false,
    nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp need Nonbreaking Space Plugin
    file_picker_types: 'media,image',
    file_picker_callback: (callback:Function, value: any, meta:{ fileType:string }) => {
      const input = document.createElement('input')
      input.type = 'file'
      if (meta.fileType === 'image') {
        input.accept = 'image/*'
      } else if (meta.fileType === 'media') {
        input.accept = 'video/*'
      }
      input.onchange = function() {
        if (input.files && input.files.length > 0) {
          const file: File = input.files[0]
          const loading = ElLoadingService({
            target: '.mce-reset',
            lock: true,
            text: Lang.text('upload.md5_begin')
          })
          const upload = new Upload()
          upload.onMd5Progress((loaded: number, total: number) => {
            loading.setText(`MD5: ${percentage(loaded, total)}%`)
          }).onMd5After(() => {
            loading.setText(Lang.text('upload.md5_complete'))
          }).onBefore(() => {
            loading.setText(Lang.text('upload.upload_begin'))
          }).onProgress((loaded: number, total: number) => {
            loading.setText(`${Lang.text('upload.text')}: ${percentage(loaded, total)}`)
          }).onAfter(() => {
            loading.setText(Lang.text('upload.merge'))
          })
          const promise = meta.fileType === 'image' ? upload.save(file) : upload.partSave(file)

          promise.then((url: string) => {
            loading.setText(Lang.text('upload.upload_complete'))
            callback(url, { title: file.name })
          }).catch(() => {
            loading.setText(Lang.text('upload.upload_fail'))
          })
        }
      }
      input.click()
    },
    init_instance_callback: (editor) => {
      if (props.modelValue) {
        editor.setContent(props.modelValue)
      }
      editor.on('NodeChange Change KeyUp SetContent', () => {
        change = true
        const content = editor.getContent()
        emit('update:modelValue', content)
        if (!content) change = false
      })
    },
    setup(editor) {
      editor.on('FullscreenStateChanged', (e) => {
        fullscreen.value = e.state
      })
    }
  }

  const language = getSymbol().tinymce
  if (language && language !== 'en_US') config.language = language
  window.tinymce.init(config)
}

function destroyTinymce() {
  const tinymce = window.tinymce.get(props.tinymceId)
  if (fullscreen.value) {
    tinymce.execCommand('mceFullScreen')
  }

  if (tinymce) {
    tinymce.destroy()
  }
}

onMounted(() => {
  asyncLoadScript(tinymceCDN).then(() => {
    initTinymce()
  })
})

onUnmounted(() => {
  destroyTinymce()
})

watch(
  () => props.modelValue,
  function(value) {
    if (!change) {
      window.tinymce.get(props.tinymceId).setContent(value || '')
    }
    if (change) change = false
  }
)

watch(
  locale,
  function() {
    window.tinymce.EditorManager.execCommand('mceRemoveEditor', true, props.tinymceId)
    const language = getSymbol().tinymce
    window.tinymce.i18n.setCode(language)
    if (language !== 'en_US') {
      window.tinymce.settings.language = language
    } else {
      Reflect.deleteProperty(window.tinymce.settings, 'language')
    }
    window.tinymce.EditorManager.execCommand('mceAddEditor', true, props.tinymceId)
  }
)

</script>

<style lang="scss" scoped>
.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}
</style>
