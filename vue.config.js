module.exports = {
  publicPath:
    process.env.NODE_ENV === 'production' ? '/Bicycle-Lane-Map/' : '/',
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'Bicycle Lane Map'
      args[0].keywords = '自行車道地圖資訊整合網'
      args[0].description = '即時更新自行車租借資訊，不怕到站車位空！'
      return args
    })
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "~@/assets/scss/utils/_variables.scss";
          @import "~@/assets/scss/utils/_mixins.scss";
        `
      }
    }
  }
}
