'use strict'
const { defineConfig } = require('@vue/cli-service')
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}
const port = process.env.port || process.env.npm_config_port || 9528

module.exports = defineConfig({
  lintOnSave: false,
  productionSourceMap: false,
  transpileDependencies: true,

  devServer: {
    port: port,
    open: false
  },

  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },

  chainWebpack(config) {
    config.plugins.delete('prefetch')

    config.module.rule('svg').exclude.add(resolve('src/icon')).end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icon'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
    config.resolve.alias.set('vue-i18n', 'vue-i18n/dist/vue-i18n.cjs.js')
  },

  css: {
    loaderOptions: {
      css: {
        modules: {
          mode: 'icss'
        }
      }
    }
  },

  assetsDir: 'static'
})
