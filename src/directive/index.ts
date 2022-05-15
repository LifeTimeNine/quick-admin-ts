import { App } from 'vue'
import auth from './modules/auth'

export default {
  install(app: App) {
    app.directive('auth', auth)
  }
}
