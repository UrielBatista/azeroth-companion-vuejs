const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  devServer: {
    allowedHosts: 'azeroth-companion.up.railway.app'
  }
})
