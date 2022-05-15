import { languageStorageKey } from '@/lang'
import Storage from '@/utils/storage'
import { Commit } from 'vuex'

export interface AppState {
  sidebarOpened: boolean
  theme: string
  menuActive: string|null
}

const sidebarOpenedKey = 'sidebarOpened'
const themeKey = 'system_theme'

const state: AppState = {
  sidebarOpened: !!Storage.get(sidebarOpenedKey),
  theme: Storage.get(themeKey) || 'default',
  menuActive: null
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
  }
}

const actions = {
  toggleSidebar({ commit }: { commit: Commit }): void {
    commit('TOGGLE_SIDEBAR')
  },
  setTheme({ commit }: { commit: Commit }, theme: string): void {
    commit('SET_THEME', theme)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
