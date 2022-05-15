import store from '@/store'

const auth = (node: string): boolean => {
  const nodes: string[] = store.getters['user/nodes']
  return nodes.includes(node)
}

export default auth
