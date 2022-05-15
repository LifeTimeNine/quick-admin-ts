
export default {
  set(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value))
  },
  get(key: string): any {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  },
  remove(key: string): void {
    localStorage.removeItem(key)
  },
  clear(): void {
    localStorage.clear()
  }
}
