import Tree from './src'

const components = [
  Tree
]

const install = (Vue) => {
  if (install.installed) {
    return
  }

  components.forEach(component => {
    Vue.use(component)
  })

  // todo
}
export default {
  install
}