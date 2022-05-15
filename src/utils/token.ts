import LocalStorage from './storage'

const tokenKey = 'admin_access_token'

/**
 * 获取访问Token
 * @returns 访问Token
 */
export function getToken(): string {
  return LocalStorage.get(tokenKey)
}

/**
 * 设置访问Token
 * @param token 访问Token
 */
export function setToken(token: string): void {
  LocalStorage.set(tokenKey, token)
}

/**
 * 清除访问Token
 */
export function clearToken(): void {
  LocalStorage.remove(tokenKey)
}
