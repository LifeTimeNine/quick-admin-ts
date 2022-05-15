import { App } from 'vue'
import SvgIcon from './SvgIcon/index.vue'
import Upload from './Upload/index.vue'
import FormDialog from './FormDialog/index.vue'
import DataList from './DataList/index.vue'

export default {
  install(app: App) {
    app.component(SvgIcon.name, SvgIcon)
    app.component(Upload.name, Upload)
    app.component(FormDialog.name, FormDialog)
    app.component(DataList.name, DataList)
  }
}
