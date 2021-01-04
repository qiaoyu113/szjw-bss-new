const path = require('path')
const SentryWebpackPlugin = require('@sentry/webpack-plugin')

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, on Mac: sudo npm run / sudo yarn
const devServerPort = 9588 // TODO: get this variable from setting.ts
const mockServerPort = 9528 // TODO: get this variable from setting.ts
const name = '云鸟科技有限公司' // TODO: get this variable from setting.ts

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  lintOnSave: process.env.NODE_ENV === 'development',
  outputDir: 'web',
  productionSourceMap: false,
  devServer: {
    port: devServerPort,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      // change xxx-api/login => /mock-api/v1/login
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      '/api/mock': {
        target: 'http://yapi.ynimg.cn:8888',
        changeOrigin: true,
        pathRewrite: {
          '/api/mock': '/mock'
        }
      },
      [process.env.VUE_APP_BASE_API]: {
        // target: `http://localhost:${mockServerPort}/mock-api/v1`,
        target: `http://szjw-bss-web-m1.yunniao.cn`,
        // target: `http://szjw-domain-gateway.d2.yunniao.cn`,
        changeOrigin: true, // needed for virtual hosted sites
        secure: false,
        ws: true, // proxy websockets
        pathRewrite: {
          // ['^' + process.env.VUE_APP_BASE_API + '']: ''
        }
      }
    }
  },
  pwa: {
    name: name,
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: path.resolve(__dirname, 'src/pwa/service-worker.js')
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, 'src/styles/_variables.scss'),
        path.resolve(__dirname, 'src/styles/_mixins.scss')
      ]
    }
  },
  // other configuration
  configureWebpack: {
    plugins: [
      new SentryWebpackPlugin({
        // sentry-cli configuration
        authToken: 'e4512f5bd6fc49ab81461a62ad5e278070cbd248ece94bcfaf10eb91d47dc8a9',
        release: 'szjw-web',
        org: 'sentry',
        project: 'szjw-web',

        // webpack specific configuration
        include: 'web/static/js/', // 需要上传到sentry服务器的资源目录,会自动匹配js 以及map文件
        configFile: '.sentryclirc',
        ignore: ['node_modules', 'webpack.config.js'],
        urlPrefix: '~/static/js' //  线上对应的url资源的相对路径 比如我的域名是 http://XXX  .com/,静态资源都在 static文件夹里面,
      })
    ]
  },
  chainWebpack(config) {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    config.set('name', name)

    // https://webpack.js.org/configuration/devtool/#development
    config
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      )

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: path.resolve(__dirname, 'src/components'),
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
