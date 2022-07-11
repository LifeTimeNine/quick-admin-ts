import { basic } from '@/apis/modules/systemConfig'
import { BasicConfig } from '@/interface/systemConfig'
import Storage from '@/utils/storage'
import { Commit } from 'vuex'

export interface AppState {
  sidebarOpened: boolean
  theme: string
  menuActive: string|null
  basicConfig: BasicConfig|null
}

const sidebarOpenedKey = 'sidebarOpened'
const themeKey = 'system_theme'

const state: AppState = {
  sidebarOpened: !!Storage.get(sidebarOpenedKey),
  theme: Storage.get(themeKey) || 'default',
  menuActive: null,
  basicConfig: null
}

const getters = {
  sidebarOpened(state: AppState): boolean {
    return state.sidebarOpened
  },
  theme(state: AppState): string {
    return state.theme
  },
  menuActive(state: AppState): string|null {
    return state.menuActive
  }
}

const mutations = {
  TOGGLE_SIDEBAR(state: AppState): void {
    state.sidebarOpened = !state.sidebarOpened
    Storage.set(sidebarOpenedKey, state.sidebarOpened)
  },
  SET_THEME(state: AppState, theme: string): void {
    state.theme = theme
    Storage.set(themeKey, theme)
  },
  MENU_ACTIVE(state: AppState, index: string): void {
    state.menuActive = index
  },
  SET_BASIC_CONFIG(state: AppState, config: BasicConfig): void {
    state.basicConfig = config
  }
}

const actions = {
  toggleSidebar({ commit }: { commit: Commit }): void {
    commit('TOGGLE_SIDEBAR')
  },
  setTheme({ commit }: { commit: Commit }, theme: string): void {
    commit('SET_THEME', theme)
  },
  getBasicConfig({ commit }: { commit: Commit }): Promise<BasicConfig> {
    return new Promise((resolve, reject) => {
      basic().then((config: { map: BasicConfig }) => {
        commit('SET_BASIC_CONFIG', config.map)
        resolve(config.map)
      }).catch(e => {
        reject(e)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
