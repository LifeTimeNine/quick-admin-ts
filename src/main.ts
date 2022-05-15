import { createApp } from 'vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import store from './store'
import components from './components'
import directive from './directive'
import icon from './icon'
import nodes from './apis/nodes'
import lang from './lang'
import { get, post, action } from './utils/request'
import './permission'
import '@/theme'
import '@/style/index.scss'

const app = createApp(App)

// 挂载节点列表
app.config.globalProperties.$nodes = nodes
// 挂载请求方法
app.config.globalProperties.$get = get
app.config.globalProperties.$post = post
// 挂载快捷操作方法
app.config.globalProperties.$action = action

app.use(ElementPlus)
app.use(store)
app.use(router)
app.use(components)
app.use(directive)
app.use(icon)
app.use(lang)

app.mount('#app')
