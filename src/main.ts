import Vue, { DirectiveOptions } from 'vue'

import 'normalize.css'
import ElementUI from 'element-ui'
import SvgIcon from 'vue-svgicon'

import '@/styles/element-variables.scss'
import '@/styles/index.scss'
import Component from 'vue-class-component'

import App from '@/App.vue'
import store from '@/store'
import { AppModule } from '@/store/modules/app'
import router from '@/router'
import i18n from '@/lang'
import '@/icons/components'
import '@/permission'
import '@/utils/error-log'
import '@/pwa/register-service-worker'
import * as directives from '@/directives'
import * as filters from '@/filters'
import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'

Vue.use(ElementUI, {
  size: AppModule.size, // Set element-ui default size
  i18n: (key: string, value: string) => i18n.t(key, value)
})

Vue.use(SvgIcon, {
  tagName: 'svg-icon',
  defaultWidth: '1em',
  defaultHeight: '1em'
})

Component.registerHooks([
  'beforeRouteEnter', // 进入路由之前
  'beforeRouteLeave', // 离开路由之前
  'beforeRouteUpdate'
])

// Register global directives
Object.keys(directives).forEach(key => {
  Vue.directive(key, (directives as { [key: string ]: DirectiveOptions })[key])
})

// Register global filter functions
Object.keys(filters).forEach(key => {
  Vue.filter(key, (filters as { [key: string ]: Function })[key])
})

Vue.config.productionTip = false

if (window.location.host === 'szjw-bss-web.yunniao.cn') {
  Sentry.init({
    Vue,
    dsn: 'https://08a5a7a0aa944b118317eaf044afcbe0@o496888.ingest.sentry.io/5572228',
    autoSessionTracking: true,
    integrations: [
      new Integrations.BrowserTracing()
    ],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0
  })
}

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App)
}).$mount('#app')
