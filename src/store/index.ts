import { createStore } from 'vuex'
import app, { AppState } from './modules/app'
import user, { UserSate } from './modules/user'

export interface RootState {
  app: AppState
  user: UserSate
}

export default createStore<RootState>({
  modules: {
    app,
    user
  }
})
