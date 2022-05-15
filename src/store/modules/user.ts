import { pwdLogin, userInfo, getMenu, logout } from '@/apis/modules/systemUser'
import { LoginData, Menu, PwdLoginParams, UserInfo } from '@/interface/systemUser'
import { clearToken, getToken, setToken } from '@/utils/token'
import { Commit } from 'vuex'

export interface UserSate {
  token: string|null
  menus: Menu[]
  nodes: string[]
  menuPaths: string[]
  userInfo: UserInfo
}

const defaultState = (): UserSate => {
  return {
    token: getToken(),
    menus: [],
    nodes: [],
    menuPaths: [],
    userInfo: {
      username: '',
      mobile: '',
      email: null,
      avatar: null,
      name: ''
    }
  }
}

const getters = {
  token(state: UserSate): string|null {
    return state.token
  },
  menus(state: UserSate): Menu[] {
    return state.menus
  },
  nodes(state: UserSate): string[] {
    return state.nodes
  },
  menuPaths(state: UserSate): string[] {
    return state.menuPaths
  },
  userInfo(state: UserSate): UserInfo {
    return state.userInfo
  }
}

const mutations = {
  RESET_STATE: (state: UserSate): void => {
    Object.assign(state, defaultState())
  },
  SET_TOKEN: (state: UserSate, token: string): void => {
    setToken(token)
    state.token = token
  },
  REMOVE_TOKEN: (state: UserSate): void => {
    clearToken()
    state.token = null
  },
  SET_USER_INFO: (state: UserSate, userInfo: UserInfo): void => {
    state.userInfo = userInfo
  },
  SET_MENUS: (state: UserSate, menus: Array<Menu>): void => {
    menus.unshift({
      id: 0,
      title: 'dashboard',
      icon: 'dashboard',
      url: '/dashboard',
      params: null,
      children: []
    })
    state.menus = menus
  },
  SET_NODES: (state: UserSate, nodes: Array<string>): void => {
    state.nodes = nodes
  },
  SET_MENU_PATHS: (state: UserSate, menuPaths: Array<string>): void => {
    state.menuPaths = menuPaths
  }
}

const actions = {
  removeToken({ commit }: { commit: Commit }) {
    return new Promise<void>((resolve) => {
      commit('REMOVE_TOKEN')
      resolve()
    })
  },
  pwdLogin({ commit }: { commit: Commit }, data: PwdLoginParams): Promise<{ map: LoginData }> {
    return new Promise((resolve, reject) => {
      pwdLogin(data).then((data: { map: LoginData }) => {
        commit('SET_TOKEN', data.map.access_token)
        resolve(data)
      }).catch(e => {
        reject(e)
      })
    })
  },
  logout({ commit }: { commit: Commit }): Promise<void> {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        commit('REMOVE_TOKEN')
        commit('RESET_STATE')
        resolve()
      }).catch(e => {
        reject(e)
      })
    })
  },
  getUserInfo({ commit }: { commit: Commit }): Promise<{ map: UserInfo }> {
    return new Promise((resolve, reject) => {
      userInfo().then((data: { map: UserInfo }) => {
        commit('SET_USER_INFO', data.map)
        resolve(data)
      }).catch(e => {
        reject(e)
      })
    })
  },
  getMenu({ commit }: { commit: Commit }): Promise<{ map: { nodes: string[], menus: Menu[] } }> {
    return new Promise((resolve, reject) => {
      getMenu().then((data: { map: { nodes: string[], menus: Menu[] } }) => {
        commit('SET_NODES', data.map.nodes)
        commit('SET_MENUS', data.map.menus)
        const getMenuPaths = (menus: Menu[]): string[] => {
          let paths: string[] = []
          menus.forEach((item: Menu) => {
            if (item.url === '#' && item.children.length > 0) {
              paths = paths.concat(getMenuPaths(item.children))
            } else {
              paths.push(item.url)
            }
          })
          return paths
        }
        commit('SET_MENU_PATHS', getMenuPaths(data.map.menus))
        resolve(data)
      }).catch(e => {
        reject(e)
      })
    })
  }
}

export default {
  namespaced: true,
  state: defaultState(),
  getters,
  actions,
  mutations
}
